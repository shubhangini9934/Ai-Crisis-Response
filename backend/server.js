import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app from "./src/app.js";
import connectDatabase from "./src/config/db.js";
import { setIo } from "./src/services/socketService.js";

const port = process.env.PORT || 4000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN || process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PATCH"]
  }
});

io.on("connection", (socket) => {
  socket.emit("system:connected", {
    message: "Emergency response live channel connected.",
    connectedAt: new Date().toISOString()
  });
});

setIo(io);

const startServer = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await connectDatabase();
      console.log("✅ Database connected");
    } else {
      console.log("⚠️ No database URI, running in demo mode");
    }

    server.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (error) {
    console.error("⚠️ DB connection failed, starting without DB");
  }
    server.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
};

startServer().catch((error) => {
  console.error("Failed to start backend server", error);
  process.exit(1);
});
