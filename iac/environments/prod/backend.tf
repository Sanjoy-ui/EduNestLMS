# ==============================================================================
# Remote S3 Backend Configuration for Prod Environment
# Uncomment and configure with your actual AWS S3 bucket and DynamoDB table
# ==============================================================================
# terraform {
#   backend "s3" {
#     bucket         = "edunest-lms-terraform-state-prod"
#     key            = "prod/vpc/terraform.tfstate"
#     region         = "us-east-1"
#     dynamodb_table = "edunest-lms-terraform-locks-prod"
#     encrypt        = true
#   }
# }
