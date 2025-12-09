from flask import Blueprint, request, jsonify
from bson import ObjectId
import bcrypt
from utils.database import get_db

bp = Blueprint('auth', __name__)

def _get_db():
    """Lazy database getter"""
    return get_db()

@bp.route('/login', methods=['POST'])
def login():
    """User login endpoint"""
    try:
        data = request.json
        user_id = data.get('userId')
        password = data.get('password')
        
        if not user_id or not password:
            return jsonify({"error": "UserId and password are required"}), 400
        
        # Find user in database
        db = _get_db()
        user = db.users.find_one({"userId": user_id})
        
        if not user:
            return jsonify({"error": "Invalid credentials"}), 401
        
        # Verify password
        if bcrypt.checkpw(password.encode('utf-8'), user['password']):
            # Return user data (exclude password)
            user_data = {
                "_id": str(user['_id']),
                "name": user.get('name'),
                "email": user.get('email'),
                "dept": user.get('dept'),
                "role": user.get('role'),
                "desg": user.get('desg', user.get('role'))
            }
            return jsonify(user_data), 200
        else:
            return jsonify({"error": "Invalid credentials"}), 401
            
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({"error": "An error occurred during login"}), 500

@bp.route('/send-otp', methods=['POST'])
def send_otp():
    """Send OTP for password reset"""
    try:
        data = request.json
        user_id = data.get('userId')
        
        # Check if user exists
        db = _get_db()
        user = db.users.find_one({"userId": user_id})
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # In a real implementation, generate and send OTP via email
        # For testing, return success
        return jsonify({"message": "OTP sent successfully", "otp": "123456"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    """Verify OTP"""
    try:
        data = request.json
        # For testing, any OTP works
        return jsonify({"message": "OTP verified successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/reset-user-password', methods=['POST'])
def reset_password():
    """Reset user password"""
    try:
        data = request.json
        user_id = data.get('userId')
        new_password = data.get('newPassword')
        
        if not user_id or not new_password:
            return jsonify({"error": "UserId and new password are required"}), 400
        
        # Hash the new password
        hashed = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
        
        # Update user password
        db = _get_db()
        result = db.users.update_one(
            {"userId": user_id},
            {"$set": {"password": hashed}}
        )
        
        if result.modified_count > 0:
            return jsonify({"message": "Password reset successfully"}), 200
        else:
            return jsonify({"error": "User not found"}), 404
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/update-profile', methods=['POST'])
def update_profile():
    """Update user profile"""
    try:
        data = request.json
        user_id = data.get('userId')
        
        # Remove userId from update data
        update_data = {k: v for k, v in data.items() if k != 'userId'}
        
        db = _get_db()
        result = db.users.update_one(
            {"userId": user_id},
            {"$set": update_data}
        )
        
        if result.modified_count > 0:
            return jsonify({"message": "Profile updated successfully"}), 200
        else:
            return jsonify({"message": "No changes made"}), 200
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/users', methods=['GET'])
def get_all_users():
    """Get all users (for admin)"""
    try:
        db = _get_db()
        users = list(db.users.find({}, {"password": 0}))
        # Convert ObjectId to string
        for user in users:
            user['_id'] = str(user['_id'])
        return jsonify(users), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    """Get specific user by ID"""
    try:
        db = _get_db()
        user = db.users.find_one({"_id": ObjectId(user_id)}, {"password": 0})
        if user:
            user['_id'] = str(user['_id'])
            return jsonify(user), 200
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
