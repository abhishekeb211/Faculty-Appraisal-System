"""
Input Validation and Sanitization Utilities

Provides validators and sanitizers to protect against:
- NoSQL injection
- XSS attacks
- Invalid data formats
- SQL injection attempts
"""

import re
from bson import ObjectId
from bson.errors import InvalidId


# Allowed values for whitelisting
ALLOWED_ROLES = ['Faculty', 'Admin', 'HOD', 'Dean', 'Director', 'Verification Team', 'external']
ALLOWED_DEPARTMENTS = ['CSE', 'ECE', 'ME', 'CE', 'EEE', 'IT', 'CHEM', 'PHY', 'MATH']
ALLOWED_DESIGNATIONS = ['Professor', 'Associate Professor', 'Assistant Professor', 'HOD', 'Dean', 'Associate Dean', 'Director', 'Verifier']


class ValidationError(Exception):
    """Custom exception for validation errors"""
    pass


def validate_email(email):
    """
    Validate email format
    
    Args:
        email: Email string to validate
        
    Returns:
        True if valid
        
    Raises:
        ValidationError if invalid
    """
    if not email:
        raise ValidationError("Email is required")
    
    # RFC 5322 simplified regex
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    
    if not re.match(pattern, email):
        raise ValidationError("Invalid email format")
    
    if len(email) > 254:
        raise ValidationError("Email too long")
    
    return True


def validate_password(password, require_complexity=True):
    """
    Validate password strength
    
    Args:
        password: Password string to validate
        require_complexity: Whether to enforce complexity requirements
        
    Returns:
        True if valid
        
    Raises:
        ValidationError if invalid
    """
    if not password:
        raise ValidationError("Password is required")
    
    if len(password) < 8:
        raise ValidationError("Password must be at least 8 characters long")
    
    if len(password) > 128:
        raise ValidationError("Password too long")
    
    if require_complexity:
        # Check for uppercase, lowercase, digit, and special character
        if not re.search(r'[A-Z]', password):
            raise ValidationError("Password must contain at least one uppercase letter")
        
        if not re.search(r'[a-z]', password):
            raise ValidationError("Password must contain at least one lowercase letter")
        
        if not re.search(r'\d', password):
            raise ValidationError("Password must contain at least one digit")
        
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            raise ValidationError("Password must contain at least one special character")
    
    return True


def validate_objectid(object_id):
    """
    Validate MongoDB ObjectId format
    
    Args:
        object_id: String to validate as ObjectId
        
    Returns:
        ObjectId instance if valid
        
    Raises:
        ValidationError if invalid
    """
    if not object_id:
        raise ValidationError("ObjectId is required")
    
    try:
        return ObjectId(object_id)
    except (InvalidId, TypeError):
        raise ValidationError(f"Invalid ObjectId format: {object_id}")


def validate_role(role):
    """
    Validate role against whitelist
    
    Args:
        role: Role string to validate
        
    Returns:
        True if valid
        
    Raises:
        ValidationError if invalid
    """
    if not role:
        raise ValidationError("Role is required")
    
    if role not in ALLOWED_ROLES:
        raise ValidationError(f"Invalid role. Allowed roles: {', '.join(ALLOWED_ROLES)}")
    
    return True


def validate_department(department):
    """
    Validate department against whitelist
    
    Args:
        department: Department string to validate
        
    Returns:
        True if valid
        
    Raises:
        ValidationError if invalid
    """
    if not department:
        raise ValidationError("Department is required")
    
    if department not in ALLOWED_DEPARTMENTS:
        raise ValidationError(f"Invalid department. Allowed departments: {', '.join(ALLOWED_DEPARTMENTS)}")
    
    return True


def validate_string_length(value, field_name, min_length=1, max_length=255):
    """
    Validate string length
    
    Args:
        value: String to validate
        field_name: Name of field for error messages
        min_length: Minimum allowed length
        max_length: Maximum allowed length
        
    Returns:
        True if valid
        
    Raises:
        ValidationError if invalid
    """
    if not value:
        raise ValidationError(f"{field_name} is required")
    
    if not isinstance(value, str):
        raise ValidationError(f"{field_name} must be a string")
    
    if len(value) < min_length:
        raise ValidationError(f"{field_name} must be at least {min_length} characters")
    
    if len(value) > max_length:
        raise ValidationError(f"{field_name} must be at most {max_length} characters")
    
    return True


