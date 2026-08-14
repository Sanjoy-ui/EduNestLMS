# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "${var.prefix}-cluster"

  setting {
    name  = "containerInsights"
    value = "disabled" # Keep disabled for AWS Free Tier savings
  }

  tags = merge(
    var.tags,
    {
      Name = "${var.prefix}-cluster"
    }
  )
}

# Security Group for EC2 Host Instance
# Security Model:
#   - INBOUND:  Only port 8080 from ALB SG (api-gateway). No SSH, no public internet access.
#   - OUTBOUND: All traffic allowed (for ECR image pulls via NAT Gateway, MongoDB Atlas, Cloudinary).
#   - No public IP + private subnet = zero direct internet reachability.
resource "aws_security_group" "ecs_ec2_sg" {
  name        = "${var.prefix}-ecs-ec2-sg"
  description = "Security group for ECS EC2 host instances - private subnet, ALB-only inbound"
  vpc_id      = var.vpc_id

  # Only the ALB is allowed to send traffic to the api-gateway container.
  # Backend (5000) and storage-service (5001) are internal only - api-gateway
  # reaches them via localhost (host network mode), not through the ALB.
  ingress {
    description     = "ALB to API Gateway container (port 8080 only)"
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [var.alb_security_group_id]
  }

  # Outbound: Allow all (NAT Gateway handles routing - no direct internet ingress possible)
  egress {
    description = "Allow all outbound traffic via NAT Gateway (ECR pulls, DB, APIs)"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(
    var.tags,
    {
      Name = "${var.prefix}-ecs-ec2-sg"
    }
  )
}

# EC2 Launch Template (t3.micro)
# Security: No public IP assigned - instance lives in private subnet and is
# only reachable from the ALB via the security group. Use AWS SSM Session Manager
# for shell access (no SSH key pairs or port 22 needed).
resource "aws_launch_template" "ecs_ec2" {
  name_prefix   = "${var.prefix}-ecs-ec2-"
  image_id      = var.ami_id # Amazon ECS-Optimized Amazon Linux 2 AMI
  instance_type = var.instance_type # t3.micro

  iam_instance_profile {
    name = var.ecs_instance_profile_name
  }

  network_interfaces {
    associate_public_ip_address = false # No public IP - private subnet only
    security_groups             = [aws_security_group.ecs_ec2_sg.id]
  }

  user_data = base64encode(<<-EOF
              #!/bin/bash
              echo "ECS_CLUSTER=${aws_ecs_cluster.main.name}" >> /etc/ecs/ecs.config
              EOF
  )

  tag_specifications {
    resource_type = "instance"
    tags = merge(
      var.tags,
      {
        Name = "${var.prefix}-ecs-instance"
      }
    )
  }
}

# Auto Scaling Group - placed in private subnets (no public IP, no direct internet access)
# Outbound traffic (ECR pulls, MongoDB, APIs) routes via the NAT Gateway.
resource "aws_autoscaling_group" "ecs_asg" {
  name_prefix         = "${var.prefix}-ecs-asg-"
  vpc_zone_identifier = var.private_subnet_ids # Private subnets - no internet exposure
  min_size            = 0
  max_size            = 1
  desired_capacity    = 1

  launch_template {
    id      = aws_launch_template.ecs_ec2.id
    version = "$Latest"
  }

  tag {
    key                 = "AmazonECSManaged"
    value               = ""
    propagate_at_launch = true
  }
}

# ECS Capacity Provider
resource "aws_ecs_capacity_provider" "cas" {
  name = "${var.prefix}-capacity-provider"

  auto_scaling_group_provider {
    auto_scaling_group_arn = aws_autoscaling_group.ecs_asg.arn
    managed_scaling {
      status                    = "ENABLED"
      target_capacity           = 100
      minimum_scaling_step_size = 1
      maximum_scaling_step_size = 1
    }
  }
}

resource "aws_ecs_cluster_capacity_providers" "main" {
  cluster_name       = aws_ecs_cluster.main.name
  capacity_providers = [aws_ecs_capacity_provider.cas.name]

  default_capacity_provider_strategy {
    capacity_provider = aws_ecs_capacity_provider.cas.name
    weight            = 1
  }
}
