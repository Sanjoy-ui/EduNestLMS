output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.main.id
}

output "vpc_cidr_block" {
  description = "The CIDR block of the VPC"
  value       = aws_vpc.main.cidr_block
}

output "public_subnet_ids" {
  description = "List of IDs of Public Subnets"
  value       = aws_subnet.public[*].id
}

output "private_app_subnet_ids" {
  description = "List of IDs of Private App Subnets"
  value       = aws_subnet.private_app[*].id
}

output "database_subnet_ids" {
  description = "List of IDs of Isolated Database Subnets"
  value       = aws_subnet.database[*].id
}

output "internet_gateway_id" {
  description = "The ID of the Internet Gateway"
  value       = aws_internet_gateway.gw.id
}

output "nat_gateway_ips" {
  description = "List of Public Elastic IP addresses allocated for NAT Gateways"
  value       = aws_eip.nat[*].public_ip
}

output "public_route_table_id" {
  description = "ID of the Public Route Table"
  value       = aws_route_table.public.id
}

output "private_route_table_ids" {
  description = "List of IDs of Private Route Tables"
  value       = aws_route_table.private[*].id
}

output "database_route_table_id" {
  description = "ID of the Isolated Database Route Table"
  value       = aws_route_table.database.id
}
