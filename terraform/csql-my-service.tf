module "csql_my_service" {
  source  = "googlecloudplatform/sql-db/google//modules/postgresql"
  version = "17.1.0"

  name                 = "sandbox-my-service"
  database_version     = "POSTGRES_15"
  project_id           = "${module.service_project_teams["sandbox-development"].project_id}"
  zone                 = "europe-west2-a"
  region               = "europe-west2"
  tier                 = "db-custom-2-3840"

  db_name      = "my-service"
  db_charset   = "UTF8"
  db_collation = "en_US.UTF8"

  disk_size = "10"
  disk_type = "PD_SSD"

  availability_type = "ZONAL"

  deletion_protection = "true"

  database_flags       = []
  additional_databases = []
  additional_users     = []
  iam_users            = []

  ip_configuration = {
    ipv4_enabled    = false
  }
}

output "name" {
  value = module.csql_my_service.instance_name
}

output "user_name" {
  value = module.csql_my_service.user_name
}

output "generated_user_password" {
  sensitive = true
  value     = module.csql_my_service.generated_user_password
}

output "replicas" {
  sensitive = true
  value     = module.csql_my_service.replicas
}

output "instances" {
  sensitive = true
  value     = module.csql_my_service.instances
}