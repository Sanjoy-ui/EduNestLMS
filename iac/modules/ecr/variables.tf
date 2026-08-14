variable "prefix" {
  type        = string
  description = "Prefix for ECR repository names"
}

variable "repository_names" {
  type        = list(string)
  description = "List of microservice repository names"
  default     = ["api-gateway", "backend", "storage-service"]
}

variable "tags" {
  type        = map(string)
  description = "Resource tags"
  default     = {}
}
