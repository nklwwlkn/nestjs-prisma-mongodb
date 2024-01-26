## Description

Tiny [NestJS](https://nestjs.com/) service with the following features:

- [Prisma](https://www.prisma.io/) typesafe ORM.
- [MongoDB](https://www.mongodb.com/) document database.
- [Swagger](https://swagger.io/) API documentation.
- Pre-configured [Docker Compose](https://docs.docker.com/compose/) to run replica set instance of MongoDB.
- Pre-configured basic [Continius Integration](./guthub/workflows/ci.yml).
- [Eslint](https://eslint.org/)/[Prettier](https://prettier.io/) setup.
- Unit tests.

## Docs

Once service is up and running, [Swagger](http://localhost:3000/docs) API documentation is available.

## Install

```bash
$ npm install
```

## Configure

1. Create a new `.env` file.
2. Copy `.env-example` content into `.env`.

## Run

```bash
# development
$ npm run start # Note: it also spins up a MongoDB replica set for you.

# watch mode
$ npm run start:dev # Note: it also spins up a MongoDB replica set for you.

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
