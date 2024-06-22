# Use the official Nginx image from Docker Hub
FROM nginx:latest

# Copy the custom Nginx configuration file to the container
COPY nginx.conf /etc/nginx/nginx.conf

# Set environment variables (assuming they start with RAILWAY_)
ARG REACT_APP_URI
ARG REACT_APP_SERVER_URI

ENV REACT_APP_URI=$REACT_APP_URI
ENV REACT_APP_SERVER_URI=$REACT_APP_SERVER_URI

# Copy the entry point script into the container
COPY nginxPop.sh /nginxPop.sh

# Make entry point script executable
RUN chmod +x /nginxPop.sh

# Expose port 8080
EXPOSE 8080

# Set the entry point and default command
ENTRYPOINT ["/nginxPop.sh"]

# Run Nginx with daemon off
CMD ["nginx", "-g", "daemon off;"]