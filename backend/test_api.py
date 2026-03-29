import urllib.request
import json
from urllib.error import HTTPError

url = 'http://localhost:8000/api/auth/register'
data = json.dumps({
    "name": "tester",
    "email": "testaccount_1@example.com",
    "password": "password123"
}).encode('utf-8')

req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'}, method='POST')

try:
    with urllib.request.urlopen(req) as response:
        print("Success!")
        print(response.read().decode('utf-8'))
except HTTPError as e:
    print(f"Failed with status: {e.code}")
    print("Response Body:")
    print(e.read().decode('utf-8'))
except Exception as e:
    print(f"Network error: {e}")
