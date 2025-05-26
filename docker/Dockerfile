FROM node:lts-alpine3.21

WORKDIR /app
RUN apk update && apk add bash nano curl htop
COPY ../package*.json ./

RUN npm install
COPY . .
COPY ../example.env ./.env
RUN npm run build

FROM nginx:stable-alpine

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

RUN rm /app/docker/Dockerfile /app/docker/docker-compose.yml /app/.dockerignore
CMD ["nginx", "-g", "daemon off;"]
