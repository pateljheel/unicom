# import base64
# import json
# import requests

# # Replace with your actual token and endpoint
# API_URL = "https://sdip576qrl.execute-api.us-east-1.amazonaws.com/api/posts"
# JWT_TOKEN = "eyJraWQiOiJcL0xOeFwvSlF6YmNSdVwvcEJ0c0pLV1FHUkUxVmQzQnhaUFZuSlBlQmhKTXlJPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiLXR5dkNQSU9HODZOVnVtdXlKdkU3QSIsInN1YiI6ImU0MDhkNGI4LTYwYTEtNzBmNS04ZmQ1LTI1MzYzZDc3MzViZSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV83QjVaZnhNMkYiLCJjb2duaXRvOnVzZXJuYW1lIjoiZTQwOGQ0YjgtNjBhMS03MGY1LThmZDUtMjUzNjNkNzczNWJlIiwiYXVkIjoiNXR1MG50NTU4NWdpdmo1YXRjZHNtbWRwc3YiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTc0Mzg2MTcwNCwiZXhwIjoxNzQzOTQ4MTA0LCJpYXQiOjE3NDM4NjE3MDQsImp0aSI6IjBhNTUyMzM4LTFlZmMtNGJjYi04Y2E2LTUzNjcwNWU1ZmFlMSIsImVtYWlsIjoiYmEyMTE2QGcucml0LmVkdSJ9.IfwEHpxu2taw7lyJP0ougEHbCAtQvMLqJl3Yvf-9TWvg846hvEbgZW6UJu-ITCeGkvwjIcHf-tzro8gxLQHVmTk4rfgkurEfr_ycoIE6bdNaS5TCkLD95GtQ4hVXzqAnBKGtRemrCZPDVUYPrdb_Oy1z62ER_WShahekuZUKbiind6kcBLybmvDOeqfP76BUVMDT4X9kzb0LvpsPGQsTZzYzWdoJF1DRMUZvIxfcxaEAbEkjSmfQ1yvPogbPcug10uSjtDO6KfXG5ZEwQy6p56kY2TG6UZiZSogUw0cmdvG5VVTgjm_DyNttRzTmlO39ZWp8I042dfU4cLyhlIVsTw"

# # Encode images to base64
# def encode_image(path):
#     with open(path, "rb") as image_file:
#         return base64.b64encode(image_file.read()).decode("utf-8")

# # Prepare the payload
# payload = {
#     "category": "SELL",
#     "title": "Gently used bookshelf",
#     "description": "Selling a new bookshelf.",
#     "price": 45.99,
#     "item": "Bookshelf",
#     "images": [
#         encode_image("GUN.jpg"),
#         encode_image("MCP_RCA.png"),
#     ],
#     "sub_category": "FURNITURE"
# }

# headers = {
#     "Authorization": f"Bearer {JWT_TOKEN}",
#     "Content-Type": "application/json"
# }

# response = requests.post(API_URL, data=json.dumps(payload), headers=headers)

# print("Status:", response.status_code)
# print("Response:", response.text)



import requests

API_URL = "https://sdip576qrl.execute-api.us-east-1.amazonaws.com/api"

try:
    response = requests.get(API_URL)
    print("Status Code:", response.status_code)
except requests.exceptions.RequestException as e:
    print("Error:", e)