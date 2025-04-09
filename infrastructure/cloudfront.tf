resource "aws_cloudfront_origin_access_control" "s3_oac" {
  name                              = "${var.app_name}-${var.app_environment}-origin-access-control"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "tls_private_key" "cloudfront_signing_key" {
  algorithm = "RSA"
  rsa_bits  = 2048
}

resource "aws_cloudfront_public_key" "signing_key" {
  encoded_key = tls_private_key.cloudfront_signing_key.public_key_pem
  name        = "${var.app_name}-${var.app_environment}-s3-distribution-public-key"
}

resource "aws_cloudfront_key_group" "signing_key_group" {
  items = [aws_cloudfront_public_key.signing_key.id]
  name  = "${var.app_name}-${var.app_environment}-s3-distribution-key-group"
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = aws_s3_bucket.images_bucket.bucket_regional_domain_name
    origin_id   = var.s3_images_origin_id
    # Origin Access Control
    origin_access_control_id = aws_cloudfront_origin_access_control.s3_oac.id
    # origin_path = "/published"
  }

  origin {
    domain_name = aws_s3_bucket_website_configuration.website_config.website_endpoint
    origin_id   = var.s3_website_origin_id
    # Origin Access Control
    # origin_access_control_id = aws_cloudfront_origin_access_control.s3_oac.id

    custom_origin_config {
      http_port                = 80
      https_port               = 443
      origin_keepalive_timeout = 5
      origin_protocol_policy   = "http-only"
      origin_read_timeout      = 30
      origin_ssl_protocols = [
        "SSLv3",
        "TLSv1",
        "TLSv1.1",
        "TLSv1.2",
      ]
    }

  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "Some comment"
  default_root_object = "index.html"

  #   logging_config {
  #     include_cookies = false
  #     bucket          = "mylogs.s3.amazonaws.com"
  #     prefix          = "myprefix"
  #   }

  #   aliases = ["mysite.example.com", "yoursite.example.com"]

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = var.s3_website_origin_id

    forwarded_values {
      query_string = false
      headers      = ["Origin"]

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  # Cache behavior with precedence 0
  ordered_cache_behavior {
    path_pattern     = "/published/**"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = var.s3_images_origin_id

    forwarded_values {
      query_string = false
      headers      = ["Origin"]

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400

    trusted_key_groups = [aws_cloudfront_key_group.signing_key_group.id]
  }

  price_class = var.s3_distribution_price_class

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["US"]
    }
  }

  tags = merge(
    var.additional_tags,
    {
      "Name"        = "${var.app_name}-${var.app_environment}-s3-distribution",
      "Environment" = var.app_environment,
    }
  )

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
