# Use the official Node.js runtime as the base image
FROM node:20-alpine as build

# Set environment variables
ARG PORT
ARG NODE_ENV
ARG REACT_APP_PROXY_URI
ARG REACT_APP_SERVER_URI
ARG REACT_APP_PROXY_DOMAIN
ARG REACT_APP_GOOGLE_CLIENT_ID

ENV PORT=$PORT
ENV NODE_ENV=$NODE_ENV
ENV REACT_APP_PROXY_URI=$REACT_APP_PROXY_URI
ENV REACT_APP_SERVER_URI=$REACT_APP_SERVER_URI
ENV REACT_APP_PROXY_DOMAIN=$REACT_APP_PROXY_DOMAIN
ENV REACT_APP_GOOGLE_CLIENT_ID=$REACT_APP_GOOGLE_CLIENT_ID

RUN echo "$PORT"
RUN echo "$NODE_ENV"
RUN echo "$REACT_APP_PROXY_URI"
RUN echo "$REACT_APP_SERVER_URI"
RUN echo "$REACT_APP_PROXY_DOMAIN"
RUN echo "$REACT_APP_GOOGLE_CLIENT_ID"

# Set the working directory in the container and copy files
WORKDIR /reactchatter
COPY package*.json ./
RUN npm install
COPY . .

# Build the app
RUN npm run build

# Use Nginx as the production server
FROM nginx:alpine

# Copy the custom Nginx configuration file to the container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the entry point script into the container
COPY nginxPop.sh /nginxPop.sh

# Make entry point script executable
RUN chmod +x /nginxPop.sh

# Copy built files from the build stage
COPY --from=build /reactchatter/build /usr/share/nginx/html

# Expose $PORT
EXPOSE $PORT

# Set the entry point and default command
ENTRYPOINT ["/nginxPop.sh"]

# Run Nginx with daemon off
CMD ["nginx", "-g", "daemon off;"]