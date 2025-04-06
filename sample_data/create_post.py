import base64
import json
import requests

# Replace with your actual token and endpoint
API_URL = "https://8p4eqklq5b.execute-api.us-east-1.amazonaws.com/api/posts"
JWT_TOKEN = "eyJraWQiOiJVejR2T3dXVnN6M2RTUWMxVDFTKzFlb0JCUHVZZGJ5K3owUDlheThzbFp3PSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiRjJyVVBNdUtoMEx4OVNjb3JQWS1wQSIsInN1YiI6ImY0MjhiNDU4LWUwZTEtNzA2YS0yMGE3LTkzOTAzZDQzYzFhMCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV80OHpFQ1h3YlkiLCJjb2duaXRvOnVzZXJuYW1lIjoiZjQyOGI0NTgtZTBlMS03MDZhLTIwYTctOTM5MDNkNDNjMWEwIiwiYXVkIjoiNjc5YnFqNnNlYjdxN3JnNmhldG1uY2cwaTAiLCJldmVudF9pZCI6ImQ1Zjg3MzkzLTk4MTktNDk4Ni1iMmZjLWI2MTc4NmY0Zjk4YiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzQzOTY1MjA3LCJleHAiOjE3NDQwNTE2MDcsImlhdCI6MTc0Mzk2NTIwNywianRpIjoiZDNmZDY5M2MtOWU1MC00YjcyLTgyYTAtYmUzNTU0NjhjYWYyIiwiZW1haWwiOiJiYTIxMTZAcml0LmVkdSJ9.O3P-FpLr7o1NJD4Ox0FghCab2REFd04XwlX0es8I9us13infF7LBRpZO1miuOo0FepA4-apHtfqqj-yyZ7hL0haR3ZJIHowlsxXx9fEoGZRiFJ8i11t_EtEfKTZMuoSAxwg1LyAcyQugMOSmWivFuLW0ePE63_P2vzyW3RiGr-oIF66NfPnn6_xSNypYnRLo2iLpoayosOcryvOtaLE9V5sBYFGEm1V8q0H3f45IGLFxPiRjCT8dH6Yy5OecgSNkZM-AdH-JqH5t_EkhYJt8jRbLAmRG5aHw3Kast-L4cR4XrA2t3Bz9baPXKu9mECyFa9gsxpeBNjhYP_9WOPiJNg"

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

