output "repository_urls" {
  value       = { for k, v in aws_ecr_repository.services : k => v.repository_url }
  description = "Map of repository names to ECR repository URLs"
}

output "repository_arns" {
  value       = { for k, v in aws_ecr_repository.services : k => v.arn }
  description = "Map of repository names to ECR repository ARNs"
}
