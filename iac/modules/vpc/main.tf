# ==============================================================================
# AWS Virtual Private Cloud (VPC)
# ==============================================================================
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = var.enable_dns_hostnames
  enable_dns_support   = var.enable_dns_support

  tags = merge(
    {
      Name        = "${var.environment}-vpc"
      Environment = var.environment
      ManagedBy   = "Terraform"
    },
    var.tags
  )
}

# ==============================================================================
# Internet Gateway (IGW) for Public Internet Connectivity
# ==============================================================================
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id

  tags = merge(
    {
      Name        = "${var.environment}-igw"
      Environment = var.environment
      ManagedBy   = "Terraform"
    },
    var.tags
  )
}

# ==============================================================================
# Public Subnets (AZ 1a & 1b)
# ==============================================================================
resource "aws_subnet" "public" {
  count                   = length(var.public_subnet_cidrs)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = merge(
    {
      Name        = "${var.environment}-public-subnet-${var.availability_zones[count.index]}"
      Environment = var.environment
      Type        = "Public"
      ManagedBy   = "Terraform"
    },
    var.tags
  )
}

# ==============================================================================
# Private Application Subnets (Auto-Scaling Group / EC2 / ECS / EKS)
# ==============================================================================
resource "aws_subnet" "private_app" {
  count             = length(var.private_app_subnet_cidrs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_app_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]

  tags = merge(
    {
      Name        = "${var.environment}-private-app-subnet-${var.availability_zones[count.index]}"
      Environment = var.environment
      Type        = "Private-App"
      ManagedBy   = "Terraform"
    },
    var.tags
  )
}

# ==============================================================================
# Isolated Database Subnets (RDS / MongoDB Endpoints)
# ==============================================================================
resource "aws_subnet" "database" {
  count             = length(var.database_subnet_cidrs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.database_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]

  tags = merge(
    {
      Name        = "${var.environment}-isolated-db-subnet-${var.availability_zones[count.index]}"
      Environment = var.environment
      Type        = "Database-Isolated"
      ManagedBy   = "Terraform"
    },
    var.tags
  )
}

# ==============================================================================
# Elastic IPs & NAT Gateway(s)
# Single NAT Gateway for Dev ($ saving) vs Multi-AZ NAT Gateways for Prod (HA)
# ==============================================================================
locals {
  nat_gateway_count = var.enable_single_nat_gateway ? 1 : length(var.availability_zones)
}

resource "aws_eip" "nat" {
  count  = local.nat_gateway_count
  domain = "vpc"

  tags = merge(
    {
      Name        = "${var.environment}-nat-eip-${count.index + 1}"
      Environment = var.environment
      ManagedBy   = "Terraform"
    },
    var.tags
  )

  depends_on = [aws_internet_gateway.gw]
}

resource "aws_nat_gateway" "nat" {
  count         = local.nat_gateway_count
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id

  tags = merge(
    {
      Name        = "${var.environment}-nat-gw-${var.availability_zones[count.index]}"
      Environment = var.environment
      ManagedBy   = "Terraform"
    },
    var.tags
  )

  depends_on = [aws_internet_gateway.gw]
}

# ==============================================================================
# Public Route Table & Associations
# ==============================================================================
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  tags = merge(
    {
      Name        = "${var.environment}-public-rt"
      Environment = var.environment
      ManagedBy   = "Terraform"
    },
    var.tags
  )
}

resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# ==============================================================================
# Private App Route Tables & Associations (Outbound via NAT Gateway)
# ==============================================================================
resource "aws_route_table" "private" {
  count  = length(var.private_app_subnet_cidrs)
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = var.enable_single_nat_gateway ? aws_nat_gateway.nat[0].id : aws_nat_gateway.nat[count.index].id
  }

  tags = merge(
    {
      Name        = "${var.environment}-private-app-rt-${var.availability_zones[count.index]}"
      Environment = var.environment
      ManagedBy   = "Terraform"
    },
    var.tags
  )
}

resource "aws_route_table_association" "private_app" {
  count          = length(aws_subnet.private_app)
  subnet_id      = aws_subnet.private_app[count.index].id
  route_table_id = aws_route_table.private[count.index].id
}

# ==============================================================================
# Database Route Table & Associations (Isolated - No Internet/NAT Route)
# ==============================================================================
resource "aws_route_table" "database" {
  vpc_id = aws_vpc.main.id

  tags = merge(
    {
      Name        = "${var.environment}-isolated-db-rt"
      Environment = var.environment
      ManagedBy   = "Terraform"
    },
    var.tags
  )
}

resource "aws_route_table_association" "database" {
  count          = length(aws_subnet.database)
  subnet_id      = aws_subnet.database[count.index].id
  route_table_id = aws_route_table.database.id
}
