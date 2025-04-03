import base64
import json
import requests

# Replace with your actual token and endpoint
API_URL = "https://t30jj44p5m.execute-api.us-east-1.amazonaws.com/api/posts"
JWT_TOKEN = "eyJraWQiOiJSamV0XC94UVoxeCtwY3Y3TERQeWM3T3pJSWpDMmNkaDh2dWVcLzdSUmc5dkk9IiwiYWxnIjoiUlMyNTYifQ.eyJhdF9oYXNoIjoiSzlzd2laT2lRTGVIcEtZYW4ySDhQZyIsInN1YiI6IjU0NDg1NGI4LTYwZjEtNzA1My05MzAzLTU3NjU3MDRlYTNiZSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9CM3BCMTdvNzEiLCJjb2duaXRvOnVzZXJuYW1lIjoiNTQ0ODU0YjgtNjBmMS03MDUzLTkzMDMtNTc2NTcwNGVhM2JlIiwiYXVkIjoiMTB0cG5ra2VjNWVkYmRtdmgxYzlvcnU4bjgiLCJldmVudF9pZCI6ImY2NGQ2NTQ1LTE1N2MtNDE0MS04ZWIzLTEwZjg1M2JlZGFkOCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzQzNzAyNDkzLCJleHAiOjE3NDM3ODg4OTMsImlhdCI6MTc0MzcwMjQ5MywianRpIjoiZTJlMzQzM2EtNWFhYi00ZmUyLTllOTQtNzkyN2MwZmZmMDU2IiwiZW1haWwiOiJiYTIxMTZAZy5yaXQuZWR1In0.UfnMKWYi2gntp0JQb6c1QoAbWm_IYT2dCR98RuVpuakmbhPuJDI2cZCXicQSh_mlkF9U8UyRmSStawOHzE5uRHYQo9_3-xVQLcCj7fym9XPABET0zV-JBojKMmbrPSQDWdNmMCp-QDzQhdw1kvLYLyL8fr71DnkPI-BLRimKaqBEIe8-6NSfRAfQcW0jhrw5REVncN_o9kw7w5ucFWhitmk-jVgpKlXvEiQGj9qdsksu2yWClZitNnn3e09Ug3b7pegJtkBH1VLeRNAcvR0v_frAlthe-704N1u_WUb1eJZBReQ0GnUwQ_xeUe4kpBooSF8MGR0p-6zSyenqFM62Ag"

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
