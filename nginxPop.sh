#!/bin/sh

# Export environment variables to make them available to envsubst
export PORT="$PORT"
export REACT_APP_PROXY_URI="$REACT_APP_PROXY_URI"
export REACT_APP_SERVER_URI="$REACT_APP_SERVER_URI"
export REACT_APP_PROXY_DOMAIN="$REACT_APP_PROXY_DOMAIN"

# Use envsubst to replace variables directly in default.conf and create a temporary file
envsubst '$PORT $REACT_APP_PROXY_URI $REACT_APP_SERVER_URI $REACT_APP_PROXY_DOMAIN' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.tmp

# Move the temporary file to replace the original default.conf
mv /etc/nginx/conf.d/default.conf.tmp /etc/nginx/conf.d/default.conf

# Start Nginx with the provided command line arguments
exec "$@"