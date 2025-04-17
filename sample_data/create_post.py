import base64
import json
import requests

# Replace with your actual token and endpoint
# API_URL = "https://8p4eqklq5b.execute-api.us-east-1.amazonaws.com/api/posts"
API_URL = "http://localhost:8080/api/posts"
JWT_TOKEN = "eyJraWQiOiJZSDZJaEl3WkNVWW1iRzBOU0docmV0eThNcW5HWHNxM3ZGNnQrckRZOEE0PSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoibkxnU3FSSEF0d28wdHZIOEFwWkp0ZyIsInN1YiI6ImE0YjgwNGU4LTgwNzEtNzAyZS03Mzg1LWE0ZTZiOWZiNzA5MCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9pZWJRWDZMbUoiLCJjb2duaXRvOnVzZXJuYW1lIjoiYTRiODA0ZTgtODA3MS03MDJlLTczODUtYTRlNmI5ZmI3MDkwIiwiYXVkIjoidnMzNHBhM3M3YTdyN2RqaDluZTltZzR2ciIsImV2ZW50X2lkIjoiOTgxN2NhYzYtM2NkZC00YzllLWJjNzMtNWM2ODIzNTA0OGEyIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3NDQ4MzQ1OTMsImV4cCI6MTc0NDkyMDk5MywiaWF0IjoxNzQ0ODM0NTkzLCJqdGkiOiI4NjlkYzgyNy1jOTMyLTQ0MTQtOTc5My1kZGY0ODg0MWM5YjMiLCJlbWFpbCI6ImpwOTk1OUBnLnJpdC5lZHUifQ.GlYd023cRupVRGKzjfMjJx8jN5QamGjzoHBspxjZrlRxGzX3z8ImuH5wjW2RCcI24D0rByiKerfS6s5pb9YuqBScRV7BNa7kFtQv6WAO4J3CbeVMaPClIpkpBtJ8gKjOilcL_liI3QvPn9XlERZeeq9zvV6Lj2zH_AKRfGKFpOypxVJu_2k8t6sgKIpCTdJRRznfgeHSlfhjfgn-Z9NkQXi0as7XgBB7umyTDNCDgihJpc8gNdMpIiaXt712YpTbn9AQsGLhUSnqfvXiPHOo9-z31NcWtg4ci6msKxS9V8PYI42WhjPghRTyoIwXOJEnGsizLXBJ5Vu5WXy5HhonqQ"

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
        encode_image("MCP_RCA.png"),
        encode_image("MCP_RCA.png"),
    ],
    "sub_category": "FURNITURE"
}

headers = {
    "Authorization": f"Bearer {JWT_TOKEN}",
    "Content-Type": "application/json"
}

response = requests.post(API_URL, data=json.dumps(payload), headers=headers)

print("Status:", response.status_code)
print("Response:", response.text)

