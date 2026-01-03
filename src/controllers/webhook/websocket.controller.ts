import type { FastifyRequest } from "fastify";
import type { WebSocket } from "ws";

import { addClient } from "../../config/websocket";

export function handleWebsocketWebhook(socket: WebSocket, req: FastifyRequest) {
  const userId = req?.tokenPayload?.userId;

  req.log.info({ msg: "Websocket connected", userId, url: req.url });

  if (userId) {
    addClient(userId, socket);
  }

  socket.send(JSON.stringify({ type: "connection.opened", message: "Connected to websocket" }));

  socket.on("close", () => {
    req.log.info({ msg: "Websocket closed", userId });
  });

  socket.on("error", (error: Error) => {
    req.log.error({ msg: "Websocket error", userId, error });
  });
}
