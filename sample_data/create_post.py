import base64
import json
import requests

# Replace with your actual token and endpoint
API_URL = "https://hnaztd852f.execute-api.us-east-1.amazonaws.com/api/posts"
JWT_TOKEN = "eyJraWQiOiJXQVlBNFVPajFpT2tUcHpPRzg2cERlVzBUZzVkZlwvcDVJMnkyWVJlM2dWMD0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiZ1F6d0NaOUk5bDA0bVQ1SXhfVW83USIsInN1YiI6IjA0MTgxNGQ4LTAwMTEtNzBhYS0wNmNmLTBmMGI0OWNiZGU4OSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9oclFWNnhaR3IiLCJjb2duaXRvOnVzZXJuYW1lIjoiMDQxODE0ZDgtMDAxMS03MGFhLTA2Y2YtMGYwYjQ5Y2JkZTg5IiwiYXVkIjoiNjFtbXQ1cWFrZzE3Z3I3cm91bzd1dXNyYWYiLCJldmVudF9pZCI6ImY0MGQwNGUzLTI3NzMtNDlhNC1iZmNmLTcxYmJlOGJiYTc1OSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzQzNjk4MTc5LCJleHAiOjE3NDM3ODQ1NzksImlhdCI6MTc0MzY5ODE3OSwianRpIjoiMGNjOGQ1MjctNzNkOC00Mjg1LWJmY2QtNzY0NTZkNDI4NWYwIiwiZW1haWwiOiJqcDk5NTlAZy5yaXQuZWR1In0.W2EJBvFK5occNudJyzwQe-Qxc-V1nmkzrjazGIiCYjDf0VYoReWft82UgxKG2CCcifx-jWeNqArXG6_NKGupqYYET2bzGPZjD1BlLuPi077DA4G1tQhMP_W9NIL_z8IQJ-boFodgVfUmZ5C4HXqLJ8eaasSIlAO9x_YzLbTaZl2SdUjXqY3SXj1Op1_MKS7RLHBjTjz-RBvRgtFVIupa89RFVsxaN0syKROjcypeA6i_Ap5b7mhjm007KuppAqXJgsH7QQv4yAJf-TpDLLTWss611mH8ZSbW4aZqKpJlG7C0cDLP4OiGff0fK3NBakBB7A7pdZduuIRKGiQ5o81XMg"

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

