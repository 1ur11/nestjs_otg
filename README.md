## Description

API

## Project Setup

### Required: Node.js v22

### Required: Docker and Docker Compose Installed

Refer to the [Docker documentation](https://docs.docker.com/get-started/get-docker/) to install Docker and Docker Compose.

### Configure the `.env` File

Copy `.env.example` to `.env` and edit the variables as needed.

### Install Dependencies

```bash
$ npm install
```

## Compile and Run the Project

```bash
# Start the local database
$ docker-compose up -d

# Seed demo transactions
$ npm run db:seed

# Development mode
$ npm run start

# Watch mode
$ npm run start:dev

# Production mode
$ npm run start:prod
```

## Run Tests

```bash
# Unit tests
$ npm run test

# End-to-end (e2e) tests
$ npm run test:e2e

# Test coverage
$ npm run test:cov
```
