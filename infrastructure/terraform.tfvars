# global variables
app_name = "unicom"
app_environment = "dev"
app_region = "us-east-2"

# ec2 variables
# ami_id = "ami-0fc82f4dabc05670b" # Amazon Linux 2023 AMI
# instance_type = "t3.micro"
key_name = "swen-614-activity-key" # Change this to your key name

# docdb variables
db_username = "unicom"
db_password = "password1234" # Change this to a secure password
db_instance_class = "db.t3.medium"

# s3 variables
website_bucket_name = "unicom-website"
images_bucket_name = "unicom-images"
draft_images_bucket_name = "unicom-draft-images"

# cloudfront variables
s3_origin_id = "unicom-s3-origin"