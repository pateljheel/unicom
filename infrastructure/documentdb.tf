locals {
  db_vpc_id          = aws_vpc.main.id
  db_private_subnets = aws_subnet.public_subnets.*.id
  # asg_private_subnets = ["subnet-0a765425ed1ead3fa", "subnet-0b79bd1a2030359c0"]
}

resource "aws_docdb_subnet_group" "db_subnet_group" {
  name       = "${var.app_name}-${var.app_environment}-db-subnet-group"
  subnet_ids = local.db_private_subnets

  tags = merge(
    var.additional_tags,
    {
      "Name"        = "${var.app_name}-${var.app_environment}-db-subnet-group",
      "Environment" = var.app_environment,
    }
  )
}

# DocumentDB Cluster
resource "aws_docdb_cluster" "db_cluster" {
  cluster_identifier      = "${var.app_name}-${var.app_environment}-db-cluster"
  engine                  = "docdb"
  master_username         = var.db_username
  master_password_wo      = var.db_password
  backup_retention_period = 5
  preferred_backup_window = "07:00-09:00"
  db_subnet_group_name    = aws_docdb_subnet_group.db_subnet_group.name

  tags = merge(
    var.additional_tags,
    {
      "Name"        = "${var.app_name}-${var.app_environment}-db-cluster",
      "Environment" = var.app_environment,
    }
  )
}

# DocumentDB Instances
resource "aws_docdb_cluster_instance" "dn_instances" {
  count              = 1
  identifier         = "${var.app_name}-${var.app_environment}-db-instance-${count.index}"
  cluster_identifier = aws_docdb_cluster.db_cluster.id
  instance_class     = var.db_instance_class
  engine             = "docdb"

  tags = merge(
    var.additional_tags,
    {
      "Name"        = "${var.app_name}-${var.app_environment}-db-sg",
      "Environment" = var.app_environment,
    }
  )
}

# Security group for ASG
resource "aws_security_group" "db_sg" {
  name        = "${var.app_name}-${var.app_environment}-db-sg"
  description = "Security group for Document DB"
  vpc_id      = local.db_vpc_id

  tags = merge(
    var.additional_tags,
    {
      "Name"        = "${var.app_name}-${var.app_environment}-db-sg",
      "Environment" = var.app_environment,
    }
  )
}

# Allow all outbound
resource "aws_security_group_rule" "db_allow_all_outbound" {
  type              = "egress"
  protocol          = "-1"
  from_port         = 0
  to_port           = 0
  security_group_id = aws_security_group.db_sg.id
  cidr_blocks       = ["0.0.0.0/0"]
  description       = "Allow all outbound"
}

# Allow HTTP from internal load balancer
resource "aws_security_group_rule" "db_allow_from_asg" {
  type                     = "ingress"
  protocol                 = "tcp"
  from_port                = 27017
  to_port                  = 27017
  security_group_id        = aws_security_group.db_sg.id
  source_security_group_id = aws_security_group.asg_sg.id
  description              = "Allow from ASG to DocumentDB"
}
