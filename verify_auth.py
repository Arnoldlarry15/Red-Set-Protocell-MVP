import requests
import sys

BASE_URL = "http://localhost:5000"
ADMIN_PASSWORD = "admin" # Default

def test_auth_flow():
    session = requests.Session()
    
    print("1. Testing Unauthenticated Access...")
    try:
        res = session.get(f"{BASE_URL}/api/config")
        if res.status_code == 401:
            print("   [PASS] Access denied as expected.")
        else:
            print(f"   [FAIL] Expected 401, got {res.status_code}")
            return False
    except Exception as e:
        print(f"   [ERROR] Connection failed: {e}")
        return False

    print("\n2. Testing Login (Invalid Password)...")
    res = session.post(f"{BASE_URL}/api/login", json={"password": "wrong_password"})
    if res.status_code == 401:
        print("   [PASS] Login rejected as expected.")
    else:
        print(f"   [FAIL] Expected 401, got {res.status_code}")
        return False

    print("\n3. Testing Login (Correct Password)...")
    res = session.post(f"{BASE_URL}/api/login", json={"password": ADMIN_PASSWORD})
    if res.status_code == 200:
        print("   [PASS] Login successful.")
    else:
        print(f"   [FAIL] Expected 200, got {res.status_code}")
        print(res.text)
        return False

    print("\n4. Testing Authenticated Access...")
    res = session.get(f"{BASE_URL}/api/config")
    if res.status_code == 200:
        print("   [PASS] Access granted.")
    else:
        print(f"   [FAIL] Expected 200, got {res.status_code}")
        return False

    print("\n5. Testing Logout...")
    res = session.post(f"{BASE_URL}/api/logout")
    if res.status_code == 200:
        print("   [PASS] Logout successful.")
    else:
        print(f"   [FAIL] Expected 200, got {res.status_code}")
        return False

    print("\n6. Testing Access After Logout...")
    res = session.get(f"{BASE_URL}/api/config")
    if res.status_code == 401:
        print("   [PASS] Access denied as expected.")
    else:
        print(f"   [FAIL] Expected 401, got {res.status_code}")
        return False

    return True

if __name__ == "__main__":
    if test_auth_flow():
        print("\n[SUCCESS] Authentication Verification Passed!")
        sys.exit(0)
    else:
        print("\n[FAILURE] Authentication Verification Failed!")
        sys.exit(1)
