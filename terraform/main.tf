locals {
  environments = {
	"production": {
		"cidr": "10.10.0.0/16",
		"teams": [
			"operations"
		]
	},
	"non-production": {
		"cidr": "10.20.0.0/16",
		"teams": [
			"development",
			"operations"
		]
	}
}

  groups = flatten([
    for environment, configuration in local.environments : [
      for team in configuration.teams : {
        environment = "${environment}"
        team        = "${team}"
      }
    ]
  ])

  teams = toset(flatten([
    for environment, configuration in local.environments : [
      for team in configuration.teams : team
    ]
  ]))
}
