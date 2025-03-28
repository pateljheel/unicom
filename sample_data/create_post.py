import base64
import json
import requests

# Replace with your actual token and endpoint
API_URL = "http://localhost:5000/posts"
JWT_TOKEN = "eyJraWQiOiJkUklaZElRanFnaVk2SkJBaGRvMG05S1RHOVJjTjNQR3ZBc2cxRWxRR0tJPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiSmZkZm0wRl9naU1Id1pWTkxyakUxdyIsInN1YiI6ImExY2IwNWMwLWEwODEtNzBhMy1kNTZjLTk2ZjA5MjdiN2MxYSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl9vYjl2NFpGZngiLCJjb2duaXRvOnVzZXJuYW1lIjoiYTFjYjA1YzAtYTA4MS03MGEzLWQ1NmMtOTZmMDkyN2I3YzFhIiwiYXVkIjoiNW9nc3BhOTEyNmE1cWJiYWhzOWcxOHJ2NG0iLCJldmVudF9pZCI6ImRkMTA1YTdkLTJlN2QtNDU0Yy1hYjVjLTMxNWY4ZDEzZjg4NSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzQzMTc0MjE4LCJleHAiOjE3NDMyNjA2MTgsImlhdCI6MTc0MzE3NDIxOCwianRpIjoiN2QzNDg1ODUtNDgzNy00YmY1LWE4NmYtOGJiZWZhNTI2Y2IzIiwiZW1haWwiOiJqaGVlbHBhdGVsMTVAZ21haWwuY29tIn0.sw4St6JoMVmFwEoTKSRHzOeOOErHNvoGpJTRqRASKonBdwH_ZaTD-Ve5PQS9BeLXDozbUOxoNIj1HOs9EitvTy0vxl6irZgA2kwLlRvzIOQPwQsaNlKoOc9_NR0J3joXQyZAjRgYKXxW4_V8n6i-CPaMuAYbi-hR5ngzxk2gPvVVP0PjHsaal4R5rOjwEk8zEwY6Q8lmAJXtJcKZ_S_MiFr5SvfL-mB4P7s2ISjiWUq--46HGKIr4HICcqu7QiYlKs4Qn3C5_QRGfk9cGNN_oEovOMoqGZcm898truzaXBqfnU_uaxYpZ5m1j28O65OPkcmmGTonLdXtDVq2gm-wgw"

# Encode images to base64
def encode_image(path):
    with open(path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

# Prepare the payload
payload = {
    "category": "SELL",
    "title": "Gently used bookshelf",
    "description": "Selling a new bookshelf.",
    "price": 45.99,
    "item": "Bookshelf",
    "images": [
        encode_image("MCP_RCA_1.png"),
        encode_image("MCP_RCA_1.png"),
    ],
    "sub_category": "FURNITURE"
}

headers = {
    "Authorization": f"Bearer {JWT_TOKEN}",
    "Content-Type": "application/json"
}

response = requests.post(API_URL, data=json.dumps(payload), headers=headers)

print("Status:", response.status_code)
print("Response:", response.json())
