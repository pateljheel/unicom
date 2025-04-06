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

0. Developer machine must have admin access to the AWS project with AWS CLI configured.

1. Create public private key pair in the `infrastructure/keys` directory. This is a unique key pair for the deployment. Use the same key pair for future terraform runs for the same deployment.

    ```bash
    cd infrastructure/keys
    openssl genrsa -out private_key.pem 2048
    openssl rsa -pubout -in private_key.pem -out public_key.pem
    ```

2. Create terraform state backend s3 bucket if it doesn't exist. And update the bucket name in `infrastructure/backend` to match the created bucket.

## Deploy/Update infrastructure and website

1. Deploy or update (for subsequent runs of the deployment) the infrastructure using terraform.

    ```bash
    cd infrastructure
    terraform init
    terraform apply
    ```

2. Build the website in the `website/unicom` directory.

    ```bash
    cd ../website/unicom
    npm install
    npm run build
    ```

3. Again run terraform to sync website to the website s3 bucket.

    ```bash
    cd ../../infrastructure
    terraform init
    terraform apply
    ```


## API Docs are available at the API endpoint `/apidocs`.


## Points

1. Use signed url instead of signed cookies.
2. Move hardcoded values out from all the pages.
3. Use auth context for id_token and signedurl instead of local storage.
4. Update CORS on the API gateway.