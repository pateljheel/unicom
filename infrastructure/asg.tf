locals {
  asg_vpc_id          = aws_vpc.main.id
  asg_private_subnets = aws_subnet.private_subnets.*.id
}


data "template_file" "ec2_user_data" {
  template = file("${path.module}/scripts/unicom_api_bootstrap.sh.tpl")

  vars = {
    aws_region = var.app_region
    app_bucket = aws_s3_bucket.app_bucket.bucket
  }
}

# ASG template
resource "aws_launch_template" "asg_template" {
  name          = "${var.app_name}-${var.app_environment}-asg-template"
  image_id      = var.ami_id
  instance_type = var.instance_type

  user_data = base64encode(data.template_file.ec2_user_data.rendered)

  tags = merge(
    var.additional_tags,
    {
      "Name"        = "${var.app_name}-${var.app_environment}-asg-template",
      "Environment" = var.app_environment,
    }
  )

  network_interfaces {
    associate_public_ip_address = false
    device_index                = 0
    security_groups             = [aws_security_group.asg_sg.id]
  }

  iam_instance_profile {
    name = aws_iam_instance_profile.asg_instance_profile.name
  }

  key_name = var.key_name
}

# ASG
resource "aws_autoscaling_group" "asg" {
  name = "${var.app_name}-${var.app_environment}-asg"

  launch_template {
    id      = aws_launch_template.asg_template.id
    version = aws_launch_template.asg_template.latest_version
  }

  min_size                  = 1
  max_size                  = 3
  desired_capacity          = 1
  vpc_zone_identifier       = local.asg_private_subnets
  health_check_type         = "ELB"
  health_check_grace_period = 300

  dynamic "tag" {
    for_each = merge(
      var.additional_tags,
      {
        "Name"        = "${var.app_name}-${var.app_environment}-asg",
        "Environment" = var.app_environment,
      }
    )
    content {
      key                 = tag.key
      value               = tag.value
      propagate_at_launch = true
    }
  }

  instance_maintenance_policy {
    min_healthy_percentage = 90
    max_healthy_percentage = 120
  }

  instance_refresh {
    strategy = "Rolling"
    preferences {
      min_healthy_percentage = 50
    }
  }

  depends_on = [aws_launch_template.asg_template]
}

# Target group attachment
resource "aws_autoscaling_attachment" "asg_attachment" {
  autoscaling_group_name = aws_autoscaling_group.asg.name
  lb_target_group_arn    = aws_lb_target_group.alb_target_group.arn
}

# Security group for ASG
resource "aws_security_group" "asg_sg" {
  name        = "${var.app_name}-${var.app_environment}-asg-sg"
  description = "Security group for ASG"
  vpc_id      = local.asg_vpc_id

  tags = merge(
    var.additional_tags,
    {
      "Name"        = "${var.app_name}-${var.app_environment}-asg-sg",
      "Environment" = var.app_environment,
    }
  )
}

# Allow all outbound
resource "aws_security_group_rule" "asg_allow_all_outbound" {
  type              = "egress"
  protocol          = "-1"
  from_port         = 0
  to_port           = 0
  security_group_id = aws_security_group.asg_sg.id
  cidr_blocks       = ["0.0.0.0/0"]
  description       = "Allow all outbound"
}

# Allow HTTP from internal load balancer
resource "aws_security_group_rule" "allow_http_from_lb" {
  type                     = "ingress"
  protocol                 = "tcp"
  from_port                = 8080
  to_port                  = 8080
  security_group_id        = aws_security_group.asg_sg.id
  source_security_group_id = aws_security_group.alb_sg.id

  description = "Allow HTTP from internal load balancer"
}

# Allow SSH from everywhere
resource "aws_security_group_rule" "allow_ssh" {
  type              = "ingress"
  protocol          = "tcp"
  from_port         = 22
  to_port           = 22
  security_group_id = aws_security_group.asg_sg.id
  cidr_blocks       = ["0.0.0.0/0"]
  description       = "Allow SSH from everywhere"
}

resource "aws_iam_role" "asg_instance_role" {
  name = "${var.app_name}-${var.app_environment}-asg-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "ec2.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Name = "${var.app_name}-${var.app_environment}-asg-role"
  }
}

resource "aws_iam_role_policy_attachment" "attach_s3_policy" {
  role       = aws_iam_role.asg_instance_role.name
  policy_arn = aws_iam_policy.s3_full_access_policy.arn
}

resource "aws_iam_role_policy_attachment" "attach_app_s3_policy" {
  role       = aws_iam_role.asg_instance_role.name
  policy_arn = aws_iam_policy.s3_view_access_policy.arn
}

resource "aws_iam_instance_profile" "asg_instance_profile" {
  name = "${var.app_name}-${var.app_environment}-asg-instance-profile"
  role = aws_iam_role.asg_instance_role.name
}