def validate_number_range(value, field_name, min_value=None, max_value=None):
    """
    Validate numeric value is within range
    
    Args:
        value: Number to validate
        field_name: Name of field for error messages
        min_value: Minimum allowed value (inclusive)
        max_value: Maximum allowed value (inclusive)
        
    Returns:
        True if valid
        
    Raises:
        ValidationError if invalid
    """
    if value is None:
        raise ValidationError(f"{field_name} is required")
    
    try:
        num = float(value)
    except (TypeError, ValueError):
        raise ValidationError(f"{field_name} must be a number")
    
    if min_value is not None and num < min_value:
        raise ValidationError(f"{field_name} must be at least {min_value}")
    
    if max_value is not None and num > max_value:
        raise ValidationError(f"{field_name} must be at most {max_value}")
    
    return True


def sanitize_string(value):
    """
    Sanitize string to prevent injection attacks
    
    Args:
        value: String to sanitize
        
    Returns:
        Sanitized string
    """
    if not value:
        return value
    
    if not isinstance(value, str):
        return value
    
    # Remove null bytes
    value = value.replace('\x00', '')
    
    # Strip leading/trailing whitespace
    value = value.strip()
    
    # Escape MongoDB operators
    dangerous_chars = ['$', '{', '}']
    for char in dangerous_chars:
        value = value.replace(char, '')
    
    return value


def sanitize_dict(data, allowed_keys=None):
    """
    Sanitize dictionary to prevent injection
    
    Args:
        data: Dictionary to sanitize
        allowed_keys: Optional list of allowed keys
        
    Returns:
        Sanitized dictionary
    """
    if not isinstance(data, dict):
        return data
    
    sanitized = {}
    
    for key, value in data.items():
        # Remove MongoDB operators in keys
        if key.startswith('$'):
            continue
        
        # Check allowed keys
        if allowed_keys and key not in allowed_keys:
            continue
        
        # Sanitize string values
        if isinstance(value, str):
            sanitized[key] = sanitize_string(value)
        elif isinstance(value, dict):
            sanitized[key] = sanitize_dict(value, allowed_keys)
        elif isinstance(value, list):
            sanitized[key] = [sanitize_string(v) if isinstance(v, str) else v for v in value]
        else:
            sanitized[key] = value
    
    return sanitized


def validate_user_id(user_id):
    """
    Validate user ID format
    
    Args:
        user_id: User ID string
        
    Returns:
        True if valid
        
    Raises:
        ValidationError if invalid
    """
    if not user_id:
        raise ValidationError("User ID is required")
    
    # Allow alphanumeric and limited special characters
    pattern = r'^[a-zA-Z0-9_-]{3,50}$'
    
    if not re.match(pattern, user_id):
        raise ValidationError("User ID must be 3-50 characters (letters, numbers, underscore, hyphen only)")
    
    return True


def validate_phone(phone):
    """
    Validate phone number format
    
    Args:
        phone: Phone number string
        
    Returns:
        True if valid
        
    Raises:
        ValidationError if invalid
    """
    if not phone:
        return True  # Phone is optional
    
    # Remove common formatting characters
    digits = re.sub(r'[\s\-\(\)\+]', '', phone)
    
    # Check if only digits remain
    if not digits.isdigit():
        raise ValidationError("Phone number must contain only digits")
    
    # Check length (10-15 digits)
    if len(digits) < 10 or len(digits) > 15:
        raise ValidationError("Phone number must be 10-15 digits")
    
    return True


def validate_marks(marks, field_name="Marks"):
    """
    Validate marks/score value
    
    Args:
        marks: Marks value to validate
        field_name: Name of field for error messages
        
    Returns:
        True if valid
        
    Raises:
        ValidationError if invalid
    """
    return validate_number_range(marks, field_name, min_value=0, max_value=100)
