variable "aws_region" {
  description = "AWS Region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "prefix" {
  description = "Resource prefix"
  type        = string
  default     = "edunest-dev"
}

variable "aws_account_id" {
  description = "AWS Account ID"
  type        = string
  default     = "123456789012"
}

variable "github_repo" {
  description = "GitHub Repository string (e.g. Sanjoy-ui/EduNestLMS)"
  type        = string
  default     = "Sanjoy-ui/EduNestLMS"
}

variable "vpc_cidr" {
  description = "VPC CIDR Block"
  type        = string
  default     = "10.0.0.0/16"
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
  default     = ["us-east-1a", "us-east-1b"]
}

variable "public_subnet_cidrs" {
  description = "Public Subnet CIDRs"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_app_subnet_cidrs" {
  description = "Private App Subnet CIDRs"
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.11.0/24"]
}

variable "database_subnet_cidrs" {
  description = "Database Subnet CIDRs"
  type        = list(string)
  default     = ["10.0.20.0/24", "10.0.21.0/24"]
}

variable "enable_single_nat_gateway" {
  description = "Set to false to eliminate $32/mo NAT Gateway charges for AWS Free Tier"
  type        = bool
  default     = false
}

variable "instance_type" {
  description = "EC2 Instance Type for AWS Free Tier"
  type        = string
  default     = "t3.micro"
}

variable "ami_id" {
  description = "Amazon ECS-Optimized AMI ID (e.g. ami-0c7217cdde317cfec)"
  type        = string
  default     = "ami-0c7217cdde317cfec"
}
