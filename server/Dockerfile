FROM node:14 as builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn
COPY . .

EXPOSE 3001

CMD ["yarn", "start"]