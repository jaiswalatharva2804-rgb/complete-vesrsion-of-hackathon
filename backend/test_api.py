"""
Test script to verify backend API is working correctly.
Run this after starting the backend server.
"""

import requests
import sys

API_BASE = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    try:
        response = requests.get(f"{API_BASE}/health")
        if response.status_code == 200:
            print("✓ Health check passed")
            return True
        else:
            print(f"✗ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"✗ Health check error: {e}")
        return False

def test_cors():
    """Test CORS headers"""
    try:
        response = requests.options(f"{API_BASE}/health", headers={
            "Origin": "http://localhost:8080",
            "Access-Control-Request-Method": "POST"
        })
        if "access-control-allow-origin" in response.headers:
            print("✓ CORS headers present")
            return True
        else:
            print("✗ CORS headers missing")
            return False
    except Exception as e:
        print(f"✗ CORS test error: {e}")
        return False

def main():
    print("=" * 50)
    print("Backend API Integration Test")
    print("=" * 50)
    print()
    
    print(f"Testing API at: {API_BASE}")
    print()
    
    results = []
    results.append(test_health())
    results.append(test_cors())
    
    print()
    print("=" * 50)
    if all(results):
        print("✓ All tests passed! Backend is ready.")
        print()
        print("Next steps:")
        print("1. Start frontend: cd frontend && npm run dev")
        print("2. Open browser: http://localhost:8080")
        sys.exit(0)
    else:
        print("✗ Some tests failed. Check backend server.")
        print()
        print("Make sure backend is running:")
        print("  cd backend")
        print("  uvicorn api_ml:app --host 0.0.0.0 --port 8000 --reload")
        sys.exit(1)

if __name__ == "__main__":
    main()
