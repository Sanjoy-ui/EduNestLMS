output "vpc_id" {
  value = module.vpc.vpc_id
}

output "public_subnet_ids" {
  value = module.vpc.public_subnet_ids
}

output "ecr_repository_urls" {
  value = module.ecr.repository_urls
}

output "alb_dns_name" {
  value = module.alb.alb_dns_name
}

output "ecs_cluster_name" {
  value = module.ecs_ec2.cluster_name
}

output "github_actions_role_arn" {
  value = module.iam.github_actions_role_arn
}

output "ecs_execution_role_arn" {
  value = module.iam.ecs_execution_role_arn
}
