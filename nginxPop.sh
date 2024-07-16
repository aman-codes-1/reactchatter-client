#!/bin/bash

# Define the file where the environment variables will be stored
ENV_VARS_FILE="/etc/nginx/env-vars.conf"

# Create or empty the file
> $ENV_VARS_FILE

# List of environment variables to load into Nginx
ENV_VARS=("PORT" "REACT_APP_PROXY_URI" "REACT_APP_SERVER_URI" "REACT_APP_PROXY_DOMAIN")

# Loop through each environment variable and add it to the file
for VAR in "${ENV_VARS[@]}"
do
  if [ ! -z "${!VAR}" ]; then
    echo "env $VAR='${!VAR}';" >> $ENV_VARS_FILE
  fi
done
