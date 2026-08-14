variable "prefix" {
  type        = string
  description = "Prefix for resources"
}

variable "aws_account_id" {
  type        = string
  description = "AWS Account ID for OIDC federation"
}

variable "github_repo" {
  type        = string
  description = "GitHub repository string (e.g. Sanjoy-ui/EduNestLMS)"
}

variable "tags" {
  type        = map(string)
  description = "Resource tags"
  default     = {}
}
