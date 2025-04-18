aws_region = "us-east-1"
ecr_repository_url = "463470956663.dkr.ecr.us-east-1.amazonaws.com/unicom-webapp:latest"
container_port = 5000
app_name = "unicom-backend"
container_cpu = 256
container_memory = 512
desired_count = 1


environment_variables = [
  { name = "FLASK_PORT",               value = "8080" },
  { name = "MONGO_HOST",               value = "unicom-stg-db-cluster.cluster-ctq0o6uy8zy0.us-east-1.docdb.amazonaws.com" },
  { name = "MONGO_PORT",               value = "27017" },
  { name = "MONGO_DB",                 value = "unicom" },
  { name = "MONGO_USERNAME",           value = "unicom" },
  { name = "MONGO_PASSWORD",           value = "password1234" },
  { name = "MONGO_USE_TLS",            value = "true" },
  { name = "MONGO_CA_FILE",            value = "/home/ec2-user/global-bundle.pem" },
  { name = "MONGO_MIN_POOL_SIZE",      value = "5" },
  { name = "MONGO_MAX_POOL_SIZE",      value = "50" },
  { name = "COGNITO_POOL_ID",          value = "us-east-1_iebQX6LmJ" },
  { name = "COGNITO_REGION",           value = "us-east-1" },
  { name = "COGNITO_APP_CLIENT_ID",    value = "vs34pa3s7a7r7djh9ne9mg4vr" },
  { name = "S3_BUCKET_NAME",           value = "unicom-images-02-stg" },
  { name = "CLOUDFRONT_URL",           value = "https://d24y3yx3eon90o.cloudfront.net/" },
  { name = "CLOUDFRONT_KEY_PAIR_ID",   value = "K1689NVAFK3POC" },
  { name = "CLOUDFRONT_PRIVATE_KEY_PATH", value = "/home/ec2-user/keys/private_key.pem" },
]
