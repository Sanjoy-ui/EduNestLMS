module "vpc" {
  source = "../../modules/vpc"

  environment               = var.environment
  vpc_cidr                  = var.vpc_cidr
  enable_dns_hostnames      = var.enable_dns_hostnames
  enable_dns_support        = var.enable_dns_support
  availability_zones        = var.availability_zones
  public_subnet_cidrs       = var.public_subnet_cidrs
  private_app_subnet_cidrs  = var.private_app_subnet_cidrs
  database_subnet_cidrs     = var.database_subnet_cidrs
  enable_single_nat_gateway = var.enable_single_nat_gateway

  tags = {
    Environment = var.environment
    Owner       = "DevOps"
  }
}
