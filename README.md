## Description

A tiny [NestJS](https://nestjs.com/) service with the following features:

- [Prisma](https://www.prisma.io/) typesafe ORM.
- [MongoDB](https://www.mongodb.com/) document database.
- [Swagger](https://swagger.io/) API documentation.
- [Docker Compose](https://docs.docker.com/compose/) to run replica set instance of MongoDB.
- Basic [Continuous Integration](./.github/workflows/ci.yml).
- [Eslint](https://eslint.org/)/[Prettier](https://prettier.io/) setup.
- Pre-configured [GitHub Dependabot](https://docs.github.com/en/code-security/dependabot) for automated dependency updates.
- Uses fast Rust-based [SWC](https://swc.rs/) compiler.
- Unit tests.

## Docs

Once service is up and running, Swagger API documentation is available [here](http://localhost:3000/docs).

## Install

```bash
$ npm install
```

## Configure

1. Rename `.env-example` to `.env`.

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
