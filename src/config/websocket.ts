import type { WebSocket } from "ws";

const clientsByUser = new Map<string, Set<WebSocket>>();

export function addClient(userId: string, socket: WebSocket) {
  const set = clientsByUser.get(userId) ?? new Set<WebSocket>();
  set.add(socket);
  clientsByUser.set(userId, set);

  socket.addEventListener("close", () => {
    set.delete(socket);
    if (set.size === 0) clientsByUser.delete(userId);
  });
}

export function broadcastToUser(userId: string, payload: unknown) {
  const sockets = clientsByUser.get(userId);
  if (!sockets) return;

  const msg = JSON.stringify(payload);
  console.log("Broadcasting message to user:", userId, " message: ", msg);
  for (const ws of sockets) {
    try {
      ws.send(msg);
    } catch {
      console.error("Error sending message to user:", userId, " message: ", payload);
    }
  }
}
