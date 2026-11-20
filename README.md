# merge-queue-testing

An example web app used to test release workflows on Buildkite. It builds, tests and
deploys to a simulated container platform. Nothing here is real infrastructure.

- `app/`: the web app and its tests
- `scripts/build.sh`: packages the app as a versioned, content-addressed artifact
- `scripts/deploy.mjs`: makes sure the environment's services exist, then sets their desired version
- `.buildkite/`: CI (pull requests, merge queue, main) and one deploy pipeline per environment

## Pipelines

| Pipeline | File | Runs |
| --- | --- | --- |
| `web-ci` | `.buildkite/pipeline.yml` | Tests every PR and merge-queue group. On `main`, builds the artifact and triggers dev |
| `web-deploy-dev` | `.buildkite/deploy-dev.yml` | Deploys to dev, then triggers stg |
| `web-deploy-stg` | `.buildkite/deploy-stg.yml` | Deploys to stg, then waits for approval to promote to prd |
| `web-deploy-prd` | `.buildkite/deploy-prd.yml` | Deploys to prd, one region at a time |

Each deploy build takes `ARTIFACT_VERSION` and `ARTIFACT_DIGEST`. To roll back, start a new
build of the environment's deploy pipeline with an earlier version in those variables.
