# PicVault Backend

This is the backend API for PicVault, providing core services, database interactions, and secure file storage capabilities.

## Tech Stack

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express](https://expressjs.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **ORM / Database:** [Sequelize](https://sequelize.org/) with PostgreSQL (SQLite used for testing)
- **Object Storage:** [MinIO](https://min.io/) (S3 compatible)
- **Security:** Helmet, Express Rate Limit, CORS
- **Logging:** [Pino](https://getpino.io/)
- **Testing:** [Jest](https://jestjs.io/) & [Supertest](https://github.com/ladjs/supertest)

## Getting Started

### Prerequisites

Ensure you have the following installed and running locally or accessible remotely:

- [Node.js](https://nodejs.org/)
- PostgreSQL Server
- MinIO Server

### Installation

Navigate to the backend directory and install the dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root of the backend directory. You will need to configure variables for your Postgres database connection, MinIO credentials, and server port. _(Note: Do not commit the `.env` file to version control)._

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Starts the development server using `ts-node-dev` with automatic restarts upon file changes.

### `npm run build`

Compiles the TypeScript source code into JavaScript inside the `dist/` directory.

### `npm start`

Starts the production server using the compiled `dist/server.js` file. Make sure to run `npm run build` first.

### `npm test`

Runs the automated test suite using Jest in the test environment.

### `npm run test:ci`

Runs the test suite optimized for Continuous Integration environments, ensuring all open handles are detected and resolved.
