output "vpc_id" {
  description = "Prod VPC ID"
  value       = module.vpc.vpc_id
}

output "vpc_cidr" {
  description = "Prod VPC CIDR"
  value       = module.vpc.vpc_cidr_block
}

output "public_subnet_ids" {
  description = "Prod Public Subnet IDs"
  value       = module.vpc.public_subnet_ids
}

output "private_app_subnet_ids" {
  description = "Prod Private App Subnet IDs"
  value       = module.vpc.private_app_subnet_ids
}

output "database_subnet_ids" {
  description = "Prod Isolated Database Subnet IDs"
  value       = module.vpc.database_subnet_ids
}

output "nat_gateway_ips" {
  description = "Prod Elastic IP(s) for NAT Gateways (Multi-AZ)"
  value       = module.vpc.nat_gateway_ips
}
