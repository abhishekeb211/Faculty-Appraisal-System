from flask import Blueprint, request, jsonify
from bson import ObjectId
import bcrypt
from utils.database import get_db
from utils.auth_middleware import generate_token, verify_token, blacklist_token, require_auth, require_role
from utils.validation import (
    validate_email, validate_password, validate_objectid, 
    validate_string_length, sanitize_string, ValidationError
)
from utils.security import generate_otp, store_otp, verify_otp, rate_limit

bp = Blueprint('auth', __name__)

def _get_db():
    """Lazy database getter"""
    return get_db()

@bp.route('/login', methods=['POST'])
@rate_limit(max_requests=5, window_seconds=900)  # 5 attempts per 15 minutes
def login():
    """User login endpoint with JWT token generation"""
    try:
        data = request.json
        user_id = sanitize_string(data.get('userId'))
        password = data.get('password')
        
        if not user_id or not password:
            return jsonify({"error": "UserId and password are required"}), 400
        
        # Find user in database
        db = _get_db()
        user = db.users.find_one({"userId": user_id})
        
        if not user:
            return jsonify({"error": "Invalid credentials"}), 401
        
        # Check if user is active
        if not user.get('isActive', True):
            return jsonify({"error": "Account is deactivated"}), 403
        
        # Verify password
        if bcrypt.checkpw(password.encode('utf-8'), user['password']):
            # Generate JWT token
            token = generate_token(
                user_id=str(user['_id']),
                role=user.get('role'),
                name=user.get('name'),
                email=user.get('email'),
                dept=user.get('dept')
            )
            
            # Return token and user data
            return jsonify({
                "token": token,
                "user": {
                    "_id": str(user['_id']),
                    "userId": user.get('userId'),
                    "name": user.get('name'),
                    "email": user.get('email'),
                    "dept": user.get('dept'),
                    "role": user.get('role'),
                    "desg": user.get('desg', user.get('role'))
                }
            }), 200
        else:
            return jsonify({"error": "Invalid credentials"}), 401
            
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({"error": "An error occurred during login"}), 500

@bp.route('/send-otp', methods=['POST'])
@rate_limit(max_requests=3, window_seconds=1800)  # 3 OTPs per 30 minutes
def send_otp():
    """Send OTP for password reset"""
    try:
        data = request.json
        user_id = sanitize_string(data.get('userId'))
        
        if not user_id:
            return jsonify({"error": "UserId is required"}), 400
        
        # Check if user exists
        db = _get_db()
        user = db.users.find_one({"userId": user_id})
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Generate OTP
        otp = generate_otp(6)
        
        # Store OTP in database
        store_otp(db, user_id, otp, expiry_minutes=10)
        
        # TODO: Send OTP via email
        # For development, return OTP in response
        # In production, remove this and only send via email
        return jsonify({
            "message": "OTP sent successfully",
            "otp": otp,  # REMOVE IN PRODUCTION
            "expiresIn": "10 minutes"
        }), 200
        
    except Exception as e:
        print(f"Send OTP error: {e}")
        return jsonify({"error": str(e)}), 500

@bp.route('/verify-otp', methods=['POST'])
@rate_limit(max_requests=10, window_seconds=900)  # 10 verifications per 15 minutes
def verify_otp_endpoint():
    """Verify OTP"""
    try:
        data = request.json
        user_id = sanitize_string(data.get('userId'))
        otp = sanitize_string(data.get('otp'))
        
        if not user_id or not otp:
            return jsonify({"error": "UserId and OTP are required"}), 400
        
        db = _get_db()
        
        # Verify OTP
        if verify_otp(db, user_id, otp):
            return jsonify({"message": "OTP verified successfully"}), 200
        else:
            return jsonify({"error": "Invalid or expired OTP"}), 401
        
    except Exception as e:
        print(f"Verify OTP error: {e}")
        return jsonify({"error": str(e)}), 500

