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

    ```bash
    # each developer must work in their own terraform workspace
    # name of the workspace can be anything related to their name, all uncased

    # if workspace is not created create it using the following command
    terraform workspace new <WORKSPACE_NAME>
    # or select existing environment on your local clone
    terraform workspace select <WORKSPACE_NAME>
    ```

    The backend key in the bucket will be automatically selected based on the workspace name. Read https://developer.hashicorp.com/terraform/cli/workspaces for more details.

- Single S3 bucket will be used for state management for all the developers. Bucket policy is configured to allow cross account users to access it. Following S3 policy must be applied to the state bucket.

    ```json
    
    ```