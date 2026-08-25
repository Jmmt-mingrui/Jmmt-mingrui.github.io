#!/usr/bin/env bash
set -euo pipefail

repo_root="${MINGRUI_BLOG_ROOT:-/home/ubuntu/minguri-blog}"
service_name="${MINGRUI_BLOG_SERVICE:-mingrui-blog.service}"
success_marker="${repo_root}/.deploy-last-success"
lock_directory="${repo_root}/.deploy.lock"

mkdir "${lock_directory}" 2>/dev/null || exit 0
trap 'rmdir "${lock_directory}"' EXIT

cd "${repo_root}"

if ! git diff --quiet || ! git diff --cached --quiet || [[ -n "$(git status --short --untracked-files=normal)" ]]; then
  echo "Deployment stopped: the VPS checkout is not clean." >&2
  exit 1
fi

git fetch --prune origin main
target_commit="$(git rev-parse origin/main)"
last_success=""
if [[ -f "${success_marker}" ]]; then
  last_success="$(<"${success_marker}")"
fi

if [[ "${target_commit}" == "${last_success}" ]]; then
  exit 0
fi

git merge --ff-only "${target_commit}"

if [[ ! -d node_modules ]] || [[ -z "${last_success}" ]] || ! git diff --quiet "${last_success}" "${target_commit}" -- package-lock.json package.json; then
  npm ci --no-audit --no-fund
fi

npm run content:check
npm run build
node --test tests/*.test.mjs
sudo systemctl restart "${service_name}"

printf '%s\n' "${target_commit}" > "${success_marker}"
echo "Deployed ${target_commit}."
