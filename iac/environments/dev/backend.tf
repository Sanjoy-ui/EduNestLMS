# ==============================================================================
# Remote S3 Backend Configuration for Dev Environment
# Uncomment and configure with your actual AWS S3 bucket and DynamoDB table
# ==============================================================================
# terraform {
#   backend "s3" {
#     bucket         = "edunest-lms-terraform-state-dev"
#     key            = "dev/vpc/terraform.tfstate"
#     region         = "us-east-1"
#     dynamodb_table = "edunest-lms-terraform-locks-dev"
#     encrypt        = true
#   }
# }
