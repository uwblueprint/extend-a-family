#!/bin/bash
# Runs backend script for syncing MongoDB and Firebase users in the backend container

docker exec -it eaf_backend /bin/bash -c "yarn run sync-user-dbs"
