## Description

This repository provides two APIs: the Transactions API and the Aggregator API.

The Transactions API uses PostgreSQL for enhanced ACID compliance and flexibility. The Aggregator API leverages MongoDB for scalability and efficient database-side aggregations, enabling the application to handle millions of requests efficiently.

Synchronization between the Transactions API and the Aggregator API is managed by the `SyncService`, which runs as a cron job four times per minute with a limit of 1000 transactions per job. The synchronization process fetches data based on the `createdAt` timestamp. Each job retrieves the latest available `createdAt` data from MongoDB. The sync job also overwrites existing transactions, preventing duplicates and allowing data to be re-fetched if necessary.

This repository includes unit tests and end-to-end (e2e) tests. Additionally, GitHub Actions are implemented for running unit and e2e tests for both APIs and their respective databases.

In the future, if MongoDB's performance is insufficient, it is possible to switch to ClickHouse for faster query execution.

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

## Available API

### Transactions API

**Base URL:** `/transactions`

- **GET /transactions**
  - Description: Retrieve a list of transactions with optional filters for `startDate`, `endDate`, and `type`.
  - Query Parameters:
    - `startDate` (optional): Filter transactions created after this date.
    - `endDate` (optional): Filter transactions created before this date.
    - `type` (optional): Filter transactions by type (e.g., `payout`, `spent`, `earned`).
    - `page` (optional): Pagination page number (default: 1).
    - `limit` (optional): Number of items per page (default: 10).
  - Example: http://localhost:3000/transactions?startDate=2023-05-13T06:45:44.268Z&limit=1000
### Aggregator API

**Base URL:** `/aggregator`

- **GET /aggregator/payouts**

  - Description: Retrieve a summary of requested payouts grouped by user.
  - Example: http://localhost:3000/aggregator/payouts
- **GET /aggregator/:userId**
  - Description: Retrieve aggregated transaction data for a specific user.
  - Path Parameters:
    - `userId` (string): The ID of the user.
  - Example: http://localhost:3000/aggregator/00005
