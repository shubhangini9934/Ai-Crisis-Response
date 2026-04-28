import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  timeout: 8000
});

export const fetchIncidents = async () => {
  const { data } = await api.get("/incidents");
  return data;
};

export const fetchSummary = async () => {
  const { data } = await api.get("/incidents/summary");
  return data;
};

export const triggerSOS = async (payload) => {
  const { data } = await api.post("/sos", payload);
  return data;
};

export const triggerDetection = async (payload) => {
  const { data } = await api.post("/detect", payload);
  return data;
};

export const resolveIncident = async (incidentId) => {
  const { data } = await api.patch(`/incidents/${incidentId}/resolve`);
  return data;
};

export const registerNotificationToken = async (token) => {
  const { data } = await api.post("/notifications/register", {
    token,
    platform: "web"
  });

  return data;
};

export default api;
