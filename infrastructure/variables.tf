# # application global variables
# variable "app_name" {
#   description = "Application name"
#   type        = string
# }
# variable "app_environment" {
#   description = "Application environment"
#   type        = string
# }
# variable "app_region" {
#   description = "Application region"
#   type        = string
# }
# variable "additional_tags" {
#   description = "Additional tags to be applied to all resources"
#   type        = map(string)
# }


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
