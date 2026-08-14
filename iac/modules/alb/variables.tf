variable "prefix" {
  type        = string
  description = "Prefix for resources"
}

variable "vpc_id" {
  type        = string
  description = "VPC ID"
}

variable "public_subnet_ids" {
  type        = list(string)
  description = "Public subnet IDs for ALB placement"
}

variable "tags" {
  type        = map(string)
  description = "Resource tags"
  default     = {}
}
