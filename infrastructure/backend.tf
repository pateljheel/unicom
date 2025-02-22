# manage state in S3
terraform {
  backend "s3" {
    bucket         = "unifamily-tf-state"
    key            = "terraform.tfstate"
    region         = "us-east-2"
    prefix         = "terraform/state"
  }
}