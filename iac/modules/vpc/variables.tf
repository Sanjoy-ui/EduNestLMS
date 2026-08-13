variable "environment" {
  description = "Deployment environment name (e.g. dev, prod)"
  type        = string
}

variable "vpc_cidr" {
  description = "The CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "enable_dns_hostnames" {
  description = "Should be true to enable DNS hostnames in the VPC"
  type        = bool
  default     = true
}

variable "enable_dns_support" {
  description = "Should be true to enable DNS support in the VPC"
  type        = bool
  default     = true
}

variable "availability_zones" {
  description = "List of Availability Zones to deploy subnets in"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "public_subnet_cidrs" {
  description = "List of CIDR blocks for Public Subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_app_subnet_cidrs" {
  description = "List of CIDR blocks for Private App Subnets (EC2 Auto Scaling / ECS / EKS)"
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.20.0/24"]
}

variable "database_subnet_cidrs" {
  description = "List of CIDR blocks for Isolated Database Subnets (RDS / MongoDB Endpoints)"
  type        = list(string)
  default     = ["10.0.100.0/24", "10.0.200.0/24"]
}

variable "enable_single_nat_gateway" {
  description = "If true, provision a single NAT Gateway shared across all AZs (cost-saving for dev). If false, provision 1 NAT Gateway per AZ (HA for prod)."
  type        = bool
  default     = true
}

variable "tags" {
  description = "A map of tags to add to all resources"
  type        = map(string)
  default     = {}
}
