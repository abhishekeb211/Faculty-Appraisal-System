"""
JWT Authentication Middleware for Faculty Appraisal System

This module provides JWT-based authentication and role-based authorization
for protecting API endpoints.
"""

import jwt
import os
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify
from utils.database import get_db

# JWT Configuration
JWT_SECRET = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = int(os.getenv('JWT_EXPIRATION_HOURS', 24))

# Token blacklist (in production, use Redis)
_token_blacklist = set()


def generate_token(user_id, role, name, email, dept):
    """
    Generate JWT token for authenticated user
    
    Args:
        user_id: User's unique identifier
        role: User's role (Faculty, Admin, HOD, etc.)
        name: User's full name
        email: User's email
        dept: User's department
        
    Returns:
        JWT token string
    """
    payload = {
        'user_id': user_id,
        'role': role,
        'name': name,
        'email': email,
        'dept': dept,
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token


def verify_token(token):
    """
    Verify and decode JWT token
    
    Args:
        token: JWT token string
        
    Returns:
        Decoded payload dict or None if invalid
    """
    try:
        # Check if token is blacklisted
        if token in _token_blacklist:
            return None
            
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def blacklist_token(token):
    """Add token to blacklist (for logout)"""
    _token_blacklist.add(token)


def require_auth(f):
    """
    Decorator to require authentication for an endpoint
    
    Usage:
        @bp.route('/protected')
        @require_auth
        def protected_route():
            # Access current_user from request
            user = request.current_user
            return jsonify({"message": f"Hello {user['name']}"})
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return jsonify({"error": "No authorization token provided"}), 401
        
        # Extract token (format: "Bearer <token>")
        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return jsonify({"error": "Invalid authorization header format"}), 401
        
        token = parts[1]
        
        # Verify token
        payload = verify_token(token)
        if not payload:
            return jsonify({"error": "Invalid or expired token"}), 401
        
        # Attach user info to request
        request.current_user = payload
        request.token = token
        
        return f(*args, **kwargs)
    
    return decorated_function


def require_role(allowed_roles):
    """
    Decorator to require specific role(s) for an endpoint
    
    Args:
        allowed_roles: List of allowed role names or single role string
        
    Usage:
        @bp.route('/admin-only')
        @require_auth
        @require_role(['Admin'])
        def admin_route():
            return jsonify({"message": "Admin access granted"})
            
        @bp.route('/hod-dean')
        @require_auth
        @require_role(['HOD', 'Dean'])
        def hod_dean_route():
            return jsonify({"message": "HOD or Dean access granted"})
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Ensure authentication has run first
            if not hasattr(request, 'current_user'):
                return jsonify({"error": "Authentication required"}), 401
            
            # Convert single role to list
            roles = allowed_roles if isinstance(allowed_roles, list) else [allowed_roles]
            
            # Check if user has required role
            user_role = request.current_user.get('role')
            if user_role not in roles:
                return jsonify({
                    "error": "Insufficient permissions",
                    "required_roles": roles,
                    "your_role": user_role
                }), 403
            
            return f(*args, **kwargs)
        
        return decorated_function
    return decorator


def require_department_access(f):
    """
    Decorator to ensure user can only access their own department data
    
    Extracts department from URL parameter and validates against user's department.
    Admin role bypasses this check.
    
    Usage:
        @bp.route('/hod/<department>/faculty')
        @require_auth
        @require_role(['HOD'])
        @require_department_access
        def get_department_faculty(department):
            # User can only access if department matches their dept
            return jsonify({"department": department})
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not hasattr(request, 'current_user'):
            return jsonify({"error": "Authentication required"}), 401
        
        user = request.current_user
        user_role = user.get('role')
        user_dept = user.get('dept')
        
        # Admin can access all departments
        if user_role == 'Admin':
            return f(*args, **kwargs)
        
        # Get department from URL parameter
        url_dept = kwargs.get('department')
        
        if url_dept and url_dept != user_dept:
            return jsonify({
                "error": "Access denied to this department",
                "your_department": user_dept,
                "requested_department": url_dept
            }), 403
        
        return f(*args, **kwargs)
    
    return decorated_function


def optional_auth(f):
    """
    Decorator for endpoints that work with or without authentication
    If token is provided and valid, attaches user info to request
    If no token or invalid token, continues without user info
    
    Usage:
        @bp.route('/public-or-private')
        @optional_auth
        def mixed_route():
            if hasattr(request, 'current_user'):
                return jsonify({"message": f"Hello {request.current_user['name']}"})
            return jsonify({"message": "Hello guest"})
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if auth_header:
            parts = auth_header.split()
            if len(parts) == 2 and parts[0].lower() == 'bearer':
                token = parts[1]
                payload = verify_token(token)
                if payload:
                    request.current_user = payload
                    request.token = token
        
        return f(*args, **kwargs)
    
    return decorated_function


def refresh_token(old_token):
    """
    Generate a new token with extended expiration
    
    Args:
        old_token: Current valid JWT token
        
    Returns:
        New JWT token or None if old token is invalid
    """
    payload = verify_token(old_token)
    if not payload:
        return None
    
    # Generate new token with same user data
    new_token = generate_token(
        user_id=payload['user_id'],
        role=payload['role'],
        name=payload['name'],
        email=payload['email'],
        dept=payload['dept']
    )
    
    # Optionally blacklist old token
    # blacklist_token(old_token)
    
    return new_token
