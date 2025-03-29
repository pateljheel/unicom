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
curl -X GET "https://sxj4mye19c.execute-api.us-east-2.amazonaws.com/users/jp9959@g.rit.edu" \
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


id_token=eyJraWQiOiJOeUk5OHN0OFwvbFhCZ2FCXC82cklqNWdtazh5eDlWWFdDT0dHNElwTVhDc0E9IiwiYWxnIjoiUlMyNTYifQ.eyJhdF9oYXNoIjoic2p1aDFXalJqakdDYWtyUUplZTFEdyIsInN1YiI6IjQxMGJkNWMwLTgwMTEtNzBhOS02NTYwLWM2MWRiZWQ5MWU3ZCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl9wRFJxQWpBZVkiLCJjb2duaXRvOnVzZXJuYW1lIjoiNDEwYmQ1YzAtODAxMS03MGE5LTY1NjAtYzYxZGJlZDkxZTdkIiwiYXVkIjoiM212ZzBwZGx2NDc1MWRocjUyaXJlZDVvbDIiLCJldmVudF9pZCI6IjE1NTRlODk3LWU5M2YtNGI3YS1iOTMyLWI3N2I3OWZhYjVmYyIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzQzMjYxODQ5LCJleHAiOjE3NDMzNDgyNDksImlhdCI6MTc0MzI2MTg0OSwianRpIjoiMTBhMjBhODMtY2Y0Mi00N2IxLWI3NTAtMDc5YTY2OGExMzQ4IiwiZW1haWwiOiJqcDk5NTlAZy5yaXQuZWR1In0.lHZua5fabCo7vQM__nCAwhq4BusrjtdHB4gQWSF45gdp70xYr2AoHIy2G0QlvuFfIeeoEBXD7TWOTNLujwx480CtmUits-jQj_Vdp2OMycX8W-p9uX1ooJgYWZS6IpyoqBWo8ucv0WEcGiY3IbM3jD_CNKuvBzl49GTy_A8eAA3T437qH4z9kpMbGgsgao4APmHZTKe3vqr6htjCCwPuwqkhL21dWB_E_UTsxqP2FDfUiW989hwNzzoQCWYjNrl-p89n91k93CKsBg6K0pfb7qUmz-498a7HMIrtiGhaZO4VF0yFKy2AV7WHhlLuBgl4Ljlb3F94AHSW2MW4meSpkg
