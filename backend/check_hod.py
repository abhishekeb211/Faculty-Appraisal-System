from pymongo import MongoClient
import bcrypt

client = MongoClient('mongodb://localhost:27017/')
db = client['faculty_appraisal_db']

# Test HOD credentials
user = db.users.find_one({"userId": "hod_test"})

if user:
    print(f"User found: {user['userId']}")
    print(f"Name: {user['name']}")
    print(f"Role: {user['role']}")
    
    # Test password
    password = "HOD@123"
    if bcrypt.checkpw(password.encode('utf-8'), user['password']):
        print(f"\n[SUCCESS] Password 'HOD@123' is CORRECT")
    else:
        print(f"\n[ERROR] Password 'HOD@123' is INCORRECT")
else:
    print("[ERROR] User not found")
