# global variables
app_name = "unicom"
app_environment = "dev"
# app_region = "us-east-1"

# vpc variables
vpc_cidr = "10.0.0.0/16"
public_subnet_cidrs = ["10.0.1.0/24", "10.0.2.0/24"]
private_subnet_cidrs = ["10.0.4.0/24", "10.0.5.0/24"]
azs = ["us-east-1a", "us-east-1b"]

# ec2 variables
api_container_image = "jheelp/unicom:latest" # Change this to your API container image

# docdb variables
db_username = "unicom"
db_password = "password1234" # Change this to a secure password
db_instance_class = "db.t3.medium"

# openai
embeddings_provider = "GEMINI"
# embeddings_api_key = "EMBEDDINGS_API_KEY"
