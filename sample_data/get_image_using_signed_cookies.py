import requests

# Step 1: Get signed cookies
API_URL = "https://sxj4mye19c.execute-api.us-east-2.amazonaws.com/signedcookie"  # Your backend URL
JWT_TOKEN = "eyJraWQiOiJOeUk5OHN0OFwvbFhCZ2FCXC82cklqNWdtazh5eDlWWFdDT0dHNElwTVhDc0E9IiwiYWxnIjoiUlMyNTYifQ.eyJhdF9oYXNoIjoic2p1aDFXalJqakdDYWtyUUplZTFEdyIsInN1YiI6IjQxMGJkNWMwLTgwMTEtNzBhOS02NTYwLWM2MWRiZWQ5MWU3ZCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl9wRFJxQWpBZVkiLCJjb2duaXRvOnVzZXJuYW1lIjoiNDEwYmQ1YzAtODAxMS03MGE5LTY1NjAtYzYxZGJlZDkxZTdkIiwiYXVkIjoiM212ZzBwZGx2NDc1MWRocjUyaXJlZDVvbDIiLCJldmVudF9pZCI6IjE1NTRlODk3LWU5M2YtNGI3YS1iOTMyLWI3N2I3OWZhYjVmYyIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzQzMjYxODQ5LCJleHAiOjE3NDMzNDgyNDksImlhdCI6MTc0MzI2MTg0OSwianRpIjoiMTBhMjBhODMtY2Y0Mi00N2IxLWI3NTAtMDc5YTY2OGExMzQ4IiwiZW1haWwiOiJqcDk5NTlAZy5yaXQuZWR1In0.lHZua5fabCo7vQM__nCAwhq4BusrjtdHB4gQWSF45gdp70xYr2AoHIy2G0QlvuFfIeeoEBXD7TWOTNLujwx480CtmUits-jQj_Vdp2OMycX8W-p9uX1ooJgYWZS6IpyoqBWo8ucv0WEcGiY3IbM3jD_CNKuvBzl49GTy_A8eAA3T437qH4z9kpMbGgsgao4APmHZTKe3vqr6htjCCwPuwqkhL21dWB_E_UTsxqP2FDfUiW989hwNzzoQCWYjNrl-p89n91k93CKsBg6K0pfb7qUmz-498a7HMIrtiGhaZO4VF0yFKy2AV7WHhlLuBgl4Ljlb3F94AHSW2MW4meSpkg"               # Replace with your actual token

response = requests.get(API_URL, headers={
    "Authorization": f"Bearer {JWT_TOKEN}"
})

if response.status_code != 200:
    print("Failed to get signed cookies:", response.text)
    exit()

cookies = response.json()
print("Signed cookies received.")

# Step 2: Use cookies to fetch the image from CloudFront
CLOUDFRONT_IMAGE_URL = "https://d1iuxfzsnwpyrl.cloudfront.net/published/test/downloaded_image.jpg"

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
