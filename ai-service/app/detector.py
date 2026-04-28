from __future__ import annotations

import time
from pathlib import Path
from typing import Any

import cv2
import numpy as np


class EmergencyDetector:
    def __init__(self, model_path: str | None = None, confidence_threshold: float = 0.4) -> None:
        self.model_path = model_path
        self.confidence_threshold = confidence_threshold
        self.yolo_model = None
        self.yolo_class_names: dict[int, str] = {}
        self._load_yolo_model()

    def _load_yolo_model(self) -> None:
        if not self.model_path:
            return

        path = Path(self.model_path)
        if not path.exists():
            return

        try:
            from ultralytics import YOLO  # type: ignore

            self.yolo_model = YOLO(str(path))
            names = getattr(self.yolo_model.model, "names", {}) or {}
            self.yolo_class_names = {int(index): str(label).lower() for index, label in names.items()}
        except Exception:
            self.yolo_model = None
            self.yolo_class_names = {}

    def analyze(self, frame: np.ndarray) -> list[dict[str, Any]]:
        if self.yolo_model is not None:
            detections = self._analyze_with_yolo(frame)
            if detections:
                return detections

        return self._analyze_with_heuristics(frame)

    def _analyze_with_yolo(self, frame: np.ndarray) -> list[dict[str, Any]]:
        results = self.yolo_model.predict(frame, verbose=False, conf=self.confidence_threshold)
        detections: list[dict[str, Any]] = []

        for result in results:
            boxes = getattr(result, "boxes", None)
            if boxes is None:
                continue

            for box in boxes:
                class_index = int(box.cls[0])
                label = self.yolo_class_names.get(class_index, "")
                if not any(keyword in label for keyword in ("fire", "smoke", "flame")):
                    continue

                confidence = float(box.conf[0])
                if confidence < self.confidence_threshold:
                    continue

                x1, y1, x2, y2 = [int(value) for value in box.xyxy[0].tolist()]
                category = "smoke" if "smoke" in label else "fire"

                detections.append(
                    {
                        "category": category,
                        "confidence": round(confidence, 3),
                        "bbox": [x1, y1, x2, y2],
                        "detectionMode": "yolo"
                    }
                )

        return detections

    def _analyze_with_heuristics(self, frame: np.ndarray) -> list[dict[str, Any]]:
        resized = cv2.resize(frame, (640, 360))
        hsv = cv2.cvtColor(resized, cv2.COLOR_BGR2HSV)

        fire_mask_1 = cv2.inRange(hsv, np.array([0, 120, 150]), np.array([25, 255, 255]))
        fire_mask_2 = cv2.inRange(hsv, np.array([160, 100, 150]), np.array([179, 255, 255]))
        fire_mask = cv2.bitwise_or(fire_mask_1, fire_mask_2)
        fire_ratio = cv2.countNonZero(fire_mask) / float(fire_mask.size)

        smoke_mask = cv2.inRange(hsv, np.array([0, 0, 50]), np.array([180, 50, 210]))
        smoke_ratio = cv2.countNonZero(smoke_mask) / float(smoke_mask.size)

        detections: list[dict[str, Any]] = []

        if fire_ratio > 0.035:
            detections.append(
                {
                    "category": "fire",
                    "confidence": round(min(0.99, fire_ratio * 8), 3),
                    "bbox": [0, 0, resized.shape[1], resized.shape[0]],
                    "detectionMode": "heuristic"
                }
            )

        if smoke_ratio > 0.12 and fire_ratio > 0.01:
            detections.append(
                {
                    "category": "smoke",
                    "confidence": round(min(0.92, smoke_ratio * 2), 3),
                    "bbox": [0, 0, resized.shape[1], resized.shape[0]],
                    "detectionMode": "heuristic"
                }
            )

        return detections


class DetectionMonitor:
    def __init__(
        self,
        detector: EmergencyDetector,
        backend_client,
        camera_index: int = 0,
        cooldown_seconds: int = 15,
    ) -> None:
        self.detector = detector
        self.backend_client = backend_client
        self.camera_index = camera_index
        self.cooldown_seconds = cooldown_seconds
        self.capture = None
        self.running = False
        self.last_alert_at = 0.0

    def start(self) -> None:
        self.capture = cv2.VideoCapture(self.camera_index)
        if self.capture is None or not self.capture.isOpened():
            self.running = False
            raise RuntimeError(f"Unable to access camera index {self.camera_index}.")
        self.running = True

    def stop(self) -> None:
        self.running = False
        if self.capture is not None:
            self.capture.release()
            self.capture = None

    def run_forever(self) -> None:
        try:
            self.start()

            while self.running and self.capture is not None:
                success, frame = self.capture.read()
                if not success:
                    time.sleep(0.25)
                    continue

                detections = self.detector.analyze(frame)
                if not detections:
                    time.sleep(0.15)
                    continue

                if time.time() - self.last_alert_at < self.cooldown_seconds:
                    time.sleep(0.15)
                    continue

                primary = max(detections, key=lambda item: item["confidence"])

                try:
                    self.backend_client.send_alert(primary)
                    self.last_alert_at = time.time()
                except Exception:
                    time.sleep(1)

                time.sleep(0.25)
        finally:
            self.stop()
