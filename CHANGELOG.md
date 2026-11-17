# Changelog

## [0.1.3](https://github.com/dallay/cli-template/compare/v0.1.2...v0.1.3) (2026-11-17)


### Bug Fixes

* resolve 13 SonarCloud issues ([#56](https://github.com/dallay/cli-template/issues/56)) ([b2d3dd1](https://github.com/dallay/cli-template/commit/b2d3dd15d0709c5302dc13f98c6820ac78672a84))

## [0.1.2](https://github.com/dallay/cli-template/compare/v0.1.1...v0.1.2) (2026-11-17)


### Bug Fixes

* **ci:** replace deprecated app-id with client-id in create-github-app-token ([#54](https://github.com/dallay/cli-template/issues/54)) ([aa50146](https://github.com/dallay/cli-template/commit/aa50146718e637a2a0563e393053e6496348cfbd))

## [0.1.1](https://github.com/dallay/cli-template/compare/v0.1.0...v0.1.1) (2026-11-17)


### Bug Fixes

* address critical review findings ([#52](https://github.com/dallay/cli-template/issues/52)) ([5dc96f9](https://github.com/dallay/cli-template/commit/5dc96f982f5c0de61c1e0301a0fc011d940ef32b))
* **ci:** create npm package directory before writing package.json ([#46](https://github.com/dallay/cli-template/issues/46)) ([623c12f](https://github.com/dallay/cli-template/commit/623c12ff8ced6865bec173c54c3d2e806cda1584))
* **ci:** use GitHub App token for release-please to trigger CI workflows ([#53](https://github.com/dallay/cli-template/issues/53)) ([a6eea20](https://github.com/dallay/cli-template/commit/a6eea2095ac11bddb1fcc54d81b3fdb20c9451e6))
* **deps:** replace deprecated waitDays with minimumReleaseAge in Renovate config ([#42](https://github.com/dallay/cli-template/issues/42)) ([5c48a20](https://github.com/dallay/cli-template/commit/5c48a20feae1d326c722880a3dcf4d5ca4fe6cda))
* **deps:** update npm dependencies to ^0.43.0 ([#47](https://github.com/dallay/cli-template/issues/47)) ([acbb493](https://github.com/dallay/cli-template/commit/acbb4933faa8e11c53f4d457721e8a4b3cbadc78))
* optimize Renovate configuration ([#51](https://github.com/dallay/cli-template/issues/51)) ([b08124a](https://github.com/dallay/cli-template/commit/b08124af6163f7973c48278bca3104333988f78f))

## 0.1.0 (2026-11-16)


### Features

* add .agents config with AgentSync, skills, and commands ([8ce6738](https://github.com/dallay/cli-template/commit/8ce673877905b4374a437600cdc6311cdbd721c1))
* add about section to issue templates ([971d729](https://github.com/dallay/cli-template/commit/971d7292a84242d2f4be09418893eacd4208bf74))
* add accessibility documentation ([fb90199](https://github.com/dallay/cli-template/commit/fb901997fcab2239ad3d211e4bcf521a107dacfd))
* add justfile as an alternative to Makefile ([#5](https://github.com/dallay/cli-template/issues/5)) ([4e88f48](https://github.com/dallay/cli-template/commit/4e88f488c49ea378772fac70e36d316aecc7b4e9))
* add Makefile and improve CLI with version subcommand ([#4](https://github.com/dallay/cli-template/issues/4)) ([73f584c](https://github.com/dallay/cli-template/commit/73f584c9d5a86234dada044c94d8400ab71852b5))
* initial commit - Rust CLI template with CI/CD, npm, and Docker distribution ([06a69ca](https://github.com/dallay/cli-template/commit/06a69caf71ed225944c65389e10cd8c8e4c9c93f))
* initialize versioning with release-please manifest and version file ([0734b7c](https://github.com/dallay/cli-template/commit/0734b7cf1444767d15cba86cc48b35edcfa5aa6b))


### Bug Fixes

* add contents:write permission to release-please job ([8cfcd3d](https://github.com/dallay/cli-template/commit/8cfcd3d1f862c247c4a837e545ff208ebe361935))
* add missing permissions to GitHub Actions workflows ([1099646](https://github.com/dallay/cli-template/commit/109964691502e490014f07b92c0b3f306c93351f))
* add pnpm lock file and move workflow permissions to job level ([6c163b3](https://github.com/dallay/cli-template/commit/6c163b3012c65e1609395aeaea2bc61b07cad877))
* add pull-requests:write permission to Semantic Pull Request workflow ([56a31ff](https://github.com/dallay/cli-template/commit/56a31ff83aed2da44b123db45c05f8ff0612c64e))
* correct GitHub Actions workflows and add Dependabot config ([9e8e0aa](https://github.com/dallay/cli-template/commit/9e8e0aa665121a0d1fd07890a6befe2f8adc8f50))
* critical npm wrapper, version sync, Docker, and CI issues ([450170c](https://github.com/dallay/cli-template/commit/450170c354fd79cb48722dba1dc4783dc950d015))
* fix failing GitHub Actions workflows ([7fe020c](https://github.com/dallay/cli-template/commit/7fe020cfa73bbf8d683689fceba7832307bb874d))
* fix failing GitHub Actions workflows ([019cfb4](https://github.com/dallay/cli-template/commit/019cfb4de3e6b8b91cdf0946304c9e3f84a93cad))
* repair failing workflows and Cargo.toml syntax ([1fd439f](https://github.com/dallay/cli-template/commit/1fd439fa0ab76e475fc7a30a423126a556ee42ce))
* repair failing workflows and Cargo.toml syntax ([27c9aa1](https://github.com/dallay/cli-template/commit/27c9aa1a6ce491736887878a05fe0226ecf63b74))
* repair failing workflows and replace template placeholders ([f7d6250](https://github.com/dallay/cli-template/commit/f7d6250963a8def6073056a778291bd7623dab29))
* replace all placeholders with actual values for CI to pass ([e6167dc](https://github.com/dallay/cli-template/commit/e6167dc41b96d5c118293e8216f27d327110b8e8))
* replace all placeholders with actual values for CI to pass ([6c03216](https://github.com/dallay/cli-template/commit/6c03216774061c3940d8ea95e80d91bf3184a10e))
* replace remaining placeholders in source files ([dad8be0](https://github.com/dallay/cli-template/commit/dad8be0f7b8a2c12dd885c846913217779f548a0))
* replace remaining placeholders in source files ([6b5dfcb](https://github.com/dallay/cli-template/commit/6b5dfcb8d815d0cbe2c2e16694e8c50f4581a796))
* reset version to 0.0.0 for first release-please PR ([77ae710](https://github.com/dallay/cli-template/commit/77ae710d595c02f883ac02e5f263e3c7ebac2a50))
* sync npm package.json version to 0.0.0 for first release ([3dc673d](https://github.com/dallay/cli-template/commit/3dc673de6ef33234902c309978103611783cd289))

## Changelog
