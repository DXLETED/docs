FROM node:14 as builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn build

FROM nginx:latest

COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]