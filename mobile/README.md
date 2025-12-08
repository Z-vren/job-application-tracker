# Mobile App (Expo + React Navigation)

React Native (Expo) client for the Job & Internship Application Tracker. Uses React Navigation with auth and app stacks and a simple Context store for JWT/user state.

## Setup

```bash
cd mobile
npm install
```

> Note: Expo warns about Node 20.17.0. Recommended is 20.19.4+. You can keep 20.17.0 for now (warnings only) or upgrade Node to silence the warning.

## Configure API base URL

By default the app points to:
- iOS/Metro/web: `http://localhost:4000`
- Android emulator: `http://10.0.2.2:4000`

Override for a deployed backend with an env variable:

```
EXPO_PUBLIC_API_BASE_URL=https://your-backend-url.com
```

Create a `.env` in `mobile/` or set it in your shell before running `npm start`.

## Run

```bash
npm start          # start Metro + Expo
npm run android    # open Android emulator
npm run ios        # open iOS simulator (macOS only)
npm run web        # run in browser
```

## Screens & flows

- Auth stack: `Login`, `Register` (calls `/auth/login` and `/auth/register`; stores JWT in context)
- App stack:
  - `ApplicationsList` - fetches `/applications`, shows list, logout + add
  - `ApplicationDetail` - view single item, edit, delete
  - `ApplicationForm` - create or edit; fields: company, role, status, appliedDate, optional deadline/notes

## API helper

`src/api/client.ts` centralizes `API_BASE_URL` and helper functions: `login`, `register`, `getApplications`, `createApplication`, `updateApplication`, `deleteApplication`. All attach `Authorization: Bearer <token>` automatically when a token exists.
