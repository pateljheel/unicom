import requests

# Step 1: Get signed cookies
API_URL = "http://localhost:5000/signedcookie"  # Your backend URL
JWT_TOKEN = "eyJraWQiOiJkUklaZElRanFnaVk2SkJBaGRvMG05S1RHOVJjTjNQR3ZBc2cxRWxRR0tJPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiSmZkZm0wRl9naU1Id1pWTkxyakUxdyIsInN1YiI6ImExY2IwNWMwLWEwODEtNzBhMy1kNTZjLTk2ZjA5MjdiN2MxYSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl9vYjl2NFpGZngiLCJjb2duaXRvOnVzZXJuYW1lIjoiYTFjYjA1YzAtYTA4MS03MGEzLWQ1NmMtOTZmMDkyN2I3YzFhIiwiYXVkIjoiNW9nc3BhOTEyNmE1cWJiYWhzOWcxOHJ2NG0iLCJldmVudF9pZCI6ImRkMTA1YTdkLTJlN2QtNDU0Yy1hYjVjLTMxNWY4ZDEzZjg4NSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzQzMTc0MjE4LCJleHAiOjE3NDMyNjA2MTgsImlhdCI6MTc0MzE3NDIxOCwianRpIjoiN2QzNDg1ODUtNDgzNy00YmY1LWE4NmYtOGJiZWZhNTI2Y2IzIiwiZW1haWwiOiJqaGVlbHBhdGVsMTVAZ21haWwuY29tIn0.sw4St6JoMVmFwEoTKSRHzOeOOErHNvoGpJTRqRASKonBdwH_ZaTD-Ve5PQS9BeLXDozbUOxoNIj1HOs9EitvTy0vxl6irZgA2kwLlRvzIOQPwQsaNlKoOc9_NR0J3joXQyZAjRgYKXxW4_V8n6i-CPaMuAYbi-hR5ngzxk2gPvVVP0PjHsaal4R5rOjwEk8zEwY6Q8lmAJXtJcKZ_S_MiFr5SvfL-mB4P7s2ISjiWUq--46HGKIr4HICcqu7QiYlKs4Qn3C5_QRGfk9cGNN_oEovOMoqGZcm898truzaXBqfnU_uaxYpZ5m1j28O65OPkcmmGTonLdXtDVq2gm-wgw"               # Replace with your actual token

response = requests.get(API_URL, headers={
    "Authorization": f"Bearer {JWT_TOKEN}"
})

if response.status_code != 200:
    print("Failed to get signed cookies:", response.text)
    exit()

cookies = response.json()
print("Signed cookies received.")

# Step 2: Use cookies to fetch the image from CloudFront
CLOUDFRONT_IMAGE_URL = "https://d21bgklwrbshis.cloudfront.net/post_67e71db74b5997ac5fd07aba/image_1.jpg"

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
