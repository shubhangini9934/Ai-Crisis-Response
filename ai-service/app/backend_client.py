from __future__ import annotations

from typing import Any

import requests


class BackendAlertClient:
    def __init__(self, backend_api_url: str) -> None:
        self.backend_api_url = backend_api_url

    def send_alert(self, detection: dict[str, Any]) -> dict[str, Any]:
        payload = {
            "category": detection["category"],
            "message": f"AI detection service flagged possible {detection['category']} in the monitored feed.",
            "severity": "critical" if detection["category"] == "fire" else "high",
            "confidence": detection["confidence"],
            "metadata": {
                "bbox": detection.get("bbox"),
                "detectionMode": detection.get("detectionMode", "unknown"),
            },
        }

        response = requests.post(self.backend_api_url, json=payload, timeout=10)
        response.raise_for_status()
        return response.json()

