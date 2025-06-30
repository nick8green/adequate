#!/usr/bin/env bash
set -euo pipefail

app="$1"
version_input="${2:-}"
branch="${3:-unknown}"

# Utilities
sanitize_version() {
  echo "$1" | tr '/' '-' | tr -c 'a-zA-Z0-9_.-' '-' | sed -E 's/-+/-/g; s/^-+//; s/-+$//'
}

generate_ref() {
  echo "$1" | tr '[:lower:]' '[:upper:]'
}

# Core logic
version="${version_input:-$branch}"
version=$(sanitize_version "$version")
ref=$(generate_ref "$app")

port_var="APP_PORT_${ref}"
options_var="APP_OPTIONS_${ref}"

# Use environment for secret injection
port="${!port_var:-0}"
options="${!options_var:-}"

# Output matrix entry JSON
echo "{\"app\": \"$app\", \"options\": \"$options\", \"port\": \"$port\", \"version\": \"$version\"}"
