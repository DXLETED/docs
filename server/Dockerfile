FROM node:14 as builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm i
COPY . .

CMD ["npm", "start"]