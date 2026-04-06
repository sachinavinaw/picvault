# PicVault

PicVault is a full-stack image upload and gallery application built with:

- **Backend:** Express + TypeScript
- **Storage:** MinIO object storage
- **Database:** PostgreSQL
- **Frontend:** React + Vite + TypeScript
- **Validation:** Multer upload validation, file type and size checks

## Features

- Upload multiple images via `multipart/form-data`
- Accepts only image MIME types
- Enforces a max of 20 files per upload
- Enforces a max file size of 50MB per image
- Stores image metadata in PostgreSQL
- Serves uploaded images through a backend proxy route
- Simple React gallery UI for browsing uploads

## Architecture

- `backend/`
  - `src/app.ts` — Express app and middleware setup
  - `src/server.ts` — backend startup, database sync, MinIO bucket ensure
  - `src/routes/images.routes.ts` — upload, list, and serve image endpoints
  - `src/middleware/validation.ts` — request validation for upload payloads
  - `src/services/storage.service.ts` — MinIO upload and public URL helpers
  - `src/models/image.model.ts` — Sequelize image metadata model
  - `src/config/` — environment, DB, and MinIO configuration
- `frontend/`
  - Vite-powered React app
  - `src/api/images.ts` — image upload and fetch API helpers
  - `src/components/` — upload form, gallery display, upload item UI

## Prerequisites

- Node.js 18+ / 20+
- npm 10+
- Docker & Docker Compose (recommended for local infrastructure)

## Local Setup with Docker Compose

From the repository root:

```bash
docker compose up --build
```

This starts:

- `minio` on port `9000` (object storage)
- `minio` console on port `9001`
- `db` Postgres on port `5432`
- `backend` API on port `4000`
- `frontend` app on port `3000`

### Access

- Frontend UI: `http://localhost:3000`
- Backend API: `http://localhost:4000/api`
- MinIO Console: `http://localhost:9001`

## Backend

### Install dependencies

```bash
cd backend
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Start

```bash
npm start
```

### Tests

```bash
npm test
```

## Frontend

### Install dependencies

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Tests

```bash
npm test
```

## Environment Variables

The Docker Compose setup already provides defaults, but if you run services manually you can use these variables:

### Backend

- `NODE_ENV`
- `PORT` (default `4000`)
- `FRONTEND_ORIGIN`
- `MINIO_ENDPOINT` (default `minio`)
- `MINIO_PORT` (default `9000`)
- `MINIO_ACCESS_KEY`
- `MINIO_SECRET_KEY`
- `MINIO_BUCKET`
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

### Frontend

- `VITE_API_BASE_URL` (default `http://localhost:4000/api`)

## API Endpoints

### `POST /api/images`

Upload one or more images with `multipart/form-data` under the `files` field.

Validation rules:

- `multipart/form-data` required
- Only `image/*` MIME types accepted
- Maximum 20 files
- Maximum 50MB per file

### `GET /api/images`

Returns stored image metadata.

### `GET /api/images/file/:objectKey`

Serves the image file streamed from MinIO.

## Notes

- The backend automatically creates the MinIO bucket if it does not exist.
- Uploaded images are stored in MinIO and metadata is persisted in PostgreSQL.
- The frontend uses a proxy-style route for image access instead of directly exposing MinIO URLs.

## Useful commands

```bash
# Start backend only
cd backend && npm run dev

# Start frontend only
cd frontend && npm run dev

# Run backend tests
cd backend && npm test

# Run frontend tests
cd frontend && npm test
```

---
