FROM node:lts-alpine3.21 as builder

WORKDIR /app
RUN apk update && apk add bash nano curl htop
COPY ../package*.json ./

RUN npm install
COPY . .
COPY ./docker/.env.production ./.env
RUN npm run build

FROM nginx:stable-alpine

COPY ./docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

RUN chown nginx:nginx /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
