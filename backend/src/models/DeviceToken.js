import mongoose from "mongoose";

const deviceTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      unique: true,
      required: true
    },
    platform: {
      type: String,
      default: "web"
    },
    lastSeenAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const DeviceToken = mongoose.model("DeviceToken", deviceTokenSchema);

export default DeviceToken;

