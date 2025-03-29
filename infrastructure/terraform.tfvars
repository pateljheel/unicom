# global variables
app_name = "unicom"
app_environment = "dev"
app_region = "us-east-2"

# vpc variables
vpc_cidr = "10.0.0.0/16"
public_subnet_cidrs = ["10.0.1.0/24", "10.0.2.0/24"]
private_subnet_cidrs = ["10.0.4.0/24", "10.0.5.0/24"]
azs = ["us-east-2a", "us-east-2b"]

# ec2 variables
ami_id = "ami-0fc82f4dabc05670b" # Amazon Linux 2023 AMI
# instance_type = "t3.micro"
key_name = "swen-614-activity-key" # Change this to your key name

# docdb variables
db_username = "unicom"
db_password = "password1234" # Change this to a secure password
db_instance_class = "db.t3.medium"

# s3 variables
website_bucket_name = "unicom-website"
images_bucket_name = "unicom-images"
app_bucket_name = "unicom-app" # Change this to your app bucket name

# cloudfront variables
s3_images_origin_id = "unicom-s3-images-origin"
s3_website_origin_id = "unicom-s3-website-origin"