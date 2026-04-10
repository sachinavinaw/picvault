# PicVault Backend

This is the backend API for PicVault, providing core services, database interactions, and secure file storage capabilities.

## Features

- **Image Upload:** Secure multipart file uploads with size, quantity (max 20), and format validation.
- **Cloud Storage:** S3-compatible object storage integration using MinIO.
- **Rate Limiting:** IP-based request throttling to prevent abuse and DDoS attempts.
- **Error Handling:** Centralized exception handling with custom HTTP error types.
- **Automated Testing:** Extensive E2E API testing using Jest and Supertest.

## Tech Stack

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express](https://expressjs.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **ORM / Database:** [Sequelize](https://sequelize.org/) with PostgreSQL (SQLite used for testing)
- **Object Storage:** [MinIO](https://min.io/) (S3 compatible)
- **Security:** Helmet, Express Rate Limit, CORS
- **Logging:** [Pino](https://getpino.io/)
- **Testing:** [Jest](https://jestjs.io/) & [Supertest](https://github.com/ladjs/supertest)

## Project Structure

- **`src/config/`** - External service and environment setups (e.g., MinIO client).
- **`src/controllers/`** - Route handlers processing requests and returning responses.
- **`src/exceptions/`** - Custom HTTP error classes (e.g., `BadRequestException`).
- **`src/middleware/`** - Express middleware for validation, rate limiting, and error catching.
- **`src/models/`** - Sequelize database models and schemas.
- **`src/routes/`** - Express router definitions.
- **`src/services/`** - Core business logic and external integrations.
- **`tests/`** - End-to-end (E2E) and unit tests.

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

## API Endpoints

- **`GET /api/images`**: Retrieve a list of all uploaded images, sorted by newest first.
- **`POST /api/images`**: Upload new images. Accepts `multipart/form-data` with a `files` field.
  - Allows up to 20 images per request.
  - Maximum file size is 50MB per image.
  - Only `image/*` MIME types are allowed.
- **`GET /api/images/file/:objectKey`**: Retrieve and serve the actual image file directly from the MinIO bucket.

_Note: All API endpoints are protected by a global rate limiter that permits a maximum of 200 requests per 15-minute window per IP address._

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
