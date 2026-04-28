import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

const useIncidentSocket = ({ onConnect, onDisconnect, onNewIncident, onResolvedIncident, onSummary }) => {
  const handlersRef = useRef({
    onConnect,
    onDisconnect,
    onNewIncident,
    onResolvedIncident,
    onSummary
  });

  handlersRef.current = {
    onConnect,
    onDisconnect,
    onNewIncident,
    onResolvedIncident,
    onSummary
  };

  useEffect(() => {
    const socket = io(socketUrl, {
      transports: ["websocket", "polling"]
    });

    socket.on("connect", () => {
      handlersRef.current.onConnect?.(socket.id);
    });

    socket.on("disconnect", () => {
      handlersRef.current.onDisconnect?.();
    });

    socket.on("incident:new", (incident) => {
      handlersRef.current.onNewIncident?.(incident);
    });

    socket.on("incident:resolved", (incident) => {
      handlersRef.current.onResolvedIncident?.(incident);
    });

    socket.on("incident:summary", (summary) => {
      handlersRef.current.onSummary?.(summary);
    });

    return () => {
      socket.close();
    };
  }, []);
};

export default useIncidentSocket;
