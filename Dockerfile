FROM node:18-alpine as builder
RUN mkdir -p /home/node/app
WORKDIR /home/node/app
COPY . .
RUN npm i
RUN npm run build

FROM nginx:1.24-alpine as server
COPY --from=builder /home/node/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
#Containers run nginx with global directives and daemon off
EXPOSE 7000

ENTRYPOINT ["nginx", "-g", "daemon off;"]
