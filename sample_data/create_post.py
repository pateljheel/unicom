import base64
import json
import requests

# Replace with your actual token and endpoint
API_URL = "https://x26jf1myka.execute-api.us-east-2.amazonaws.com/posts"
JWT_TOKEN = "eyJraWQiOiJMcE9DZVk5bldtVUwwem1mYkJyd203K3ZsVVwvU2Jjdk41T2RmQzVNY2tGUT0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiZWVJMkduaHVJRFZWZnVYdUlMM3QzUSIsInN1YiI6ImQxZmI0NTAwLTMwNzEtNzAwNC05NWFiLTc1ZTAyZTA1N2UxOCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl9DY01mc2l2THQiLCJjb2duaXRvOnVzZXJuYW1lIjoiZDFmYjQ1MDAtMzA3MS03MDA0LTk1YWItNzVlMDJlMDU3ZTE4IiwiYXVkIjoiNXExZm5idHZzOGZjdTluam5kcmxhaG4xaXQiLCJldmVudF9pZCI6IjcwYTVhZDQ2LTM5MWEtNDU3NC05NjI4LTIwNDMyNjczYjM4MCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzQzMjc1Njk2LCJleHAiOjE3NDMzNjIwOTYsImlhdCI6MTc0MzI3NTY5NiwianRpIjoiMGZhMWE5NGItMDc1Mi00MjNkLWFmODUtN2FiMmM3OTBhNWRiIiwiZW1haWwiOiJqcDk5NTlAZy5yaXQuZWR1In0.i9dL13fUlNlaKUnct_itP9T4cvk_LJVVnTH4aBw0GXC81I75QIIcuCoDekidcjHzQYOFANyzUaz96Nc93_rTYODqF3gvyEiFNh2xsiK4W_F844CjGeFybP1v-EAJucThO4POf12QDksPCLXtGcVrb9OHfasP5lLCS39-y_axyXtXz5BcgkfWuVK9pQh5NNjin26gasNZW6debEXQL_Q6lZFVW17FBZEkrTvcjdHxqzIslK8b4kTsNo490UTySCNIRBEWtzs8-1rigAA_4mrB0JTzjvlw5-xQ9vhxcQa8t9DNK1skjx_-CFvvaz2tedcMPNkxBR0o507eN1gZTn2ZUQ"

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
