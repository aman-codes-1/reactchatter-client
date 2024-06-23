# Use the official Node.js image
FROM node:20-alpine as build

# Set working directory
WORKDIR /app

# Copy source code
COPY . .

# Copy the .env file
COPY .env .env

# Install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Optionally, you can use a tool like dotenv-cli to load the .env file into the environment during the build
RUN npm install -g dotenv-cli

# Load environment variables from the .env file and echo them for debugging purposes
RUN dotenv -e .env

# Build the app
RUN npm run build

# Use nginx as a lightweight HTTP server to serve the frontend build
FROM nginx:alpine

# Copy built files from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy the custom Nginx configuration file to the container
COPY nginx.conf /etc/nginx/nginx.conf

# Set environment variables
ARG PORT
ARG REACT_APP_SERVER_URI

ENV PORT=$PORT
ENV REACT_APP_SERVER_URI=$REACT_APP_SERVER_URI

# Copy the entry point script into the container
COPY nginxPop.sh /nginxPop.sh

# Make entry point script executable
RUN chmod +x /nginxPop.sh

# Expose $PORT
EXPOSE $PORT

# Set the entry point and default command
ENTRYPOINT ["/nginxPop.sh"]

# Run Nginx with daemon off
CMD ["nginx", "-g", "daemon off;"]