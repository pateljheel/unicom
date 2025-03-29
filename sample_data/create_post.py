import base64
import json
import requests

# Replace with your actual token and endpoint
API_URL = "https://k6c9agfv9b.execute-api.us-east-1.amazonaws.com/api/posts"
JWT_TOKEN = "eyJraWQiOiI1Z2VZaU53VlI5MGxmcFNMeWxUVVwvVVhycDZxRFZpU1FmN1UwS3VBQXNmQT0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoibUJSOXJPbEctUDlZOVJGUzBMaU1HdyIsInN1YiI6ImY0NTg5NDc4LWYwMzEtNzBhYy04ODYyLWNhYzFhNGQ1OWIxMSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV8ySDBtSm5pNEEiLCJjb2duaXRvOnVzZXJuYW1lIjoiZjQ1ODk0NzgtZjAzMS03MGFjLTg4NjItY2FjMWE0ZDU5YjExIiwiYXVkIjoiNThhdTBwa2tkaTYxNGxtcjcxa3NmcHZyZmwiLCJldmVudF9pZCI6Ijc3NzliMjVhLTdlOTgtNDY0My05ZGIwLTY5OGM3ZGFjNjg1MyIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzQzMjg1ODc5LCJleHAiOjE3NDMzNzIyNzksImlhdCI6MTc0MzI4NTg3OSwianRpIjoiMzllNDEzOTAtMzI3OS00OWI3LThlMDAtNGQ5NTUyNzczOGY5IiwiZW1haWwiOiJqcDk5NTlAZy5yaXQuZWR1In0.y7o65ptNFvGIfhvf09MltFhvNucV2QIGMprAJzqOhnjWq_mhLhIcIqY907RsuHZgE4f0D3AJFddqhyLk_6KhSxAYGwXCFnkrAbh3j7CTD3K7lzo_Is98Jw5Ct_QGag8Rf-0RltsHBilzlrRTUxSg5MDMPd1HeN-JTMkNwIZ4ZXIBfIQyW2ZXbUuIb2kyCX3_XIzDAiTaIRFMnCXVFBf_NzlQ6dXdc4Ae_J4qb-E_uELe5qDVDKQRPaJ42BYKzwqjQwKnyNc9ujp53iOWD7hXQtGK0DiW-2sEVGWaXk0VCanUB9dtjYyzC1p7Rma-nFAjcW97hBo5EcY3fi4GMWIUBA"

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
        encode_image("GUN.jpg"),
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
