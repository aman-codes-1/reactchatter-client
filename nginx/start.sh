#!/bin/sh

# Replace placeholders with environment variables
envsubst '\$REACT_APP_SERVER_URI' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Start Nginx
nginx -g 'daemon off;'