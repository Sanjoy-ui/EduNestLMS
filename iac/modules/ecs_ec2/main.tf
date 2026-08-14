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
resource "aws_security_group" "ecs_ec2_sg" {
  name        = "${var.prefix}-ecs-ec2-sg"
  description = "Security group for ECS EC2 host instances"
  vpc_id      = var.vpc_id

  ingress {
    description     = "Allow HTTP traffic from ALB to API Gateway container"
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [var.alb_security_group_id]
  }

  ingress {
    description     = "Allow backend service communication from ALB"
    from_port       = 5000
    to_port         = 5001
    protocol        = "tcp"
    security_groups = [var.alb_security_group_id]
  }

  egress {
    description = "Allow all outbound traffic"
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

# EC2 Launch Template (t3.micro Free Tier)
resource "aws_launch_template" "ecs_ec2" {
  name_prefix   = "${var.prefix}-ecs-ec2-"
  image_id      = var.ami_id # Amazon Linux 2 ECS-Optimized AMI
  instance_type = var.instance_type # t3.micro (Free Tier)

  iam_instance_profile {
    name = var.ecs_instance_profile_name
  }

  network_interfaces {
    associate_public_ip_address = true
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

# Auto Scaling Group for t3.micro EC2 Instance
resource "aws_autoscaling_group" "ecs_asg" {
  name_prefix         = "${var.prefix}-ecs-asg-"
  vpc_zone_identifier = var.public_subnet_ids
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
