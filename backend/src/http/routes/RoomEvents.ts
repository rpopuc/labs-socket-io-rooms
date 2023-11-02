import "module-alias/register"
import { EventRouter } from "./EventRouter"
import { Server as IOServer, Socket } from "socket.io"
import { Room } from "@/app/Room"
import { NullLogger } from "@/app/NullLogger"
import { ConsoleLogger } from "@/app/ConsoleLogger"
import { LoggerInterface } from "@/app/LoggerInterface"
import { randomUUID } from "crypto"

export class RoomEvents implements EventRouter
{
  private EVENT_USERS: string = 'USERS'
  private EVENT_USER_CONNECTED: string = 'USER_CONNECTED'
  private EVENT_USER_DISCONNECTED: string = 'USER_DISCONNECTED'

  private rooms: Room[] = []
  private logger: LoggerInterface

  constructor() {
    this.logger = new ConsoleLogger('[ROOM-EVENT] ')
  }

  // Método chamado quando uma conexão é estabelecida
  public setup(socket: Socket, io: IOServer): void
  {
    this.onConnect(socket, io)

    console.log('Setting room events');
    socket.on("disconnect", async (reason: string) => this.disconnect(socket, io, reason))
    socket.on("create-room", async (arg, callback) => await this.createRoom(socket, callback))
    socket.on("enter", async (arg, callback) => await this.enterRoom(socket, arg, callback))
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

  private getRoom(roomId: string): Room | null {
    const room = this.rooms.find(room => room.id === roomId)
    if (!room) return null
    this.logger.log('Found room', { roomId })
    return room
  }

  public registerMiddlewares(io: IOServer): void
  {
    // Só efetua a conexão se houver dados de usuário
    // nome do usuário e identificador da sala
    io.use((socket, next) => {
      const { userId, username, roomId } = socket.handshake.auth
      if (!userId || !username) {
        return next(new Error("Invalid connection"))
      }

      socket.data.username = username
      socket.data.userId = userId

      next()
    })
  }

  private onConnect(socket: Socket, io: IOServer): void
  {
  }

  private enterRoom(socket: Socket, arg: any, callback: Function): void
  {
    const {userId, username} = socket.data
    const roomId = arg.roomId as string
    const room = this.getRoom(roomId)
    if (!room) {
      callback({ok: false, error: 'Room not found', roomId})
      return
    }

    room.join(userId, username)
    socket.join(roomId)
    socket.data.roomId = roomId

    // Emite para o novo usuário todos os usuários
    // que estão na sala
    socket.emit(this.EVENT_USERS, room.users)

    // Notifica os outros usuários
    socket.to(roomId).emit(this.EVENT_USER_CONNECTED, {
      id: userId,
      name: username,
      connected: true,
    })

    callback({ok: true})
  }

  private createRoom(socket: Socket, callback: Function): void {
    console.log('creating rooom')
    const { userId } = socket.data
    let roomId = randomUUID()

    this.logger.log('Create room', { roomId })

    const room = new Room(new ConsoleLogger('[ROOM] '))
    room.setId(roomId)
    room.setOwner(userId)
    socket.data.roomId = roomId
    this.rooms.push(room)

    callback(room)
  }

}