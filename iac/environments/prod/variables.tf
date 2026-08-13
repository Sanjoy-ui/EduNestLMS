variable "aws_region" {
  description = "AWS Region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "prod"
}

variable "vpc_cidr" {
  description = "VPC CIDR Block"
  type        = string
}

variable "enable_dns_hostnames" {
  description = "Enable DNS hostnames in VPC"
  type        = bool
  default     = true
}

variable "enable_dns_support" {
  description = "Enable DNS support in VPC"
  type        = bool
  default     = true
}

variable "availability_zones" {
  description = "Availability Zones"
  type        = list(string)
}

variable "public_subnet_cidrs" {
  description = "Public Subnet CIDRs"
  type        = list(string)
}

variable "private_app_subnet_cidrs" {
  description = "Private App Subnet CIDRs"
  type        = list(string)
}

variable "database_subnet_cidrs" {
  description = "Database Subnet CIDRs"
  type        = list(string)
}

variable "enable_single_nat_gateway" {
  description = "Set to false in production for Multi-AZ High Availability NAT Gateways"
  type        = bool
  default     = false
}
