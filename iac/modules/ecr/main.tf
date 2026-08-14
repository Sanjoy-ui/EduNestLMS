resource "aws_ecr_repository" "services" {
  for_each             = toset(var.repository_names)
  name                 = "${var.prefix}-${each.value}"
  image_tag_mutability = "MUTABLE"
  force_delete         = true # Required for terraform destroy to wipe repos containing images

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = merge(
    var.tags,
    {
      Name = "${var.prefix}-${each.value}"
    }
  )
}

resource "aws_ecr_lifecycle_policy" "services_policy" {
  for_each   = toset(var.repository_names)
  repository = aws_ecr_repository.services[each.value].name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep last 5 tagged images"
        selection = {
          tagStatus     = "tagged"
          tagPrefixList = ["sha-", "v"]
          countType     = "sinceImagePushed"
          countUnit     = "days"
          countNumber   = 14
        }
        action = {
          type = "expire"
        }
      },
      {
        rulePriority = 2
        description  = "Expire untagged images older than 3 days"
        selection = {
          tagStatus   = "untagged"
          countType   = "sinceImagePushed"
          countUnit   = "days"
          countNumber = 3
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}
