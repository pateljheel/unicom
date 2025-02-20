# term-project-team1-unifamily
term-project-team1-unifamily created by GitHub Classroom

# Branching strategy

- All infrastructure feature branches must follow `tf-feature_name` branch name. When a new feature must be added, created a feature branch from main and once done create a merge request.

- For application use branch name `app-feature_name`.

- As the first iteration is MVP only, no need to have versioning.

# Terraform practices

- Naming convention for regional resources:
    `{APP_NAME}-{APP_ENV}-{SERVICE_NAME}-{UNIQUE_APP_ID}`

- Naming convention for zonal resources:
    `{APP_NAME}-{APP_ENV}-{SERVICE_NAME}-{AZ}-{UNIQUE_APP_ID}`

