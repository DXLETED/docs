## DOCS

### Установка

#### Production

> Указать URL базы данных в server/.env.production (не нужно, если локально)

```
docker-compose up --build
```

#### Development

> Установить NodeJS, Yarn, MongoDB

> [Для Windows] Добавить C:\Program Files\MongoDB\Server\4.4\bin в Path

```
mongod --dbpath data --port <port> --nojournal
```

1. /client

```
yarn
yarn dev
```

2. /server

> Указать URL базы данных и порт в .env.development

```
yarn
yarn dev
```