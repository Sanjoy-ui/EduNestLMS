# Dev Environment Input Variables (Cost-Optimized)
aws_region  = "us-east-1"
environment = "dev"
vpc_cidr    = "10.0.0.0/16"

# DNS Settings
enable_dns_hostnames = true
enable_dns_support   = true

availability_zones       = ["us-east-1a", "us-east-1b"]
public_subnet_cidrs      = ["10.0.1.0/24", "10.0.2.0/24"]
private_app_subnet_cidrs = ["10.0.10.0/24", "10.0.20.0/24"]
database_subnet_cidrs    = ["10.0.100.0/24", "10.0.200.0/24"]

# Cost Optimization: Single NAT Gateway shared across both AZs
enable_single_nat_gateway = true
