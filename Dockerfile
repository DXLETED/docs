FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build

EXPOSE 8081

CMD ["npm", "start"]