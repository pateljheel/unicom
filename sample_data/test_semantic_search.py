import requests

API_URL = "http://localhost:8080/api/posts/semanticsearch"  # Update if deployed elsewhere
JWT_TOKEN = "eyJraWQiOiJZSDZJaEl3WkNVWW1iRzBOU0docmV0eThNcW5HWHNxM3ZGNnQrckRZOEE0PSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoibkxnU3FSSEF0d28wdHZIOEFwWkp0ZyIsInN1YiI6ImE0YjgwNGU4LTgwNzEtNzAyZS03Mzg1LWE0ZTZiOWZiNzA5MCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9pZWJRWDZMbUoiLCJjb2duaXRvOnVzZXJuYW1lIjoiYTRiODA0ZTgtODA3MS03MDJlLTczODUtYTRlNmI5ZmI3MDkwIiwiYXVkIjoidnMzNHBhM3M3YTdyN2RqaDluZTltZzR2ciIsImV2ZW50X2lkIjoiOTgxN2NhYzYtM2NkZC00YzllLWJjNzMtNWM2ODIzNTA0OGEyIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3NDQ4MzQ1OTMsImV4cCI6MTc0NDkyMDk5MywiaWF0IjoxNzQ0ODM0NTkzLCJqdGkiOiI4NjlkYzgyNy1jOTMyLTQ0MTQtOTc5My1kZGY0ODg0MWM5YjMiLCJlbWFpbCI6ImpwOTk1OUBnLnJpdC5lZHUifQ.GlYd023cRupVRGKzjfMjJx8jN5QamGjzoHBspxjZrlRxGzX3z8ImuH5wjW2RCcI24D0rByiKerfS6s5pb9YuqBScRV7BNa7kFtQv6WAO4J3CbeVMaPClIpkpBtJ8gKjOilcL_liI3QvPn9XlERZeeq9zvV6Lj2zH_AKRfGKFpOypxVJu_2k8t6sgKIpCTdJRRznfgeHSlfhjfgn-Z9NkQXi0as7XgBB7umyTDNCDgihJpc8gNdMpIiaXt712YpTbn9AQsGLhUSnqfvXiPHOo9-z31NcWtg4ci6msKxS9V8PYI42WhjPghRTyoIwXOJEnGsizLXBJ5Vu5WXy5HhonqQ"  # Replace with a valid token

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
    test_semantic_search("new bookshelf")
