output "ecs_execution_role_arn" {
  value       = aws_iam_role.ecs_execution_role.arn
  description = "ECS Task Execution Role ARN"
}

output "ecs_task_role_arn" {
  value       = aws_iam_role.ecs_task_role.arn
  description = "ECS Task Role ARN"
}

output "ecs_instance_profile_name" {
  value       = aws_iam_instance_profile.ecs_instance_profile.name
  description = "ECS Instance Profile Name"
}

output "github_actions_role_arn" {
  value       = aws_iam_role.github_actions_oidc.arn
  description = "GitHub Actions OIDC Role ARN"
}
