# # application global variables
variable "app_name" {
  description = "Application name"
  type        = string
}
variable "app_environment" {
  description = "Application environment"
  type        = string
}
variable "app_region" {
  description = "Application region"
  type        = string
  default     = "us-east-2"
}
variable "additional_tags" {
  description = "Additional tags to be applied to all resources"
  type        = map(string)
  default     = {}
}
variable "aws_profile" {
  description = "AWS profile to use"
  type        = string
  default     = "default"
}


# vpc variables
variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  type        = list(string)
  description = "Public Subnet CIDR values"
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  type        = list(string)
  description = "Private Subnet CIDR values"
  default     = ["10.0.4.0/24", "10.0.5.0/24"]
}

variable "azs" {
  type        = list(string)
  description = "Availability Zones"
  default     = ["us-east-2a", "us-east-2b"]
}


# ec2 variables
variable "ami_id" {
  description = "AMI ID to use for the EC2 instance"
  type        = string
  default     = "ami-0fc82f4dabc05670b" # Amazon Linux 2023 AMI
}
variable "instance_type" {
  description = "Instance type for the EC2 instance"
  type        = string
  default     = "t3.micro"
}
variable "key_name" {
  description = "Key pair name for SSH access to the EC2 instance"
  type        = string
  default     = null
}
variable "health_check_path" {
  description = "Health check path for the ALB"
  type        = string
  default     = "/"
}

# api gateway variables


# documentdb variables
variable "db_instance_class" {
  description = "Instance class for DocumentDB"
  type        = string
  default     = "db.r5.large"
}
variable "db_username" {
  description = "Master username for DocumentDB"
  type        = string
  sensitive   = true
}
variable "db_password" {
  description = "Master password for DocumentDB"
  type        = string
  sensitive   = true
}
variable "db_skip_final_snapshot" {
  description = "Skip final snapshot for DocumentDB"
  type        = bool
  default     = true
}


# s3 variables
variable "website_bucket_name" {
  description = "S3 bucket name"
  type        = string
}

variable "images_bucket_name" {
  description = "S3 bucket name for images"
  type        = string
}

variable "draft_images_bucket_name" {
  description = "S3 bucket name for draft images"
  type        = string
}

# cloudfront variables
variable "s3_origin_id" {
  description = "Origin ID for S3 bucket in CloudFront"
  type        = string
}
variable "s3_distribution_price_class" {
  description = "Price class for CloudFront distribution"
  type        = string
  default     = "PriceClass_100" # Options: PriceClass_100, PriceClass_200, PriceClass_All
}
variable "s3_distribution_public_key" {
  description = "Path to the public key for CloudFront signing"
  type        = string
  default     = "keys/public_key.pem" # Update this path to your public key file
}