# Provider Configuration
provider "aws" {
  region = "us-east-1"
}

# DocumentDB Cluster
resource "aws_docdb_cluster" "example" {
  cluster_identifier      = "my-docdb-cluster"
  engine                  = "docdb"
  master_username         = "admin"
  master_password         = "password123"
  backup_retention_period = 5
  preferred_backup_window = "07:00-09:00"
}

# DocumentDB Instances
resource "aws_docdb_cluster_instance" "example" {
  count               = 2
  identifier          = "my-docdb-instance-${count.index}"
  cluster_identifier  = aws_docdb_cluster.example.id
  instance_class      = "db.r5.large"
  engine              = "docdb"
}

# Security Group
resource "aws_security_group" "docdb_sg" {
  name        = "docdb-sg"
  description = "Allow traffic to DocumentDB"

  ingress {
    from_port   = 27017
    to_port     = 27017
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Output the Connection String
output "docdb_connection_string" {
  value = aws_docdb_cluster.example.endpoint
}
