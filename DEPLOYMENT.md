# Deployment Guide

This project deploys cleanly as three pieces:

1. `frontend` on Vercel
2. `backend` on Render
3. `ai-service` on Render

## Recommended Production Layout

- Frontend URL: `https://your-frontend.vercel.app`
- Backend URL: `https://your-backend.onrender.com`
- AI service URL: `https://your-ai-service.onrender.com`

The frontend talks to the backend over REST and Socket.IO. The AI service talks to the backend through `POST /api/detect`.

## 1. Deploy the Backend on Render

Create a new Render Blueprint or Web Service pointed at this repo.

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/health`

Set these environment variables:

- `PORT=4000`
- `CLIENT_URL=https://your-frontend.vercel.app`
- `SOCKET_CORS_ORIGIN=https://your-frontend.vercel.app`
- `MONGODB_URI=your-mongodb-connection-string`
- `FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}`

Notes:

- `FIREBASE_SERVICE_ACCOUNT` should be pasted as one minified JSON string.
- If Firebase is not ready yet, leave `FIREBASE_SERVICE_ACCOUNT` empty. The app will still work without push notifications.

## 2. Deploy the AI Service on Render

Create a second Render Web Service from the same repo.

- Root directory: `ai-service`
- Build command: `pip install -r requirements.txt`
- Start command: `python -c "import os; from uvicorn import run; run('app.main:app', host='0.0.0.0', port=int(os.getenv('PORT', os.getenv('AI_SERVICE_PORT', '8001'))))"`
- Health check path: `/health`

Set these environment variables:

- `PORT=8001`
- `AI_SERVICE_PORT=8001`
- `BACKEND_API_URL=https://your-backend.onrender.com/api/detect`
- `AI_SERVICE_CORS_ORIGINS=https://your-frontend.vercel.app`
- `ALERT_COOLDOWN_SECONDS=15`
- `CAMERA_INDEX=0`
- `AI_MODEL_PATH=` optional

Notes:

- The AI service now respects host-provided `PORT`, which is required on most managed platforms.
- If you want webcam monitoring, a VM or local machine is still the better fit than a serverless environment.

## 3. Deploy the Frontend on Vercel

Import the repo into Vercel and set:

- Framework preset: `Vite`
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`

Set these environment variables:

- `VITE_API_URL=https://your-backend.onrender.com/api`
- `VITE_SOCKET_URL=https://your-backend.onrender.com`
- `VITE_FIREBASE_API_KEY=...`
- `VITE_FIREBASE_AUTH_DOMAIN=...`
- `VITE_FIREBASE_PROJECT_ID=...`
- `VITE_FIREBASE_STORAGE_BUCKET=...`
- `VITE_FIREBASE_MESSAGING_SENDER_ID=...`
- `VITE_FIREBASE_APP_ID=...`
- `VITE_FIREBASE_VAPID_KEY=...`

## 4. Update Firebase Messaging Service Worker

Before enabling web push, replace the placeholders in:

- `frontend/public/firebase-messaging-sw.js`

Use the same Firebase web app config values that you put into the frontend environment.

## 5. Smoke Test After Deploy

1. Open the frontend and trigger an SOS incident.
2. Confirm `POST /api/sos` succeeds from the deployed frontend.
3. Confirm the incident appears in the live dashboard.
4. Confirm Socket.IO connects from the browser to the deployed backend.
5. Confirm `https://your-backend.onrender.com/health` returns `ok`.
6. Confirm `https://your-ai-service.onrender.com/health` returns `ok`.

## Files Added For Deployment

- `render.yaml`: Render blueprint for backend and AI service
- `ai-service/package.json`: production start script now supports injected `PORT`
