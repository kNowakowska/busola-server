import type { FastifyBaseLogger } from "fastify";
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

export function broadcastToUser(
  userId: string,
  payload: unknown,
  logger: FastifyBaseLogger,
): boolean {
  const sockets = clientsByUser.get(userId);
  if (!sockets) return false;

  const msg = JSON.stringify(payload);
  logger.info({ msg: "Broadcasting message to user", userId, message: msg });
  let anySuccess = false;
  for (const ws of sockets) {
    try {
      ws.send(msg);
      anySuccess = true;
    } catch {
      logger.error({ msg: "Error sending message to user", userId, message: payload });
    }
  }
  return anySuccess;
}
