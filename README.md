# Job & Internship Application Tracker

A small full-stack project to track job and internship applications.

* **Backend:** Node.js + Express + JWT authentication
* **Web frontend:** React (Vite) SPA
* **Mobile frontend:** React Native (Expo)
* **Storage:** Simple JSON file (`backend/data/db.json`) acting as a lightweight DB
* **Deployment:** Backend on Railway, (optionally) web app on Vercel

This project is meant to demonstrate end-to-end feature delivery: auth, CRUD, and a deployed API + UI.

---

## 🔗 Live URLs

### Backend API (Railway)

* Base URL:
  `https://job-application-tracker-production-4656.up.railway.app`
* Health check:
  `https://job-application-tracker-production-4656.up.railway.app/health`

### Web App (Vite React)

> If deployed (e.g. on Vercel), add the URL here, for example:
> `https://job-application-tracker-web.vercel.app`

---

## ✨ Features

* User registration & login (JWT-based auth)
* Per-user applications (each user sees only their own)
* Track:
  * Company
  * Role / Position
  * Status (Applied / Interview / Rejected / Offer)
  * Applied date
  * Deadline
  * Notes
* Web UI:
  * Login / Register
  * Applications list
  * Create / Edit / Delete application
  * Logout
* Mobile UI (Expo):
  * Login / Register
  * Applications list
  * Create application

---

## 🧱 Tech Stack

**Backend**

* Node.js
* Express
* JWT authentication
* `dotenv`
* File-based JSON DB (`backend/data/db.json`)

**Web Frontend**

* React (Vite)
* React Router
* Context API for auth
* Axios / fetch for API calls

**Mobile Frontend**

* React Native (Expo)
* React Navigation
* Uses the same REST API as the web app

**Deployment**

* Backend: Railway Node service
* (Optional) Web: Vercel Vite app

---

## 📂 Project Structure

```text
job-application-tracker/
├─ backend/     # Node/Express API + auth + JSON DB
├─ web/         # Vite React web app (login + applications UI)
├─ mobile/      # React Native (Expo) app
└─ README.md
```

---

## ⚙️ Backend (local)

### 1. Install & run

```bash
cd backend
npm install
```

Create a `.env` in `backend/`:

```env
PORT=4000
JWT_SECRET=your_jwt_secret_here
```

Run in dev mode:

```bash
npm run dev
# or
npm start
```

The API will be available at `http://localhost:4000`.

### 2. API Routes

* `POST /auth/register`
  * Body: `{ "email": string, "password": string }`
* `POST /auth/login`
  * Body: `{ "email": string, "password": string }`
  * Returns: `{ "token": string, "user": { "id", "email" } }`

Protected routes (require `Authorization: Bearer <token>`):

* `GET /applications`
* `POST /applications`
* `PUT /applications/:id`
* `DELETE /applications/:id`

Data is stored in `backend/data/db.json`:

```json
{
  "users": [],
  "applications": []
}
```

Deleting or editing this file will reset data.

---

## 🌐 Web App (Vite + React)

The web app lives in `web/` and talks to the same backend API.

### 1. API Base URL

The web client uses:

```js
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
```

* **Local dev:** no `.env` needed → defaults to `http://localhost:4000`
* **Production:** set `VITE_API_BASE_URL` (e.g. to the Railway URL)

Example `web/.env`:

```env
VITE_API_BASE_URL=https://job-application-tracker-production-4656.up.railway.app
```

### 2. Run locally

```bash
cd web
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### 3. Web Features

* Register / Login
* Applications list (per user)
* Create / Edit / Delete application
* Logout
* Auth state stored in Context + `localStorage`

---

## 📱 Mobile App (Expo)

The mobile app lives in `mobile/` and uses the same API.

### 1. API Base URL

The mobile app reads `EXPO_PUBLIC_API_BASE_URL`. If not set, it may default to `http://localhost:4000` for local backend.

Example `mobile/.env`:

```env
EXPO_PUBLIC_API_BASE_URL=https://job-application-tracker-production-4656.up.railway.app
```

### 2. Run locally

```bash
cd mobile
npm install
npm start
# then:
# - press "w" for web, OR
# - scan QR code with Expo Go on your phone
```

---

## ☁️ Deployment Overview

### Backend (Railway)

* Connected to this GitHub repo.
* Root directory set to `backend`.
* Build command: `npm install`
* Start command: `npm start`
* Environment variables:
  * `JWT_SECRET=your_jwt_secret`
  * `PORT=8080` (or whatever Railway is configured to use)

Public URL (example):

```text
https://job-application-tracker-production-4656.up.railway.app
```

### Web (Vercel – optional)

* Root directory: `web`
* Framework: Vite
* Build command: `npm run build`
* Output directory: `dist`
* Environment variables:
  * `VITE_API_BASE_URL=https://job-application-tracker-production-4656.up.railway.app`

Vercel then provides a public URL for the web UI.

---

## 📝 Notes

* This is a demo / portfolio project; security and error handling are intentionally kept simple.
* Passwords are stored as hashes in the JSON file, but this file is not a production-grade database.
* JWT tokens are stored client-side (localStorage for web, memory/Expo env for mobile); re-login is recommended after refresh in dev.

---

## 🚀 What This Demonstrates

* Designing and implementing a REST API with authentication
* Building multiple clients (web + mobile) against the same backend
* Managing auth state and protected routes on the frontend
* Deploying a Node.js API to Railway
* Preparing a Vite React app for deployment (e.g. Vercel) using env-based configuration

