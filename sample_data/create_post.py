import base64
import json
import requests

# Replace with your actual token and endpoint
API_URL = "https://8p4eqklq5b.execute-api.us-east-1.amazonaws.com/api/posts"
JWT_TOKEN = "eyJraWQiOiJVejR2T3dXVnN6M2RTUWMxVDFTKzFlb0JCUHVZZGJ5K3owUDlheThzbFp3PSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiQVdSWGdaRkx1b3FPZXQwX1ZFRFp5USIsInN1YiI6ImY0MjhiNDU4LWUwZTEtNzA2YS0yMGE3LTkzOTAzZDQzYzFhMCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV80OHpFQ1h3YlkiLCJjb2duaXRvOnVzZXJuYW1lIjoiZjQyOGI0NTgtZTBlMS03MDZhLTIwYTctOTM5MDNkNDNjMWEwIiwiYXVkIjoiNjc5YnFqNnNlYjdxN3JnNmhldG1uY2cwaTAiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTc0MzkxNDE3MSwiZXhwIjoxNzQ0MDAwNTcxLCJpYXQiOjE3NDM5MTQxNzEsImp0aSI6ImU4NTFmYmE0LTRmZGYtNGY4ZC05ZGJmLTQzZTg4ZjdiM2VlMiIsImVtYWlsIjoiYmEyMTE2QHJpdC5lZHUifQ.He5dRgQ4wbg6RmCBU5ueBkq_vDJbkuQgwAclt6l4CcZS9ncVspH8ldat3FpZYqMtsqNHFOXq0RYwR5Sh5CqPxF_DfT9Q2lxpqID5AHzmLlNJcvUZPE1uLJB24WXgNRBmQ3RN58EHrpe8JWITovOA0h8wzJgmS7TiTCziwTsALoxdSFXfw8vRxLbIGFMRzIwZKaOEXHgtXfj6xiXzntv44XWqP7s2heDHa8EXRDXOxLa7tii9EjW74iyH23oTgJBoyMD8soGhMrC7P0ep_YAE6KZabH_7FhW57RXS5TpzETsrOH0TWGEv1Etfd_YzGaSgL9Qh3TSdRIxTMGjc1n5BOw"

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

