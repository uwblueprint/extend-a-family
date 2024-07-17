#!/bin/bash
# Takes down active Docker containers and builds them again

docker compose down
if [[ $(docker ps -a -q) ]]; then
  docker rm -f $(docker ps -a -q) # delete running/stopped containers
fi
docker compose up --build
