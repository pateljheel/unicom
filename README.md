# UniFamily

This is the source repository for application and infrastructure code.

# Branching strategy

- All infrastructure feature branches must follow `tf-feature_name` branch name. When a new feature must be added, create a feature branch from main and once done open a pull request.

- For an application feature use branch name `app-feature_name`.

- As the first iteration is MVP only, we won't have any versioning.

# Terraform practices

- Naming convention for regional resources:
    `{APP_NAME}-{APP_ENV}-{SERVICE_NAME}-{UNIQUE_APP_ID}`

- Naming convention for zonal resources:
    `{APP_NAME}-{APP_ENV}-{SERVICE_NAME}-{AZ}-{UNIQUE_APP_ID}`

- State management for developers:

    ```sh
    # each developer must work in their own terraform workspace
    # name of the workspace can be anything related to their name, all uncased

    # if workspace is not created create it using the following command
    terraform workspace new <WORKSPACE_NAME>
    # or select existing environment on your local clone
    terraform workspace select <WORKSPACE_NAME>
    ```

    The backend key in the bucket will be automatically selected based on the workspace name. Read https://developer.hashicorp.com/terraform/cli/workspaces for more details.

- Single S3 bucket will be used for state management for all the developers. Instead of bucket policy, create new user in the bucket account and configure new profile using the user keys.

    ```sh
    aws configure --profile unifamily
    ```

    In `backend.tf` `unifamily` profile is set for backend bucket.

- In `provider.tf` use `default` profile to launch resources in your own account or use `unifamily` profile to launch resources in the central (bucket) account.

# Local development environment

- Install mongodb locally or use docker container.
```bash
docker pull mongo
docker run -d -p 27017:27017 --name mongodb \
  -e MONGO_INITDB_ROOT_USERNAME=unicom \
  -e MONGO_INITDB_ROOT_PASSWORD=unicom \
  -e MONGO_INITDB_DATABASE=unicom \
  mongo
```

- Now you can use mongodb in the local environment to implement and test the api.

## Sample requests

```bash
# test api with id_token

# create user from the id_token
curl -X POST "http://localhost:5000/users" \
-H "Authorization: Bearer $ID_TOKEN"

# update user department
curl -X PATCH "http://localhost:5000/users" \
-H "Authorization: Bearer $ID_TOKEN" \
-H "Content-Type: application/json" \
-d '{"college": "GCCIS", "department": "Software Engineering"}'

# get user details by email
curl -X GET "http://localhost:5000/users/jheelpatel15@gmail.com" \
-H "Authorization: Bearer $ID_TOKEN" \
-H "Content-Type: application/json"

# get a post by id
curl -X GET "http://localhost:5000/posts/67e6ed74ea44b2b331cf2004" \
-H "Authorization: Bearer $ID_TOKEN" \
-H "Content-Type: application/json"

curl -X DELETE "http://localhost:5000/posts/67e6fa66ec16d63d17fb2b3c" \
-H "Authorization: Bearer $RIT_TOKEN" \
-H "Content-Type: application/json"

curl -X PATCH "http://localhost:5000/posts/67e6ed74ea44b2b331cf2004" \
  -H "Authorization: Bearer $ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "UNPUBLISHED"}'

curl -X GET "http://localhost:5000/myposts?status=PUBLISHED&search=bookshelf&sort=asc&page=1&limit=5" \
  -H "Authorization: Bearer $ID_TOKEN" \
  -H "Content-Type: application/json"

```


