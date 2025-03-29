import requests

# Step 1: Get signed cookies
API_URL = "https://x26jf1myka.execute-api.us-east-2.amazonaws.com/signedcookie"  # Your backend URL
JWT_TOKEN = "eyJraWQiOiJMcE9DZVk5bldtVUwwem1mYkJyd203K3ZsVVwvU2Jjdk41T2RmQzVNY2tGUT0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiZWVJMkduaHVJRFZWZnVYdUlMM3QzUSIsInN1YiI6ImQxZmI0NTAwLTMwNzEtNzAwNC05NWFiLTc1ZTAyZTA1N2UxOCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl9DY01mc2l2THQiLCJjb2duaXRvOnVzZXJuYW1lIjoiZDFmYjQ1MDAtMzA3MS03MDA0LTk1YWItNzVlMDJlMDU3ZTE4IiwiYXVkIjoiNXExZm5idHZzOGZjdTluam5kcmxhaG4xaXQiLCJldmVudF9pZCI6IjcwYTVhZDQ2LTM5MWEtNDU3NC05NjI4LTIwNDMyNjczYjM4MCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzQzMjc1Njk2LCJleHAiOjE3NDMzNjIwOTYsImlhdCI6MTc0MzI3NTY5NiwianRpIjoiMGZhMWE5NGItMDc1Mi00MjNkLWFmODUtN2FiMmM3OTBhNWRiIiwiZW1haWwiOiJqcDk5NTlAZy5yaXQuZWR1In0.i9dL13fUlNlaKUnct_itP9T4cvk_LJVVnTH4aBw0GXC81I75QIIcuCoDekidcjHzQYOFANyzUaz96Nc93_rTYODqF3gvyEiFNh2xsiK4W_F844CjGeFybP1v-EAJucThO4POf12QDksPCLXtGcVrb9OHfasP5lLCS39-y_axyXtXz5BcgkfWuVK9pQh5NNjin26gasNZW6debEXQL_Q6lZFVW17FBZEkrTvcjdHxqzIslK8b4kTsNo490UTySCNIRBEWtzs8-1rigAA_4mrB0JTzjvlw5-xQ9vhxcQa8t9DNK1skjx_-CFvvaz2tedcMPNkxBR0o507eN1gZTn2ZUQ"               # Replace with your actual token
CLOUDFRONT_IMAGE_URL = "https://d3vjtt3wcts9ym.cloudfront.net/published/post_67e8585c6317c06a2aa6e4b5/image_1.jpg"

response = requests.get(API_URL, headers={
    "Authorization": f"Bearer {JWT_TOKEN}"
})

if response.status_code != 200:
    print("Failed to get signed cookies:", response.text)
    exit()

cookies = response.json()
print("Signed cookies received.")

# Prepare the cookie jar
cookie_jar = {
    "CloudFront-Policy": cookies["CloudFront-Policy"],
    "CloudFront-Signature": cookies["CloudFront-Signature"],
    "CloudFront-Key-Pair-Id": cookies["CloudFront-Key-Pair-Id"]
}

for k, v in cookie_jar.items():
    print(f"{k} = {v[:30]}... ({len(v)} chars)")

image_response = requests.get(CLOUDFRONT_IMAGE_URL, cookies=cookie_jar)

if image_response.status_code == 200:
    with open("downloaded_image.jpg", "wb") as f:
        f.write(image_response.content)
    print("Image downloaded successfully.")
else:
    print("Failed to download image:", image_response.status_code, image_response.text)
