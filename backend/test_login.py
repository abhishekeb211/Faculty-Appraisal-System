import requests
import json

# Test login endpoint with faculty user
url = "http://127.0.0.1:5000/login"

test_credentials = [
    {"userId": "faculty_test", "password": "Faculty@123", "role": "Faculty"},
    {"userId": "admin_test", "password": "Admin@123", "role": "Admin"},
    {"userId": "hod_test", "password": "HOD@123", "role": "HOD"},
]

print("Testing Login Endpoint")
print("=" * 70)

for cred in test_credentials:
    print(f"\nTesting {cred['role']} login...")
    response = requests.post(url, json={"userId": cred["userId"], "password": cred["password"]})
    
    if response.status_code == 200:
        data = response.json()
        print(f"  [SUCCESS] Status: {response.status_code}")
        print(f"  Name: {data.get('name')}")
        print(f"  Role: {data.get('role')}")
        print(f"  Dept: {data.get('dept')}")
    else:
        print(f"  [ERROR] Status: {response.status_code}")
        print(f"  Response: {response.text}")
