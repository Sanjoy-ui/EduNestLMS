output "cluster_id" {
  value       = aws_ecs_cluster.main.id
  description = "ECS Cluster ID"
}

output "cluster_name" {
  value       = aws_ecs_cluster.main.name
  description = "ECS Cluster Name"
}

output "ecs_ec2_sg_id" {
  value       = aws_security_group.ecs_ec2_sg.id
  description = "ECS EC2 Host Security Group ID"
}

output "asg_name" {
  value       = aws_autoscaling_group.ecs_asg.name
  description = "Auto Scaling Group Name"
}
