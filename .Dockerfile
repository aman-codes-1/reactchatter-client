# Stage 1: Build React app
FROM node:16 as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . ./

RUN npm run build

# Stage 2: Serve app with Nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf.template
COPY nginx/start.sh /start.sh

EXPOSE 80

CMD ["/start.sh"]