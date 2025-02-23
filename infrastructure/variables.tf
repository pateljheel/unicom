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
  default     = "us-east-1"
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


# # vpc variables
# variable "vpc_cidr" {
#   description = "CIDR block for the VPC"
#   type        = string
# }

# variable "public_subnets" {
#     description = "List of maps containing public subnet CIDR blocks and AZs"
#     type        = list(object({
#         cidr_block = string
#         availability_zone = string
#     }))
# }
# variable "private_subnets" {
#     description = "List of maps containing private subnet CIDR blocks and AZs"
#     type        = list(object({
#         cidr_block = string
#         availability_zone = string
#     }))
# }
# variable "nat_gateways" {
#     description = "Nat gateway subnets"
#     type        = list(string)
# }


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
# variable "key_name" {
#   description = "Key pair name for SSH access to the EC2 instance"
#   type        = string
# }
variable "health_check_path" {
  description = "Health check path for the ALB"
  type        = string
  default     = "/"
}