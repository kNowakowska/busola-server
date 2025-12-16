import type { FastifyRequest } from "fastify";
import type { WebSocket } from "ws";

// TODO: Implement chat websocket
export async function handleChatWebsocket(socket: WebSocket, request: FastifyRequest) {
  console.log("Chat websocket connected");

  socket.on("open", () => {
    console.log("Chat websocket opened");
  });

  socket.on("message", (message) => {
    console.log("Chat websocket message", message.toString());
    socket.send("hi from server");
  });

  socket.on("close", () => {
    console.log("Chat websocket closed");
  });

  socket.on("error", (error) => {
    console.error("Chat websocket error", error);
  });
}
