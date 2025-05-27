FROM node:lts-alpine3.21 as builder

WORKDIR /app
RUN apk update && apk add bash nano curl htop
COPY ../package*.json ./

RUN npm install
COPY ../ ./
COPY ../example.env .env
RUN npm run build

FROM nginx:stable-alpine

COPY ../docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
