# manage state in S3
terraform {
  backend "s3" {
    bucket         = "s3-aws-project-unicom"
    key            = "terraform.tfstate"
    region         = "us-east-1"
  }
}