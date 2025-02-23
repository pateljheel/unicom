locals {
    # alb_private_subnets = data.terraform_remote_state.vpc.outputs.private_subnets
    # alb_vpc_id = data.terraform_remote_state.vpc.outputs.vpc_id
    alb_vpc_id = "vpc-0a8aa856369966521"
    alb_private_subnets = ["subnet-0a765425ed1ead3fa", "subnet-0b79bd1a2030359c0"]
}

# ALB
resource "aws_lb" "alb" {
  name               = "${var.app_name}-${var.app_environment}-alb"
  internal           = true
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = local.alb_private_subnets

  enable_deletion_protection = false

  tags = merge(
    var.additional_tags,
    {
      "Name"        = "${var.app_name}-${var.app_environment}-alb",
      "Environment" = var.app_environment,
    }
  )
}

# ALB target group
resource "aws_lb_target_group" "alb_target_group" {
  name     = "${var.app_name}-${var.app_environment}-asg-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = local.alb_vpc_id

  health_check {
    path                = "/"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200-299"
  }

  tags = merge(
    var.additional_tags,
    {
      "Name"        = "${var.app_name}-${var.app_environment}-tg",
      "Environment" = var.app_environment,
    }
  )
}

# ALB http listener
resource "aws_lb_listener" "alb_http_listener" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.alb_target_group.arn
  }

  tags = merge(
    var.additional_tags,
    {
      "Name"        = "${var.app_name}-${var.app_environment}-http-listener",
      "Environment" = var.app_environment,
    }
  )
}

# ALB security group
resource "aws_security_group" "alb_sg" {
  name        = "${var.app_name}-${var.app_environment}-alb-sg"
  description = "Security group for the ALB"
  vpc_id      = local.alb_vpc_id

    tags = merge(
        var.additional_tags,
        {
        "Name"        = "${var.app_name}-${var.app_environment}-alb-sg",
        "Environment" = var.app_environment,
        }
    )
}

# Allow all outbound
resource "aws_security_group_rule" "alb_allow_all_outbound" {
  type              = "egress"
  protocol          = "-1"
  from_port         = 0
  to_port           = 0
  security_group_id = aws_security_group.alb_sg.id
  cidr_blocks       = ["0.0.0.0/0"]
    description = "Allow all outbound"
}