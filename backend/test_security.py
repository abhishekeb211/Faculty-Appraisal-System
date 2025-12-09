"""
Quick test script to verify JWT authentication and API endpoints
"""
import requests
import json

BASE_URL = "http://127.0.0.1:5000"

def test_health():
    """Test health check endpoint"""
    print("\n===== Testing Health Check =====")
    response = requests.get(f"{BASE_URL}/")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200

def test_login():
    """Test login with JWT"""
    print("\n===== Testing Login (JWT) =====")
    data = {
        "userId": "FAC001",
        "password": "FAC001"
    }
    response = requests.post(f"{BASE_URL}/login", json=data)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"Login successful!")
        print(f"Token: {result.get('token', 'N/A')[:50]}...")
        print(f"User: {result.get('user', {}).get('name')}")
        return result.get('token')
    else:
        print(f"Login failed: {response.json()}")
        return None

def test_protected_route(token):
    """Test accessing protected route"""
    print("\n===== Testing Protected Route (/me) =====")
    
    # Test without token
    print("Without token:")
    response = requests.get(f"{BASE_URL}/me")
    print(f"Status: {response.status_code} (should be 401)")
    print(f"Response: {response.json()}")
    
    # Test with token
    print("\nWith valid token:")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/me", headers=headers)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print(f"User info: {json.dumps(response.json(), indent=2)}")
        return True
    return False

def test_hod_route(token):
    """Test HOD protected route"""
    print("\n===== Testing HOD Protected Route =====")
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test pending appraisals for CSE department
    response = requests.get(
        f"{BASE_URL}/CSE/pending-appraisals",
        headers=headers
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

def test_rate_limiting():
    """Test rate limiting on login"""
    print("\n===== Testing Rate Limiting =====")
    print("Attempting 6 rapid logins (limit is 5 per 15 min)...")
    
    for i in range(6):
        response = requests.post(f"{BASE_URL}/login", json={
            "userId": "test",
            "password": "test"
        })
        print(f"Attempt {i+1}: Status {response.status_code}")
        
        if response.status_code == 429:
            print("✓ Rate limiting working!")
            print(f"Response: {response.json()}")
            break

def test_otp_generation():
    """Test OTP generation"""
    print("\n===== Testing OTP Generation =====")
    data = {"userId": "FAC001"}
    response = requests.post(f"{BASE_URL}/send-otp", json=data)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"OTP sent: {result.get('otp')} (DEV MODE - will be hidden in prod)")
        return result.get('otp')
    else:
        print(f"Failed: {response.json()}")
        return None

def main():
    print("=" * 60)
    print("Faculty Appraisal System - Security Testing")
    print("=" * 60)
    
    try:
        # 1. Health check
        if not test_health():
            print("\n❌ Server not responding!")
            return
        
        # 2. Login and get JWT token
        token = test_login()
        if not token:
            print("\n❌ Login failed - cannot proceed with authenticated tests")
            return
        
        # 3. Test protected route
        if test_protected_route(token):
            print("\n✓ JWT authentication working!")
        
        # 4. Test HOD route
        test_hod_route(token)
        
        # 5. Test rate limiting
        test_rate_limiting()
        
        # 6. Test OTP
        otp = test_otp_generation()
        
        print("\n" + "=" * 60)
        print("Testing Complete!")
        print("=" * 60)
        
    except requests.exceptions.ConnectionError:
        print("\n❌ Cannot connect to backend server!")
        print("Make sure the server is running on port 5000")
    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    main()
