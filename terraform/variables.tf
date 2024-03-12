variable "billing_account" {
  description = "The ID of the billing account to associate projects with"
  type        = string
  default     = "012A34-B56C57-890DEF"
}

variable "billing_project" {
  description = "The ID of the billing project"
  type        = string
  default     = "billing-012345"
}

variable "organization_id" {
  description = "The organization id for the associated resources"
  type        = string
  default     = "123456789012"
}

variable "region_prefix" {
  description = "The region prefix identifier to be used when provisioning resources"
  type        = string
  default     = "europe-west"
}

variable "domain" {
  description = "The domain name that is used within the organisation"
  type        = string
  default     = "example.com"
}
