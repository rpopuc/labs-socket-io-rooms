import "module-alias/register"
import { EventRouter } from "./EventRouter"
import { Server as IOServer, Socket } from "socket.io"
import { Room } from "@/app/Room"
import { ConsoleLogger } from "@/app/ConsoleLogger"
import { LoggerInterface } from "@/app/LoggerInterface"

export class RoomEvents implements EventRouter
{
  private EVENT_USERS: string = 'USERS'
  private EVENT_USER_CONNECTED: string = 'USER_CONNECTED'
  private EVENT_USER_DISCONNECTED: string = 'USER_DISCONNECTED'

  private rooms: Room[] = []
  private logger: LoggerInterface

  constructor()
  {
    this.logger = new ConsoleLogger('[ROOM-EVENT] ')
  }

  // Método chamado quando uma conexão é estabelecida
  public onConnect(socket: Socket, io: IOServer): void
  {
    this.notifyConnection(socket, io)
    this.registerListeners(socket, io)
  }

  public registerMiddlewares(io: IOServer): void
  {
    // Só efetua a conexão se houver dados de usuário
    // nome do usuário e identificador da sala
    io.use((socket, next) => {
      const { userId, username, roomId } = socket.handshake.auth
      if (!userId || !username || !roomId) {
        return next(new Error("Invalid connection"))
      }

      socket.data.username = username
      socket.data.userId = userId
      socket.data.roomId = roomId

      next()
    })
  }

  private registerListeners(socket: Socket, io: IOServer): void
  {
    socket.on("disconnect", async (reason: string) => this.disconnect(socket, io, reason))
  }

  private async disconnect(socket: Socket, io: IOServer, reason: string): Promise<void>
  {
    const userId = socket.data.userId
    const roomId = socket.data.roomId

    this.logger.log('DISCONNECTING', {userId})

    const matchingSockets = await io.in(userId).allSockets()
    const isDisconnected = matchingSockets.size === 0;
    if (!isDisconnected) {
      return
    }

    // update the connection status of the session
    const room = this.rooms.find(room => room.id === roomId)

    if (!room) return

    room.disconnect(userId)

    // notify other users
    socket.broadcast.emit(this.EVENT_USER_DISCONNECTED, userId)

    this.logger.log('User disconnected', { data: socket.data })
  }

  private getRoom(roomId: string, ownerId: string): Room {
    let room = this.rooms.find(room => room.id === roomId)

    if (room) {
      this.logger.log('Enter room', { roomId })
      return room
    }

    room = this.createRoom(roomId, ownerId)

    return room
  }

  private createRoom(roomId: string, ownerId: string): Room {
    this.logger.log('Create room', { roomId })

    const room = new Room(new ConsoleLogger('[ROOM] '))
    room.setId(roomId)
    room.setOwner(ownerId)
    this.rooms.push(room)

    return room
  }

  private notifyConnection(socket: Socket, io: IOServer): void
  {
    const { username, userId, roomId } = socket.data
    const room = this.getRoom(roomId, userId)
    room.join(userId, username)
    socket.join(roomId)

    // Emite para o novo usuário todos os usuários
    // que estão na sala
    socket.emit(this.EVENT_USERS, room.users)

    // Notifica os outros usuários
    socket.to(roomId).emit(this.EVENT_USER_CONNECTED, {
      id: userId,
      name: username,
      connected: true,
    })
  }
}