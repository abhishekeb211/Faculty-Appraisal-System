"""
Security Utilities

Provides encryption, OTP generation, rate limiting, and other security features.
"""

import secrets
import string
import hashlib
import time
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify
from collections import defaultdict


# Rate limiting storage (in production, use Redis)
_rate_limit_storage = defaultdict(list)


def generate_otp(length=6):
    """
    Generate cryptographically secure OTP
    
    Args:
        length: Length of OTP (default 6)
        
    Returns:
        OTP string containing only digits
    """
    digits = string.digits
    otp = ''.join(secrets.choice(digits) for _ in range(length))
    return otp


def generate_secure_token(length=32):
    """
    Generate cryptographically secure random token
    
    Args:
        length: Length of token
        
    Returns:
        URL-safe token string
    """
    return secrets.token_urlsafe(length)


def hash_string(value):
    """
    Generate SHA-256 hash of string
    
    Args:
        value: String to hash
        
    Returns:
        Hex digest of hash
    """
    return hashlib.sha256(value.encode('utf-8')).hexdigest()


def rate_limit(max_requests, window_seconds):
    """
    Rate limiting decorator
    
    Limits number of requests from same IP within time window
    
    Args:
        max_requests: Maximum number of requests allowed
        window_seconds: Time window in seconds
        
    Usage:
        @bp.route('/login', methods=['POST'])
        @rate_limit(max_requests=5, window_seconds=900)  # 5 requests per 15 minutes
        def login():
            return jsonify({"message": "Login successful"})
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Get client identifier (IP address)
            client_id = request.remote_addr
            
            # Create unique key for this endpoint and client
            endpoint = request.endpoint or 'unknown'
            key = f"{endpoint}:{client_id}"
            
            # Get current time
            now = time.time()
            
            # Clean old requests outside window
            _rate_limit_storage[key] = [
                req_time for req_time in _rate_limit_storage[key]
                if now - req_time < window_seconds
            ]
            
            # Check if limit exceeded
            if len(_rate_limit_storage[key]) >= max_requests:
                return jsonify({
                    "error": "Rate limit exceeded",
                    "message": f"Too many requests. Please try again in {window_seconds} seconds."
                }), 429
            
            # Add current request
            _rate_limit_storage[key].append(now)
            
            return f(*args, **kwargs)
        
        return decorated_function
    return decorator


def check_password_strength(password):
    """
    Check password strength
    
    Args:
        password: Password to check
        
    Returns:
        Dict with strength score and feedback
    """
    score = 0
    feedback = []
    
    # Length
    if len(password) >= 8:
        score += 1
    else:
        feedback.append("Password should be at least 8 characters")
    
    if len(password) >= 12:
        score += 1
    
    # Complexity
    if re.search(r'[a-z]', password):
        score += 1
    else:
        feedback.append("Add lowercase letters")
    
    if re.search(r'[A-Z]', password):
        score += 1
    else:
        feedback.append("Add uppercase letters")
    
    if re.search(r'\d', password):
        score += 1
    else:
        feedback.append("Add numbers")
    
    if re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        score += 1
    else:
        feedback.append("Add special characters")
    
    # Common patterns (reduce score)
    common_patterns = ['123', 'abc', 'password', 'qwerty']
    if any(pattern in password.lower() for pattern in common_patterns):
        score -= 1
        feedback.append("Avoid common patterns")
    
    # Calculate strength level
    if score >= 6:
        strength = "strong"
    elif score >= 4:
        strength = "medium"
    else:
        strength = "weak"
    
    return {
        "score": max(0, score),
        "strength": strength,
        "feedback": feedback
    }


# Import for check_password_strength
import re


def store_otp(db, user_id, otp, expiry_minutes=10):
    """
    Store OTP in database with expiration
    
    Args:
        db: Database connection
        user_id: User identifier
        otp: OTP code
        expiry_minutes: Minutes until OTP expires
    """
    db.otp_store.update_one(
        {"userId": user_id},
        {
            "$set": {
                "otp": hash_string(otp),  # Store hashed OTP
                "createdAt": datetime.utcnow(),
                "expiresAt": datetime.utcnow() + timedelta(minutes=expiry_minutes),
                "attempts": 0,
                "verified": False
            }
        },
        upsert=True
    )


def verify_otp(db, user_id, otp, max_attempts=3):
    """
    Verify OTP for user
    
    Args:
        db: Database connection
        user_id: User identifier
        otp: OTP code to verify
        max_attempts: Maximum verification attempts allowed
        
    Returns:
        True if OTP is valid, False otherwise
    """
    stored = db.otp_store.find_one({"userId": user_id})
    
    if not stored:
        return False
    
    # Check if already verified
    if stored.get('verified'):
        return False
    
    # Check expiration
    if datetime.utcnow() > stored.get('expiresAt'):
        return False
    
    # Check attempts
    if stored.get('attempts', 0) >= max_attempts:
        return False
    
    # Increment attempts
    db.otp_store.update_one(
        {"userId": user_id},
        {"$inc": {"attempts": 1}}
    )
    
    # Verify OTP
    if hash_string(otp) == stored.get('otp'):
        # Mark as verified
        db.otp_store.update_one(
            {"userId": user_id},
            {"$set": {"verified": True}}
        )
        return True
    
    return False


def cleanup_expired_otps(db):
    """
    Remove expired OTPs from database
    
    Args:
        db: Database connection
    """
    db.otp_store.delete_many({
        "expiresAt": {"$lt": datetime.utcnow()}
    })


def generate_csrf_token():
    """
    Generate CSRF token
    
    Returns:
        CSRF token string
    """
    return generate_secure_token(32)


def sanitize_filename(filename):
    """
    Sanitize filename to prevent directory traversal
    
    Args:
        filename: Original filename
        
    Returns:
        Sanitized filename
    """
    # Remove path separators
    filename = filename.replace('/', '').replace('\\', '')
    
    # Remove dangerous characters
    filename = re.sub(r'[^\w\s\-\.]', '', filename)
    
    # Limit length
    if len(filename) > 255:
        name, ext = filename.rsplit('.', 1) if '.' in filename else (filename, '')
        filename = name[:250] + ('.' + ext if ext else '')
    
    return filename


def constant_time_compare(val1, val2):
    """
    Compare two strings in constant time to prevent timing attacks
    
    Args:
        val1: First string
        val2: Second string
        
    Returns:
        True if equal, False otherwise
    """
    if len(val1) != len(val2):
        return False
    
    result = 0
    for x, y in zip(val1, val2):
        result |= ord(x) ^ ord(y)
    
    return result == 0
