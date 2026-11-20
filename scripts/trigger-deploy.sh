#!/usr/bin/env bash
# Hands the artifact built on main to the dev deploy pipeline.
set -euo pipefail

version="$(buildkite-agent meta-data get artifact-version)"
digest="$(buildkite-agent meta-data get artifact-digest)"

buildkite-agent pipeline upload <<YAML
steps:
  - label: ":rocket: Deploy ${version} to dev"
    trigger: web-deploy-dev
    async: true
    build:
      commit: "${BUILDKITE_COMMIT}"
      branch: "${BUILDKITE_BRANCH}"
      message: "Deploy ${version}"
      env:
        ARTIFACT_VERSION: "${version}"
        ARTIFACT_DIGEST: "${digest}"
YAML
