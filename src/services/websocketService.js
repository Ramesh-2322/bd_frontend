import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { logger } from "./logger";

let client = null;

const wsUrl = import.meta.env.VITE_WS_URL || "http://localhost:8080/ws";

export const websocketService = {
  connect(token, onNotification) {
    if (client?.active) return;

    client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      reconnectDelay: 5000,
      onConnect: () => {
        logger.info("WebSocket connected");
        client.subscribe("/user/queue/notifications", (message) => {
          try {
            const payload = JSON.parse(message.body);
            onNotification(payload);
          } catch {
            onNotification({ type: "INFO", message: message.body });
          }
        });

        client.subscribe("/topic/notifications", (message) => {
          try {
            const payload = JSON.parse(message.body);
            onNotification(payload);
          } catch {
            onNotification({ type: "INFO", message: message.body });
          }
        });
      },
      onStompError: (frame) => {
        logger.error("WebSocket STOMP error", { details: frame?.body });
      },
      onWebSocketError: (event) => {
        logger.error("WebSocket transport error", { event });
      },
    });

    client.activate();
  },

  disconnect() {
    if (client?.active) {
      client.deactivate();
      logger.info("WebSocket disconnected");
    }
    client = null;
  },
};