@bp.route('/reset-user-password', methods=['POST'])
@rate_limit(max_requests=5, window_seconds=3600)  # 5 resets per hour
def reset_password():
    """Reset user password"""
    try:
        data = request.json
        user_id = sanitize_string(data.get('userId'))
        new_password = data.get('newPassword')
        
        if not user_id or not new_password:
            return jsonify({"error": "UserId and new password are required"}), 400
        
        # Validate password strength
        try:
            validate_password(new_password, require_complexity=True)
        except ValidationError as e:
            return jsonify({"error": str(e)}), 400
        
        # Hash the new password
        hashed = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt(rounds=12))
        
        # Update user password
        db = _get_db()
        result = db.users.update_one(
            {"userId": user_id},
            {"$set": {"password": hashed}}
        )
        
        if result.modified_count > 0:
            # Clear OTP after successful password reset
            db.otp_store.delete_one({"userId": user_id})
            return jsonify({"message": "Password reset successfully"}), 200
        else:
            return jsonify({"error": "User not found"}), 404
            
    except Exception as e:
        print(f"Reset password error: {e}")
        return jsonify({"error": str(e)}), 500

@bp.route('/update-profile', methods=['POST'])
@require_auth
def update_profile():
    """Update user profile (requires authentication)"""
    try:
        data = request.json
        current_user = request.current_user
        user_id = current_user['user_id']
        
        # Sanitize and validate update data
        allowed_fields = ['name', 'email', 'mobile', 'organization']
        update_data = {}
        
        for field in allowed_fields:
            if field in data:
                value = sanitize_string(data[field])
                
                # Additional validation for specific fields
                if field == 'email':
                    try:
                        validate_email(value)
                    except ValidationError as e:
                        return jsonify({"error": str(e)}), 400
                
                update_data[field] = value
        
        if not update_data:
            return jsonify({"error": "No valid fields to update"}), 400
        
        db = _get_db()
        result = db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        
        if result.modified_count > 0:
            return jsonify({"message": "Profile updated successfully"}), 200
        else:
            return jsonify({"message": "No changes made"}), 200
            
    except Exception as e:
        print(f"Update profile error: {e}")
        return jsonify({"error": str(e)}), 500

@bp.route('/users', methods=['GET'])
@require_auth
@require_role(['Admin'])
def get_all_users():
    """Get all users (Admin only)"""
    try:
        db = _get_db()
        users = list(db.users.find({}, {"password": 0}))
        # Convert ObjectId to string
        for user in users:
            user['_id'] = str(user['_id'])
        return jsonify(users), 200
    except Exception as e:
        print(f"Get users error: {e}")
        return jsonify({"error": str(e)}), 500

@bp.route('/users/<user_id>', methods=['GET'])
@require_auth
def get_user(user_id):
    """Get specific user by ID"""
    try:
        # Validate ObjectId
        try:
            obj_id = validate_objectid(user_id)
        except ValidationError as e:
            return jsonify({"error": str(e)}), 400
        
        current_user = request.current_user
        
        # Users can only view their own profile unless they're Admin
        if current_user['role'] != 'Admin' and current_user['user_id'] != user_id:
            return jsonify({"error": "Insufficient permissions"}), 403
        
        db = _get_db()
        user = db.users.find_one({"_id": obj_id}, {"password": 0})
        if user:
            user['_id'] = str(user['_id'])
            return jsonify(user), 200
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        print(f"Get user error: {e}")
        return jsonify({"error": str(e)}), 500

@bp.route('/logout', methods=['POST'])
@require_auth
def logout():
    """Logout user (invalidate token)"""
    try:
        token = request.token
        blacklist_token(token)
        return jsonify({"message": "Logged out successfully"}), 200
    except Exception as e:
        print(f"Logout error: {e}")
        return jsonify({"error": str(e)}), 500

@bp.route('/refresh-token', methods=['POST'])
@require_auth
def refresh_token_endpoint():
    """Refresh JWT token"""
    try:
        from utils.auth_middleware import refresh_token
        old_token = request.token
        new_token = refresh_token(old_token)
        
        if new_token:
            return jsonify({"token": new_token}), 200
        else:
            return jsonify({"error": "Failed to refresh token"}), 401
    except Exception as e:
        print(f"Refresh token error: {e}")
        return jsonify({"error": str(e)}), 500

@bp.route('/me', methods=['GET'])
@require_auth
def get_current_user():
    """Get current authenticated user info"""
    try:
        return jsonify({"user": request.current_user}), 200
    except Exception as e:
        print(f"Get current user error: {e}")
        return jsonify({"error": str(e)}), 500
