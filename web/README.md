# Job Application Tracker – Web

Vite + React web frontend for the Job Application Tracker API.

## Running locally

```bash
cd web
npm install
npm run dev
```

By default the app points to `http://localhost:4000`. You can override the API base with an env var.

## Environment

Create `web/.env` (or set in your deployment):

```
VITE_API_BASE_URL=https://job-application-tracker-production-4656.up.railway.app
```

If `VITE_API_BASE_URL` is not set, the app falls back to `http://localhost:4000`.
