# Backend API (Job Application Tracker)

A simple Node.js + Express API with JWT auth and a file-backed store for tracking job and internship applications.

## Requirements

- Node.js 18+
- npm

## Setup

```bash
cd backend
npm install
```

Create a `.env` file (or set environment variables):

```
PORT=4000
JWT_SECRET=super_secret_key_change_me
```

## Scripts

- `npm run start` – start the server
- `npm run dev` – start with nodemon for development

## Run locally

```bash
cd backend
npm run dev
# or
npm run start
```

API will default to `http://localhost:4000`.

## Routes

- `POST /auth/register` – register with email + password (min 6 chars), returns JWT and user
- `POST /auth/login` – login with email + password, returns JWT and user
- `GET /applications` – list current user's applications (requires `Authorization: Bearer <token>`)
- `POST /applications` – create an application (company, role, status, appliedDate required; deadline/notes optional)
- `PUT /applications/:id` – update an application belonging to the user
- `DELETE /applications/:id` – delete an application belonging to the user

Valid `status` values: `Applied`, `Interview`, `Rejected`, `Offer`.

## Notes

- Data is stored in `data/db.json` for simplicity. Delete the file to reset data.
- Make sure `JWT_SECRET` is set to a secure value in production.

