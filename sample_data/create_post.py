import base64
import json
import requests

# Replace with your actual token and endpoint
# API_URL = "https://8p4eqklq5b.execute-api.us-east-1.amazonaws.com/api/posts"
API_URL = "https://nbdki69xm0.execute-api.us-east-1.amazonaws.com/api/posts"
JWT_TOKEN = "eyJraWQiOiJFYWdodmtHXC83SzRpdmdxeGxNM1M0endyXC9aM2VHaGh0VlwvaG54R291NWVjPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiVHU1emlFNVZxS3ZqMEdHUy10ZzdhdyIsInN1YiI6IjI0MTgwNDU4LTgwMDEtNzBmMC02MTVkLTI4YzQ4NmMyOTNkNiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9sUHBWYWlrWTkiLCJjb2duaXRvOnVzZXJuYW1lIjoiMjQxODA0NTgtODAwMS03MGYwLTYxNWQtMjhjNDg2YzI5M2Q2IiwiYXVkIjoiMTh2YjJjYmxtYTJiNnB1dTNycnRwM3ZmZXMiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTc0NDEyOTc1NiwiZXhwIjoxNzQ0MjE2MTU2LCJpYXQiOjE3NDQxMjk3NTYsImp0aSI6Ijc5MWNkNzk3LTZiNTYtNGM5NS05NDk5LTY4Yjg3M2U4YzgyYiIsImVtYWlsIjoiYmEyMTE2QHJpdC5lZHUifQ.TJfShGYYPscad-tJNqc4YXPLgPeEoUht8ig3PC9y1D2h-UuT4PUZ6b0wru2pETngJQ6NxoLbgdh0FU_ztSnOWlVoufGOY2dx5H9fW_wP67aWJ170jmc1EOvs_qXOvlq4Yg1tn_tHqv7rpqlvV8MYZZhJn2pxBDrHSZfyinwkzmWKso1g35szkMsM-QWi5QoD0B4HymSueNLsk1Ol_qgwC6NjAyXvDkY-au9WsbPHxpnLajR22yMvTMAEugzzthvMwsCbkQlM9rE8DDfdtXHiqAd4iz_BjBuqtg41I0oUsaF0Lz6i7mQ2qokjTeb0yGE4x_JiLOezP-CKhpfU7veAJw"

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

