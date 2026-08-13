# Prod Environment Input Variables (High Availability Architecture)
aws_region   = "us-east-1"
environment  = "prod"
vpc_cidr     = "10.1.0.0/16"

# DNS Settings
enable_dns_hostnames = true
enable_dns_support   = true

availability_zones      = ["us-east-1a", "us-east-1b"]
public_subnet_cidrs     = ["10.1.1.0/24", "10.1.2.0/24"]
private_app_subnet_cidrs = ["10.1.10.0/24", "10.1.20.0/24"]
database_subnet_cidrs   = ["10.1.100.0/24", "10.1.200.0/24"]

# High Availability: 1 NAT Gateway per Availability Zone (Multi-AZ NAT)
enable_single_nat_gateway = false
