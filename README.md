# Real-Time Emergency Response System

A full-stack emergency response platform with manual SOS activation, live admin monitoring, Mongo-backed incident tracking, Socket.IO broadcasting, and an AI service that can detect fire or smoke from a webcam/video feed and raise incidents automatically.

## Architecture

- `frontend/`: React + Vite + Tailwind responsive dashboard for SOS activation, incident tracking, and live alert monitoring.
- `backend/`: Express + MongoDB + Socket.IO API server for incident creation, resolution, summaries, and Firebase push fan-out.
- `ai-service/`: FastAPI + OpenCV detector service that can use YOLO weights when provided or a heuristic fire/smoke fallback when no model is configured.
- `postman/`: Postman collection for quick API testing.

## Core Flows

1. A user clicks the SOS button in the frontend.
2. The frontend sends `POST /api/sos` to the backend with location and context.
3. The backend stores the incident in MongoDB, emits Socket.IO events, and attempts to push notifications through Firebase Cloud Messaging.
4. Admin users see the live incident feed update instantly and can resolve incidents.
5. The AI service monitors a webcam or video source and sends `POST /api/detect` to the backend when fire or smoke is detected.

## Local Setup

### 1. Backend

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run dev
```

Required environment values are documented in [`backend/.env.example`](backend/.env.example).

### 2. Frontend

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

### 3. AI Detection Service

```powershell
cd ai-service
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload --port 8001
```

## Deployment

### Frontend on Vercel

- Framework preset: `Vite`
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables:
  - `VITE_API_URL`
  - `VITE_SOCKET_URL`
  - Firebase `VITE_FIREBASE_*` keys

### Backend on Render or Railway

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Add MongoDB URI and Firebase service account values in environment variables.

### AI Service on Render / VM / Edge-capable host

The OpenCV detector needs access to a webcam or uploaded video stream, so local or VM deployment is the most practical option. If you provide YOLO weights through `AI_MODEL_PATH`, the service will switch to model-based inference automatically.

## Firebase Push Notifications

The frontend includes web push registration and the backend includes a device token registration endpoint. To enable full push delivery:

1. Create a Firebase project.
2. Add a Web App and copy the client SDK keys into `frontend/.env`.
3. Create a service account and place its JSON in `FIREBASE_SERVICE_ACCOUNT` as a minified JSON string in the backend environment.
4. Update `frontend/public/firebase-messaging-sw.js` with the same Firebase web config values.

If Firebase is not configured, the app still works with live in-app notifications over Socket.IO.

## Testing

- Postman collection: [`postman/Emergency Response System.postman_collection.json`](postman/Emergency%20Response%20System.postman_collection.json)
- Recommended smoke test sequence:
  1. `POST /api/sos`
  2. `GET /api/incidents`
  3. `PATCH /api/incidents/:id/resolve`
  4. `POST /api/detect`
  5. `POST /monitor/start` on the AI service

## Notes

- The AI service includes a heuristic fallback for fire/smoke-like visuals so the project remains runnable even without custom YOLO weights.
- Authentication is optional and not enabled in this first version, but the admin dashboard and API structure are ready for auth middleware to be added later.
