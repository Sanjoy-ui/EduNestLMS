output "alb_dns_name" {
  value       = aws_lb.main.dns_name
  description = "Application Load Balancer DNS Name"
}

output "alb_arn" {
  value       = aws_lb.main.arn
  description = "Application Load Balancer ARN"
}

output "alb_security_group_id" {
  value       = aws_security_group.alb_sg.id
  description = "ALB Security Group ID"
}

output "api_gateway_target_group_arn" {
  value       = aws_lb_target_group.api_gateway.arn
  description = "API Gateway Target Group ARN"
}
