#!/usr/bin/env bash

declare -r SCRIPT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"

function calculateContainerTag() {
  if [[ "${TRAVIS_BRANCH}" == 'master' ]]; then
      echo 'latest'
  elif [[ "${TRAVIS_BRANCH}" == 'develop' ]]; then
      echo 'develop'
  else
      echo "branch-${TRAVIS_BRANCH}"
  fi
}

function deploy() {
  local -r endpoint="${1}"
  local -r controlPhrase='Deploy:OK'

  echo -e '\n----- BEGIN Triggering docker pull -----\n'

  local res=$( \
      curl \
          -X POST "http://${DEPLOY_TRIGGER_URL}/${endpoint}" \
          -u "${DEPLOY_BASEAUTH_USER}:${DEPLOY_BASEAUTH_PASSWORD}" \
          --silent \
          -i
  )

  echo "${res}"

  echo -e '\n----- END Triggering docker pull -----\n'

  if [[ -z $(echo "${res}" | grep "${controlPhrase}") ]]; then
      echo 'Pulling finished with an error' >&2
      exit 1
  else
      echo 'Pulling completed successful'
  fi
}

function main() {
  local -r deployEndpoint="${1}"

  local -r imageName="${DOCKER_PRIVATE_REGISTRY}/${DOCKER_IMAGE}"
  local -r imageTag=$(calculateContainerTag)
  local -r imageFullId="${imageName}:${imageTag}"

  #
  # Build docker image
  #
  docker build -t "${imageFullId}" $(realpath "${SCRIPT_PATH}/../..")

  #
  # Pushing docker image to the registry
  #
  echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin "$DOCKER_PRIVATE_REGISTRY"
  docker push "${imageFullId}"

  #
  # Trigger pulling docker image on the server
  #
  deploy "${deployEndpoint}"
}

main "${1}"
