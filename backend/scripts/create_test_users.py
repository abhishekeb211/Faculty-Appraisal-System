"""
Script to create test users for all 7 roles in the Faculty Appraisal System
Run this script to populate the database with test users
"""

from pymongo import MongoClient
import bcrypt
from datetime import datetime

# MongoDB connection
MONGO_URI = "mongodb://localhost:27017/faculty_appraisal_db"
client = MongoClient(MONGO_URI)
db = client.get_database()

# Test users data
test_users = [
    {
        "userId": "faculty_test",
        "password": "Faculty@123",
        "name": "Test Faculty Member",
        "email": "faculty@test.com",
        "dept": "Computer Science",
        "role": "Faculty",
        "desg": "Assistant Professor"
    },
    {
        "userId": "admin_test",
        "password": "Admin@123",
        "name": "Test Administrator",
        "email": "admin@test.com",
        "dept": "Administration",
        "role": "Admin",
        "desg": "System Admin"
    },
    {
        "userId": "hod_test",
        "password": "HOD@123",
        "name": "Test HOD",
        "email": "hod@test.com",
        "dept": "Computer Science",
        "role": "HOD",
        "desg": "Head of Department"
    },
    {
        "userId": "dean_test",
        "password": "Dean@123",
        "name": "Test Dean",
        "email": "dean@test.com",
        "dept": "Engineering",
        "role": "Dean",
        "desg": "Dean of Engineering"
    },
    {
        "userId": "director_test",
        "password": "Director@123",
        "name": "Test Director",
        "email": "director@test.com",
        "dept": "College",
        "role": "Director",
        "desg": "College Director"
    },
    {
        "userId": "verify_test",
        "password": "Verify@123",
        "name": "Test Verification Member",
        "email": "verify@test.com",
        "dept": "Verification",
        "role": "Verification Team",
        "desg": "Verification Specialist"
    },
    {
        "userId": "external_test",
        "password": "External@123",
        "name": "Test External Reviewer",
        "email": "external@test.com",
        "dept": "External",
        "role": "external",
        "desg": "External Reviewer"
    }
]

def create_test_users():
    """Create test users with hashed passwords"""
    print("🔧 Creating test users...")
    
    # Clear existing test users
    db.users.delete_many({"userId": {"$in": [u["userId"] for u in test_users]}})
    print("✅ Cleared existing test users")
    
    # Insert new test users
    for user in test_users:
        # Hash the password
        password = user.pop("password")
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        user["password"] = hashed_password
        user["createdAt"] = datetime.now()
        
        result = db.users.insert_one(user)
        print(f"✅ Created user: {user['userId']} (Role: {user['role']})")
    
    print(f"\n🎉 Successfully created {len(test_users)} test users!")
    print("\n📋 Test Credentials:")
    print("-" * 50)
    for user in test_users:
        # Note: We can't print the password since it's hashed now
        # But we know what the original password was
        original_password = {
            "faculty_test": "Faculty@123",
            "admin_test": "Admin@123",
            "hod_test": "HOD@123",
            "dean_test": "Dean@123",
            "director_test": "Director@123",
            "verify_test": "Verify@123",
            "external_test": "External@123"
        }
        print(f"{user['role']:20s} | {user['userId']:15s} | {original_password[user['userId']]}")
    print("-" * 50)

if __name__ == "__main__":
    try:
        create_test_users()
    except Exception as e:
        print(f"❌ Error creating test users: {e}")
        import traceback
        traceback.print_exc()
