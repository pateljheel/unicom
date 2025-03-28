resource "aws_s3_bucket" "website_bucket" {
  bucket        = "${var.website_bucket_name}-${var.app_environment}"
  force_destroy = true

  tags = merge(
    var.additional_tags,
    {
      "Name"        = "${var.website_bucket_name}-${var.app_environment}",
      "Environment" = var.app_environment,
    }
  )
}

resource "aws_s3_bucket_website_configuration" "website_config" {
  bucket = aws_s3_bucket.website_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_public_access_block" "public_access" {
  bucket = aws_s3_bucket.website_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "public_policy" {
  bucket = aws_s3_bucket.website_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action = [
          "s3:GetObject"
        ]
        Resource = "${aws_s3_bucket.website_bucket.arn}/*"
      }
    ]
  })
}

resource "aws_s3_bucket" "images_bucket" {
  bucket = "${var.images_bucket_name}-${var.app_environment}"

  tags = merge(
    var.additional_tags,
    {
      "Name"        = "${var.images_bucket_name}-${var.app_environment}",
      "Environment" = var.app_environment,
    }
  )
}

resource "aws_iam_policy" "s3_full_access_policy" {
  name        = "${var.app_name}-${var.app_environment}-s3-full-access"
  description = "Allow full access to image buckets"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid    = "AllowS3FullAccessForImages",
        Effect = "Allow",
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:ListBucket",
          "s3:GetBucketLocation",
          "s3:GetObjectAcl"
        ],
        Resource = [
          "arn:aws:s3:::${var.images_bucket_name}-${var.app_environment}",
          "arn:aws:s3:::${var.images_bucket_name}-${var.app_environment}/*",
        ]
      }
    ]
  })
}

resource "aws_s3_bucket_policy" "images_bucket_policy" {
  bucket = aws_s3_bucket.images_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Id      = "AllowGetObjects"
    Statement = [
      {
        "Sid" : "AllowCloudFrontServicePrincipal",
        "Effect" : "Allow",
        "Principal" : {
          "Service" : "cloudfront.amazonaws.com"
        },
        "Action" : "s3:GetObject",
        "Resource" : "${aws_s3_bucket.images_bucket.arn}/published/**",
        "Condition" : {
          "StringEquals" : {
            "AWS:SourceArn" : "${aws_cloudfront_distribution.s3_distribution.arn}"
          }
        }
      }
    ]
  })
}

resource "aws_s3_bucket_cors_configuration" "images_bucket_cors" {
  bucket = aws_s3_bucket.images_bucket.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}
