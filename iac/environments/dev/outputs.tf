output "vpc_id" {
  description = "Dev VPC ID"
  value       = module.vpc.vpc_id
}

output "vpc_cidr" {
  description = "Dev VPC CIDR"
  value       = module.vpc.vpc_cidr_block
}

output "public_subnet_ids" {
  description = "Dev Public Subnet IDs"
  value       = module.vpc.public_subnet_ids
}

output "private_app_subnet_ids" {
  description = "Dev Private App Subnet IDs"
  value       = module.vpc.private_app_subnet_ids
}

output "database_subnet_ids" {
  description = "Dev Isolated Database Subnet IDs"
  value       = module.vpc.database_subnet_ids
}

output "nat_gateway_ips" {
  description = "Dev Elastic IP(s) for NAT Gateway"
  value       = module.vpc.nat_gateway_ips
}
