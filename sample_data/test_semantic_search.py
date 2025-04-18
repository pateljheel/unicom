import requests

API_URL = "http://localhost:8080/api/posts/semanticsearch"  # Update if deployed elsewhere
JWT_TOKEN = "eyJraWQiOiJWYk9zU1Z4TjRLend5WVdkMEMyQXVXWExybHBteThjc3VEUFc1blpNNEgwPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiR0N3Qmg2bHl2eVhRdGN6RHZWdDM2USIsInN1YiI6Ijg0NjgyNDg4LWEwNDEtNzBjMi1jNWIxLThlOTAxMWE2NzkwMiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9LdnVsdWM5WmYiLCJjb2duaXRvOnVzZXJuYW1lIjoiODQ2ODI0ODgtYTA0MS03MGMyLWM1YjEtOGU5MDExYTY3OTAyIiwiYXVkIjoiNTJwNGk3dHJnZW81OWNlbzdiYXM1a2huNHAiLCJldmVudF9pZCI6IjM2ZWY3YTA0LTkzZmYtNGZjZi05YTc1LTRkMGM1YmQ4MjY4MSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzQ0OTExMjE1LCJleHAiOjE3NDQ5OTc2MTUsImlhdCI6MTc0NDkxMTIxNSwianRpIjoiNTRiMDAxNjUtYmFhZi00Nzk2LTkxY2YtZmUyNzljMzBhMjVkIiwiZW1haWwiOiJqcDk5NTlAZy5yaXQuZWR1In0.aRdcM0OjscZ688iS5uRR5jbR6-tklvtJULpUjFlixz_LNE_2e8S_uar7LJz-Ntx6SbSiQLHS-JgSvTD6GIuC0lZ0CvbQ2ycgCPgl7FU6hBYaPBcqBJbkXvXK-lC3UzeIIX4IxV77zP5-W78p5PLCMJ40IaChIyVb6EgC7RQ2B0XCWWLhFJV7KeOgwec-6Iqmkt0Wk2Q8hgfCzhE-8Y6XPmvfDiEy-O43uub2lhn4P3-W01A6wZCveJSjoIRRpfUp_gaWIrXx3dQub4cSKGMq56_apx_yhgl-lwLCJt-NSDArjFflbA2rBIcQ1Q7QQfDUit1XNCg-l2WidMM7WYL7IA"  # Replace with a valid token

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
