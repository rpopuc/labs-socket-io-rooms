import { Server as IOServer, Socket } from "socket.io"

export interface EventRouter {
  setup(socket: Socket, io: IOServer): void
  registerMiddlewares(io: IOServer): void
}