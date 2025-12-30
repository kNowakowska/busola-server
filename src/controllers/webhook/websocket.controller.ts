import type { FastifyRequest } from "fastify";
import type { WebSocket } from "ws";

import { addClient } from "../../config/websocket";

export function handleWebsocketWebhook(socket: WebSocket, req: FastifyRequest) {
  const userId = req?.tokenPayload?.userId;

  console.log("Websocket connected", { userId, url: req.url });

  if (userId) {
    addClient(userId, socket);
  }

  socket.send(JSON.stringify({ type: "connection.opened", message: "Connected to websocket" }));

  socket.on("close", () => {
    console.log("Websocket closed", { userId });
  });

  socket.on("error", (error: Error) => {
    console.error("Websocket error", error);
  });
}
