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

module "ecr" {
  source           = "../../modules/ecr"
  prefix           = var.prefix
  repository_names = ["api-gateway", "backend", "storage-service"]

  tags = {
    Environment = var.environment
    Owner       = "DevOps"
  }
}

module "alb" {
  source            = "../../modules/alb"
  prefix            = var.prefix
  vpc_id            = module.vpc.vpc_id
  public_subnet_ids = module.vpc.public_subnet_ids

  tags = {
    Environment = var.environment
    Owner       = "DevOps"
  }
}

module "iam" {
  source         = "../../modules/iam"
  prefix         = var.prefix
  aws_account_id = var.aws_account_id
  github_repo    = var.github_repo

  tags = {
    Environment = var.environment
    Owner       = "DevOps"
  }
}

module "ecs_ec2" {
  source                    = "../../modules/ecs_ec2"
  prefix                    = var.prefix
  vpc_id                    = module.vpc.vpc_id
  public_subnet_ids         = module.vpc.public_subnet_ids
  alb_security_group_id     = module.alb.alb_security_group_id
  instance_type             = var.instance_type # t3.micro Free Tier
  ami_id                    = var.ami_id
  ecs_instance_profile_name = module.iam.ecs_instance_profile_name

  tags = {
    Environment = var.environment
    Owner       = "DevOps"
  }
}
