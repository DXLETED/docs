## DOCS

### Установка

#### Production

> Указать URL базы данных в server/.env.production (не нужно, если локально)

```
docker-compose up --build
```

#### Development

> Установить NodeJS, Yarn, MongoDB

1. /client

```
yarn
yarn dev
```

2. /server

> Указать URL базы данных в .env.development (не нужно, если локально)

```
yarn
yarn dev
```