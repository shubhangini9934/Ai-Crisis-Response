import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    latitude: Number,
    longitude: Number,
    address: String
  },
  { _id: false }
);

const incidentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["manual_sos", "ai_detected"],
      required: true
    },
    category: {
      type: String,
      enum: ["sos", "fire", "smoke", "other"],
      default: "sos"
    },
    source: {
      type: String,
      enum: ["manual", "ai"],
      required: true
    },
    reporterName: {
      type: String,
      default: "Anonymous user"
    },
    message: {
      type: String,
      default: "Emergency assistance requested."
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "high"
    },
    status: {
      type: String,
      enum: ["active", "resolved"],
      default: "active"
    },
    location: locationSchema,
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    resolvedAt: Date
  },
  { timestamps: true }
);

const Incident = mongoose.model("Incident", incidentSchema);

export default Incident;

