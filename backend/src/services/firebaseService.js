import admin from "firebase-admin";
import DeviceToken from "../models/DeviceToken.js";

let initialized = false;
let available = false;

const initializeFirebase = () => {
  if (initialized) {
    return available;
  }

  initialized = true;

  const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!rawServiceAccount) {
    console.warn("Firebase service account not configured. Push notifications disabled.");
    available = false;
    return available;
  }

  try {
    const serviceAccount = JSON.parse(rawServiceAccount);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    available = true;
  } catch (error) {
    console.error("Failed to initialize Firebase Admin SDK", error);
    available = false;
  }

  return available;
};

export const registerToken = async ({ token, platform }) => {
  if (!token) {
    return null;
  }

  return DeviceToken.findOneAndUpdate(
    { token },
    { token, platform: platform || "web", lastSeenAt: new Date() },
    { upsert: true, new: true }
  );
};

export const sendIncidentNotification = async (incident) => {
  if (!initializeFirebase()) {
    return;
  }

  const deviceTokens = await DeviceToken.find({}, { token: 1, _id: 0 });

  if (!deviceTokens.length) {
    return;
  }

  const tokens = deviceTokens.map((entry) => entry.token);

  const message = {
    notification: {
      title: `Emergency Alert: ${incident.category.toUpperCase()}`,
      body: incident.message
    },
    data: {
      incidentId: incident.id,
      status: incident.status,
      severity: incident.severity,
      category: incident.category
    },
    tokens
  };

  const result = await admin.messaging().sendEachForMulticast(message);

  const invalidTokens = [];
  result.responses.forEach((response, index) => {
    if (!response.success) {
      invalidTokens.push(tokens[index]);
    }
  });

  if (invalidTokens.length) {
    await DeviceToken.deleteMany({ token: { $in: invalidTokens } });
  }
};

