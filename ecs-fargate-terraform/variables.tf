variable "aws_region" {
  description = "AWS region to deploy resources"
  default     = "us-east-1"  
}

variable "app_name" {
  description = "Name of the application"
  default     = "unicom-backend"
}

variable "ecr_repository_url" {
  description = "URL of the ECR repository containing your image"
  # No default - you must provide this
  
}

variable "container_port" {
  description = "Port exposed by the container"
  default     = 5000
}

variable "container_cpu" {
  description = "CPU units for the container (1024 = 1 vCPU)"
  default     = 256
}

variable "container_memory" {
  description = "Memory for the container in MiB"
  default     = 512
}

variable "desired_count" {
  description = "Number of instances of the task to run"
  default     = 1
}

variable "environment_variables" {
  description = "Environment variables for the container"
  type        = list(map(string))
  default     = []

}
