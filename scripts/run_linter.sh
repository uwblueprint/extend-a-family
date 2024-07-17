#!/bin/bash
# Runs the linter on the backend and frontend containers

docker exec -it eaf_backend /bin/bash -c "yarn run fix"
docker exec -it eaf_frontend /bin/bash -c "yarn run fix"
