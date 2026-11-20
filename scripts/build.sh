#!/usr/bin/env bash
set -euo pipefail

version="$(date -u +%Y.%m.%d)-${BUILDKITE_BUILD_NUMBER:-local}"
mkdir -p dist
tarball="dist/web-${version}.tgz"
tar -czf "$tarball" app package.json
digest="sha256:$(shasum -a 256 "$tarball" | cut -d' ' -f1)"

echo "Built web ${version} (${digest})"
if [[ -n "${BUILDKITE:-}" ]]; then
  buildkite-agent meta-data set artifact-version "$version"
  buildkite-agent meta-data set artifact-digest "$digest"
fi
