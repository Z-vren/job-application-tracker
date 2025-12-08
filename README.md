# Job & Internship Application Tracker

Full-stack demo for tracking job/internship applications. Backend is Node.js + Express with JWT auth; frontend is an Expo (React Native) app using React Navigation. Data is stored in a simple JSON file for quick setup.

## Tech stack
- Backend: Node.js, Express, JWT, bcrypt, file-backed store
- Mobile: Expo (React Native), React Navigation, Context API

## Folder structure
- `backend/` – API (Express + JWT + file store)
- `mobile/` – Expo app (auth + applications screens)

## Backend (local)
```bash
cd backend
npm install
echo "PORT=4000" > .env
echo "JWT_SECRET=replace_me" >> .env
npm run dev   # or npm start
```
API lives at `http://localhost:4000` by default. Routes:
- `POST /auth/register`, `POST /auth/login`
- `GET /applications`
- `POST /applications`
- `PUT /applications/:id`
- `DELETE /applications/:id`

## Mobile (local)
```bash
cd mobile
npm install
npm start
# or npm run android / ios / web
```
API base URL:
- iOS/Metro/web default: `http://localhost:4000`
- Android emulator default: `http://10.0.2.2:4000`
Override for a deployed backend:
```
EXPO_PUBLIC_API_BASE_URL=https://your-backend-url.com
```
Create a `.env` in `mobile/` or export before `npm start`.

## Deploying the backend (Render example)
1) Push this repo to GitHub.  
2) On Render: **New Web Service** → connect repo.  
3) Build command: `cd backend && npm install`  
4) Start command: `cd backend && npm start`  
5) Environment variables: set `JWT_SECRET` (required). `PORT` will be provided by Render (the app already reads `process.env.PORT`).  
6) Deploy. Note the live URL, e.g., `https://your-service.onrender.com`.
7) In the mobile app, set `EXPO_PUBLIC_API_BASE_URL` to that URL and restart the app.

## Notes
- Data persists in `backend/data/db.json`; delete it to reset.
- JWT tokens are stored in memory (Context) on the client for simplicity; re-login after reload.
- Expo may warn about Node 20.17.0; recommended is Node 20.19.4+.

