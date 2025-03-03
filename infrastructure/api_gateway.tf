locals {
  api_subnets     = ["subnet-0a765425ed1ead3fa", "subnet-0b79bd1a2030359c0"]
  vpc_link_sgs    = []
  api_gateway_sgs = []
}

resource "aws_apigatewayv2_vpc_link" "alb_vpc_link" {
  name               = "${var.app_name}-${var.app_environment}-api-vpc-link"
  security_group_ids = local.vpc_link_sgs
  subnet_ids         = local.api_subnets

  tags = merge(
    var.additional_tags,
    {
      "Name"        = "${var.app_name}-${var.app_environment}-api-vpc-link",
      "Environment" = var.app_environment,
    }
  )

}

resource "aws_apigatewayv2_api" "http_api" {
  name          = "${var.app_name}-${var.app_environment}-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = var.app_environment
  auto_deploy = true
}

# resource "aws_apigatewayv2_integration" "http_integration" {
#   api_id             = aws_apigatewayv2_api.http_api.id
#   integration_type   = "HTTP_PROXY"
#   integration_uri    = "https://example.com"
#   integration_method = "ANY"
# }

resource "aws_apigatewayv2_integration" "alb_integration" {
  api_id           = aws_apigatewayv2_api.http_api.id
  description      = "Integration with internal ALB"
  integration_type = "HTTP_PROXY"
  integration_uri  = aws_lb_listener.alb_http_listener.arn

  integration_method = "ANY"
  connection_type    = "VPC_LINK"
  connection_id      = aws_apigatewayv2_vpc_link.alb_vpc_link.id

  # tls_config {
  #   server_name_to_verify = "example.com"
  # }

  request_parameters = {
    "append:header.authforintegration" = "$context.authorizer.authorizerResponse"
    "overwrite:path"                   = "staticValueForIntegration"
  }

  # response_parameters {
  #   status_code = 403
  #   mappings = {
  #     "append:header.auth" = "$context.authorizer.authorizerResponse"
  #   }
  # }

  response_parameters {
    status_code = 200
    mappings = {
      "overwrite:statuscode" = "204"
    }
  }
}

# resource "aws_apigatewayv2_route" "hello_route" {
#   api_id    = aws_apigatewayv2_api.http_api.id
#   route_key = "GET /hello"
#   target    = "integrations/${aws_apigatewayv2_integration.http_integration.id}"
# }

output "api_gateway_url" {
  value = aws_apigatewayv2_stage.default.invoke_url
}

output "api_gateway_arn" {
  value = aws_apigatewayv2_stage.default.arn
}
