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

# Deploying the application on AWS

## Pre-requisites

0. Developer machine must have admin access to the AWS project we AWS CLI configured.

1. Create public private key pair in the `infrastructure/keys` directory. This is a unique key pair for the deployment. Use the same key pair for future terraform runs for the same deployment.

    ```bash
    cd infrastructure/keys
    openssl genrsa -out private_key.pem 2048
    openssl rsa -pubout -in private_key.pem -out public_key.pem
    ```

2. Build the website in the `website/unicom` directory.

    ```bash
    cd website/unicom
    npm install
    npm run build
    ```

3. Create terraform state backend s3 bucket if it doesn't exist. And update the bucket name in `infrasture/backend` to match the created bucket.

## Deploy/Update infrastructure

1. Deploy or update (for first time run for the deployment) the infrastructure using terraform.

    ```bash
    terraform init
    terraform apply
    ```

curl -X POST https://x26jf1myka.execute-api.us-east-2.amazonaws.com/users \
  -H "Authorization: Bearer $ID_TOKEN" \
  -H "Content-Type: application/json"

curl -X GET "https://x26jf1myka.execute-api.us-east-2.amazonaws.com/myposts" \
  -H "Authorization: Bearer $ID_TOKEN" \
  -H "Content-Type: application/json"

    http://localhost:3000/#id_token=eyJraWQiOiJMcE9DZVk5bldtVUwwem1mYkJyd203K3ZsVVwvU2Jjdk41T2RmQzVNY2tGUT0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiZWVJMkduaHVJRFZWZnVYdUlMM3QzUSIsInN1YiI6ImQxZmI0NTAwLTMwNzEtNzAwNC05NWFiLTc1ZTAyZTA1N2UxOCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl9DY01mc2l2THQiLCJjb2duaXRvOnVzZXJuYW1lIjoiZDFmYjQ1MDAtMzA3MS03MDA0LTk1YWItNzVlMDJlMDU3ZTE4IiwiYXVkIjoiNXExZm5idHZzOGZjdTluam5kcmxhaG4xaXQiLCJldmVudF9pZCI6IjcwYTVhZDQ2LTM5MWEtNDU3NC05NjI4LTIwNDMyNjczYjM4MCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzQzMjc1Njk2LCJleHAiOjE3NDMzNjIwOTYsImlhdCI6MTc0MzI3NTY5NiwianRpIjoiMGZhMWE5NGItMDc1Mi00MjNkLWFmODUtN2FiMmM3OTBhNWRiIiwiZW1haWwiOiJqcDk5NTlAZy5yaXQuZWR1In0.i9dL13fUlNlaKUnct_itP9T4cvk_LJVVnTH4aBw0GXC81I75QIIcuCoDekidcjHzQYOFANyzUaz96Nc93_rTYODqF3gvyEiFNh2xsiK4W_F844CjGeFybP1v-EAJucThO4POf12QDksPCLXtGcVrb9OHfasP5lLCS39-y_axyXtXz5BcgkfWuVK9pQh5NNjin26gasNZW6debEXQL_Q6lZFVW17FBZEkrTvcjdHxqzIslK8b4kTsNo490UTySCNIRBEWtzs8-1rigAA_4mrB0JTzjvlw5-xQ9vhxcQa8t9DNK1skjx_-CFvvaz2tedcMPNkxBR0o507eN1gZTn2ZUQ&access_token=eyJraWQiOiJIMTg2MEFnRW5JV3c1YnB2UE5ubjc4bWFrYVlJV1ZyYXF4OXFvbHBjUHRVPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJkMWZiNDUwMC0zMDcxLTcwMDQtOTVhYi03NWUwMmUwNTdlMTgiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl9DY01mc2l2THQiLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiI1cTFmbmJ0dnM4ZmN1OW5qbmRybGFobjFpdCIsImV2ZW50X2lkIjoiNzBhNWFkNDYtMzkxYS00NTc0LTk2MjgtMjA0MzI2NzNiMzgwIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImF1dGhfdGltZSI6MTc0MzI3NTY5NiwiZXhwIjoxNzQzMzYyMDk2LCJpYXQiOjE3NDMyNzU2OTYsImp0aSI6IjNhZTk3ZTAzLTQ4YzktNDYxNC05YTAyLWY1NjMwNTZkN2MwNSIsInVzZXJuYW1lIjoiZDFmYjQ1MDAtMzA3MS03MDA0LTk1YWItNzVlMDJlMDU3ZTE4In0.T2xuwHW_4BKMjN7ooTWseZ-_8NVszex0qwN5EOYVVMEN3iLrmE6gMYNGz5H-ENWd4TdjAcTN44lOTDpUzgEq9uETivTJeSq0GFhMXpqvcb6D--bCzWHYYfPjf9-zLUMys0N9vNGBZshtM80yPp3P2FJU5Apqst13KuAOW94HNKjIu31StOJEBMu8X5FpoftPr_Artjihjcn5Xxia3jdiA_cLbodgdMrhdrsJXLYPgj69Q43mxxsi5SUOT5AWK-6aDALVJCewom0FRKWNcoEBaSf_pAnkxtf7JHTPYs5rzQEHbhxuIPpfYicMVvz_3aw7oEanICNg47WU3JGcHNV6vA&expires_in=86400&token_type=Bearer