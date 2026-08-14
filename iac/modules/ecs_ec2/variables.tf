variable "prefix" {
  type        = string
  description = "Prefix for resources"
}

variable "vpc_id" {
  type        = string
  description = "VPC ID"
}

variable "private_subnet_ids" {
  type        = list(string)
  description = "Private subnet IDs for EC2 host placement (no public IP, NAT Gateway for outbound)"
}

variable "alb_security_group_id" {
  type        = string
  description = "ALB Security Group ID"
}

variable "instance_type" {
  type        = string
  description = "EC2 Instance Type for AWS Free Tier"
  default     = "t3.micro"
}

variable "ami_id" {
  type        = string
  description = "Amazon ECS-Optimized AMI ID"
}

variable "ecs_instance_profile_name" {
  type        = string
  description = "IAM Instance Profile Name for ECS EC2 Agent"
}

variable "tags" {
  type        = map(string)
  description = "Resource tags"
  default     = {}
}