https://localhost:3000/#id_token=eyJraWQiOiJkUklaZElRanFnaVk2SkJBaGRvMG05S1RHOVJjTjNQR3ZBc2cxRWxRR0tJPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiSmZkZm0wRl9naU1Id1pWTkxyakUxdyIsInN1YiI6ImExY2IwNWMwLWEwODEtNzBhMy1kNTZjLTk2ZjA5MjdiN2MxYSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl9vYjl2NFpGZngiLCJjb2duaXRvOnVzZXJuYW1lIjoiYTFjYjA1YzAtYTA4MS03MGEzLWQ1NmMtOTZmMDkyN2I3YzFhIiwiYXVkIjoiNW9nc3BhOTEyNmE1cWJiYWhzOWcxOHJ2NG0iLCJldmVudF9pZCI6ImRkMTA1YTdkLTJlN2QtNDU0Yy1hYjVjLTMxNWY4ZDEzZjg4NSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzQzMTc0MjE4LCJleHAiOjE3NDMyNjA2MTgsImlhdCI6MTc0MzE3NDIxOCwianRpIjoiN2QzNDg1ODUtNDgzNy00YmY1LWE4NmYtOGJiZWZhNTI2Y2IzIiwiZW1haWwiOiJqaGVlbHBhdGVsMTVAZ21haWwuY29tIn0.sw4St6JoMVmFwEoTKSRHzOeOOErHNvoGpJTRqRASKonBdwH_ZaTD-Ve5PQS9BeLXDozbUOxoNIj1HOs9EitvTy0vxl6irZgA2kwLlRvzIOQPwQsaNlKoOc9_NR0J3joXQyZAjRgYKXxW4_V8n6i-CPaMuAYbi-hR5ngzxk2gPvVVP0PjHsaal4R5rOjwEk8zEwY6Q8lmAJXtJcKZ_S_MiFr5SvfL-mB4P7s2ISjiWUq--46HGKIr4HICcqu7QiYlKs4Qn3C5_QRGfk9cGNN_oEovOMoqGZcm898truzaXBqfnU_uaxYpZ5m1j28O65OPkcmmGTonLdXtDVq2gm-wgw&access_token=eyJraWQiOiJuS1FVNkhhelJsMXkzalIxWlA5YWYxWnBNV0NLdGdtdGM0VnJLMW9SVWJnPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJhMWNiMDVjMC1hMDgxLTcwYTMtZDU2Yy05NmYwOTI3YjdjMWEiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl9vYjl2NFpGZngiLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiI1b2dzcGE5MTI2YTVxYmJhaHM5ZzE4cnY0bSIsImV2ZW50X2lkIjoiZGQxMDVhN2QtMmU3ZC00NTRjLWFiNWMtMzE1ZjhkMTNmODg1IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJwaG9uZSBvcGVuaWQgZW1haWwiLCJhdXRoX3RpbWUiOjE3NDMxNzQyMTgsImV4cCI6MTc0MzI2MDYxOCwiaWF0IjoxNzQzMTc0MjE4LCJqdGkiOiJjY2MzNzFiMC1mN2I1LTQwNzMtYmY0MC04MGE5OWQ1YTIwNTEiLCJ1c2VybmFtZSI6ImExY2IwNWMwLWEwODEtNzBhMy1kNTZjLTk2ZjA5MjdiN2MxYSJ9.GHqKFxmXAT9Lk8ZkPG3Laz2IvxqgyRZ4SeynsScNMK9iMuG_YN_4Ikfq_RPEYpkVAiWNBY4RHzw-MWltsa6ElnHHM3caTcTiMbdZK2lLzO97Ok-YUMUqrkShRpDaszIE_0VIWBdfunqqRZl7u0Zk82hd9bC-a2PD08UZNZ9AtYWKtwWVTwJUNF-7vkGbr09baKB8ageGkEEryEIJVc5pb1s_TxpSUTy6zNeijMiAMFewqg02uiF95a1sz66i8zXdTyaJ30NFsslXhBqFanIPks8WdAPI5m4cUxYp8oDlHT1dDmqUffgk6twvqwnUVg3Qw8zuWEm5e8fOdf2WnCXPTw&expires_in=86400&token_type=Bearer

