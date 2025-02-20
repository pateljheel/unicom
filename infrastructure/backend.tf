# manage state in S3
terraform {
  backend "s3" {
    bucket         = "tf-state-<your-unique-bucket-name>"
    key            = "terraform.tfstate"
    region         = "us-east-2"
    prefix         = "terraform/state"
  }
}