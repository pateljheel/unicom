import requests

API_URL = "http://localhost:8080/api/posts/semanticsearch"  # Update if deployed elsewhere
JWT_TOKEN = "eyJraWQiOiJ1QzI4SlJCSHhrRmFhUWhGYUREOVNmNHZ1NVpMQVRYTDZxOUZcL2IxNGJvVT0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiQXFDS2xaRHAzcXJEQ2dOeFk4cjA4dyIsInN1YiI6ImY0NThmNDk4LWEwYTEtNzBkOC1kY2ZiLTVlYmFjNmM3ZjIyMiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV96OWYxT2kyZUYiLCJjb2duaXRvOnVzZXJuYW1lIjoiZjQ1OGY0OTgtYTBhMS03MGQ4LWRjZmItNWViYWM2YzdmMjIyIiwiYXVkIjoiNjM5ZDh2cnNlZDdicjd0NzhvdHIxNjkxcm8iLCJldmVudF9pZCI6IjQ5ZDdhMTE5LTQ2ZjgtNGY1Ny05OGI3LTljNTI0MjI1MjMyNiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzQ0OTM5NTAyLCJleHAiOjE3NDUwMjU5MDIsImlhdCI6MTc0NDkzOTUwMiwianRpIjoiZmIyOTk0ZTItMmZkZC00OGQ5LTgxMWItNDljODkwNmQ4NTFiIiwiZW1haWwiOiJqcDk5NTlAZy5yaXQuZWR1In0.TycDhQqYpOZmbNiJVTndI5Iijw43ir4nxw4_rU715wuwm7vWkDQKQVC8byee8dyiPdBnBIcjU5Zts-1tHwOJ72cZ9NLS-ueeX3sal4GZ4kcG7sVowiHzDg2-2wpZI-IKBIXVphSmnPAZojMOhK3H7lzVuNPcwuCbBnCjiLej4GjyX0r8X08cdh-0KTvw54OoIWCN2iFQMpyeGisIKQyrZ2pEnydh-2z129PZZL1D-VRTSzCl8luqX2S8huqxCQaKaIycF4XLoaPAN02PVPQuZv7E8eqqYM8WOLp1AhPaVnyb8zyoTTYjHeBeiGKLwZyP4BJMLArEIZUfoxHMti7_aA"  # Replace with a valid token

def test_semantic_search(query: str):
    headers = {
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }

    payload = {
        "query": query
    }

    response = requests.post(API_URL, json=payload, headers=headers)

    print(f"Status Code: {response.status_code}")
    try:
        data = response.json()
        if response.status_code == 200:
            print("\nTop Posts (by semantic similarity):")
            for i, post in enumerate(data, start=1):
                print(f"{i}. Title: {post.get('title')}, Description: {post.get('description')}")
        else:
            print("Error:", data)
    except Exception as e:
        print("Failed to parse JSON response:", e)
        print("Raw response:", response.text)

if __name__ == "__main__":
    test_semantic_search("Green lamp, new condition.")
