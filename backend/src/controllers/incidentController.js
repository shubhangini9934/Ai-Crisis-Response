import Incident from "../models/Incident.js";
import buildIncidentSummary from "../utils/incidentSummary.js";
import { emitSocketEvent } from "../services/socketService.js";
import { registerToken, sendIncidentNotification } from "../services/firebaseService.js";

const broadcastSummary = async () => {
  const summary = await buildIncidentSummary();
  emitSocketEvent("incident:summary", summary);
  return summary;
};

const persistAndBroadcast = async (payload) => {
  const incident = await Incident.create(payload);

  emitSocketEvent("incident:new", incident);
  await broadcastSummary();
  await sendIncidentNotification(incident);

  return incident;
};

export const createSOS = async (request, response, next) => {
  try {
    const { message, reporterName, location, severity } = request.body;

    const incident = await persistAndBroadcast({
      type: "manual_sos",
      category: "sos",
      source: "manual",
      reporterName: reporterName || "Anonymous user",
      message: message || "Manual SOS alert triggered from the emergency dashboard.",
      severity: severity || "critical",
      location
    });

    response.status(201).json(incident);
  } catch (error) {
    next(error);
  }
};

export const createDetection = async (request, response, next) => {
  try {
    const { category, message, severity, confidence, location, metadata } = request.body;

    const incident = await persistAndBroadcast({
      type: "ai_detected",
      category: category || "fire",
      source: "ai",
      reporterName: "AI Detection Service",
      message: message || "Potential emergency detected by computer vision service.",
      severity: severity || "high",
      location,
      metadata: {
        ...metadata,
        confidence
      }
    });

    response.status(201).json(incident);
  } catch (error) {
    next(error);
  }
};

export const getIncidents = async (request, response, next) => {
  try {
    const query = {};

    if (request.query.status) {
      query.status = request.query.status;
    }

    const incidents = await Incident.find(query).sort({ createdAt: -1 }).lean();
    response.json(incidents);
  } catch (error) {
    next(error);
  }
};

export const getSummary = async (_request, response, next) => {
  try {
    const summary = await buildIncidentSummary();
    response.json(summary);
  } catch (error) {
    next(error);
  }
};

export const resolveIncident = async (request, response, next) => {
  try {
    const incident = await Incident.findByIdAndUpdate(
      request.params.id,
      {
        status: "resolved",
        resolvedAt: new Date()
      },
      { new: true }
    );

    if (!incident) {
      response.status(404).json({ message: "Incident not found." });
      return;
    }

    emitSocketEvent("incident:resolved", incident);
    await broadcastSummary();

    response.json(incident);
  } catch (error) {
    next(error);
  }
};

export const registerDeviceToken = async (request, response, next) => {
  try {
    const tokenRecord = await registerToken(request.body);

    response.status(201).json({
      message: "Notification token registered.",
      tokenRecord
    });
  } catch (error) {
    next(error);
  }
};

