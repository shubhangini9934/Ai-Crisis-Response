import "dotenv/config";
import express from "express";
import cors from "cors";
import incidentRoutes from "./routes/incidents.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*"
  })
);
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_request, response) => {
  response.json({
    status: "ok",
    service: "emergency-response-backend",
    timestamp: new Date().toISOString()
  });
});

app.use("/api", incidentRoutes);

app.use((error, _request, response, _next) => {
  console.error(error);

  response.status(error.statusCode || 500).json({
    message: error.message || "Unexpected server error."
  });
});

export default app;
