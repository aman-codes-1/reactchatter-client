#!/bin/sh

# Replace placeholders with environment variables
envsubst '\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Start Nginx
nginx -g 'daemon off;'