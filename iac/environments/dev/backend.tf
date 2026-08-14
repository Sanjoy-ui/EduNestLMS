# ==============================================================================
# Remote S3 Backend - State is stored in S3 so apply + destroy share the same
# resource list. Bucket name is passed via -backend-config in CI/CD workflows.
# ==============================================================================
terraform {
  backend "s3" {
    key            = "dev/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "edunest-lms-terraform-locks"
    encrypt        = true
    # bucket is injected via: terraform init -backend-config="bucket=$TF_STATE_BUCKET"
  }
}
