#!/bin/bash

FOLDERS=("frontend" "backend")

# Run this from home directory like so: 
# ./scripts/install.sh

for folder in "${FOLDERS[@]}"; do
  if [ -d "$folder" ]; then
    echo "Installing dependencies in $folder..."
    (cd "$folder" && yarn install)
  else
    echo "Directory $folder not found, skipping..."
  fi
done
