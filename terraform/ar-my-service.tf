resource "google_artifact_registry_repository" "ar_my_service" {
  location      = "europe-west1"
  repository_id = "my-service"
  project       = module.host_project_artifacts.project_id
  description   = "Container image repository for my-service"
  format        = "DOCKER"

  docker_config {
    immutable_tags = true
  }
}
