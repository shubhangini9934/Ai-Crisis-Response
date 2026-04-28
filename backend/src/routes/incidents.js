import { Router } from "express";
import {
  createDetection,
  createSOS,
  getIncidents,
  getSummary,
  registerDeviceToken,
  resolveIncident
} from "../controllers/incidentController.js";

const router = Router();

router.post("/sos", createSOS);
router.post("/detect", createDetection);
router.get("/incidents", getIncidents);
router.get("/incidents/summary", getSummary);
router.patch("/incidents/:id/resolve", resolveIncident);
router.post("/notifications/register", registerDeviceToken);

export default router;

