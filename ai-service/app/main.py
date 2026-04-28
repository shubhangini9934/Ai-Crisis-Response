from __future__ import annotations

import os
from threading import Thread
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .backend_client import BackendAlertClient
from .detector import DetectionMonitor, EmergencyDetector

load_dotenv()

app = FastAPI(title="Emergency AI Detection Service", version="1.0.0")

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "AI_SERVICE_CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

backend_client = BackendAlertClient(
    os.getenv("BACKEND_API_URL", "http://localhost:4000/api/detect")
)
detector = EmergencyDetector(model_path=os.getenv("AI_MODEL_PATH") or None)
monitor = DetectionMonitor(
    detector=detector,
    backend_client=backend_client,
    camera_index=int(os.getenv("CAMERA_INDEX", "0")),
    cooldown_seconds=int(os.getenv("ALERT_COOLDOWN_SECONDS", "15")),
)
monitor_thread: Thread | None = None


class MonitorStartPayload(BaseModel):
    camera_index: int | None = None
    cooldown_seconds: int | None = None


class DetectionPayload(BaseModel):
    category: str
    confidence: float
    detectionMode: str = "manual-test"
    bbox: list[int] | None = None


def _ensure_monitor_thread() -> Thread:
    global monitor_thread

    if monitor_thread is not None and monitor_thread.is_alive():
        return monitor_thread

    monitor_thread = Thread(target=monitor.run_forever, daemon=True)
    monitor_thread.start()
    return monitor_thread


@app.get("/health")
def health() -> dict[str, Any]:
    return {
        "status": "ok",
        "service": "emergency-ai-detector",
        "running": monitor.running,
        "backendApiUrl": backend_client.backend_api_url,
    }


@app.get("/monitor/status")
def monitor_status() -> dict[str, Any]:
    return {
        "running": monitor.running,
        "cameraIndex": monitor.camera_index,
        "cooldownSeconds": monitor.cooldown_seconds,
    }


@app.post("/monitor/start")
def start_monitoring(payload: MonitorStartPayload) -> dict[str, Any]:
    if payload.camera_index is not None:
        monitor.camera_index = payload.camera_index

    if payload.cooldown_seconds is not None:
        monitor.cooldown_seconds = payload.cooldown_seconds

    if monitor.running:
        return {"message": "Monitoring already active.", "running": True}

    _ensure_monitor_thread()

    return {
        "message": "Monitoring start requested.",
        "running": True,
        "cameraIndex": monitor.camera_index,
        "cooldownSeconds": monitor.cooldown_seconds,
    }


@app.post("/monitor/stop")
def stop_monitoring() -> dict[str, Any]:
    monitor.stop()
    return {"message": "Monitoring stopped.", "running": False}


@app.post("/detect")
def send_test_detection(payload: DetectionPayload) -> dict[str, Any]:
    try:
        return backend_client.send_alert(payload.model_dump())
    except Exception as error:
        raise HTTPException(status_code=502, detail=str(error)) from error