https://localhost:3000/#id_token=eyJraWQiOiJkUklaZElRanFnaVk2SkJBaGRvMG05S1RHOVJjTjNQR3ZBc2cxRWxRR0tJPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoidjBYQXUyS084MS1pOEFhSFpLcGlJQSIsInN1YiI6ImYxOGI3NWQwLWQwNzEtNzAzNi1lNDQxLTdiZTRlYTlmZTdjNCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl9vYjl2NFpGZngiLCJjb2duaXRvOnVzZXJuYW1lIjoiZjE4Yjc1ZDAtZDA3MS03MDM2LWU0NDEtN2JlNGVhOWZlN2M0IiwiYXVkIjoiNW9nc3BhOTEyNmE1cWJiYWhzOWcxOHJ2NG0iLCJldmVudF9pZCI6ImQ2YmY0YzU0LTE5ZWUtNDY2NC04YzQ0LTA2ZTUzYTRiOTJhNSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzQzMTkwMzc0LCJleHAiOjE3NDMyNzY3NzQsImlhdCI6MTc0MzE5MDM3NCwianRpIjoiZjE2MTJjMzUtNzRmNy00ZGQzLWE1ZWUtZTc3NzNhYWM2MmQ4IiwiZW1haWwiOiJqcDk5NTlAZy5yaXQuZWR1In0.k8iJA4UlkgMZZAmGI8X4XGLckHU74_q0cbu8WzLDGHiy2_Q4Yq3PWUxJ2wTo1QcHkkBZcW_yn7b365VgD5741TJnQlXHiIOk-nCDXWgHiplt2uf4JeIVADNivsD1-b_CNSNJp2_CsQDPEcUpwJxOsZnXyL-8Rp4tCqPWWxZG7UlnKnhHwdWk7oVfw-A84ttBE3FSlGaqSaOH8hCzXsZngl29ydhiHzs9UEAG9ymRaX1iU9KMW51AYyZSZNEGfRh3rtqsWjG3NX6mq205sK3Z13zf0bkUF5aunvnhP6r_j50LZtBdHIiKoloykTMZOcmwZqUTBu4ceuJFkyuZIwP3JQ&access_token=eyJraWQiOiJuS1FVNkhhelJsMXkzalIxWlA5YWYxWnBNV0NLdGdtdGM0VnJLMW9SVWJnPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJmMThiNzVkMC1kMDcxLTcwMzYtZTQ0MS03YmU0ZWE5ZmU3YzQiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl9vYjl2NFpGZngiLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiI1b2dzcGE5MTI2YTVxYmJhaHM5ZzE4cnY0bSIsImV2ZW50X2lkIjoiZDZiZjRjNTQtMTllZS00NjY0LThjNDQtMDZlNTNhNGI5MmE1IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJwaG9uZSBvcGVuaWQgZW1haWwiLCJhdXRoX3RpbWUiOjE3NDMxOTAzNzQsImV4cCI6MTc0MzI3Njc3NCwiaWF0IjoxNzQzMTkwMzc0LCJqdGkiOiI1NzdlNzk1MS02NzI3LTRjNWUtOTY0OC00MmI5MmI4YjI1MWMiLCJ1c2VybmFtZSI6ImYxOGI3NWQwLWQwNzEtNzAzNi1lNDQxLTdiZTRlYTlmZTdjNCJ9.NLLMNntp6J28rEZdNwUarrjeXw7S0KusuTE82JG3CeTuHe2ZcitwjojPRIr2yv_U1rAtohrl6xrkbUqDGwdMFKWSPQtHgci5JE3yQmoPA_ezk7o0JJ7D7P7A3bf2MBqNLlOv88dFh-YUIkiYr9jOSQ_kaYJLVzcVc-Is6hVoyiLoBtxUNOp5zKsCFgy3n04v7Od5vIpRSld4s5RAPLPynbkN-Wc8Fb1jZ9cKhO0MyTVEFqYTUdCW4Pn633JfvfK34B6GW6T592g0-DyQeE8d5IqS8O4hUVDnW1kwPm9CVr3UcX3ZK6Myi1BXxibar2YSumACWPb_0z4t65HMGe5tMQ&expires_in=86400&token_type=Bearer