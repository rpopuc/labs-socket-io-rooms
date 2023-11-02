import "module-alias/register"
import { EventRouter } from "./EventRouter"
import { Server as IOServer, Socket } from "socket.io"
import { Room } from "@/app/Room"
import { NullLogger } from "@/app/NullLogger"
import { ConsoleLogger } from "@/app/ConsoleLogger"
import { LoggerInterface } from "@/app/LoggerInterface"
import { randomUUID } from "crypto"

export interface Message {
  from: string
  content: string
}

export class GameEvents implements EventRouter
{
  private EVENT_MESSAGE: string = 'MESSAGE'
  private EVENT_MESSAGES: string = 'MESSAGES'
  private EVENT_MOVE: string = 'MOVE'
  private logger: LoggerInterface
  private messages: Message[] = [{from: 'Server', content: 'Conectado com sucesso'}]

  constructor() {
    this.logger = new ConsoleLogger('[ROOM-EVENT] ')
  }

  public setup(socket: Socket, io: IOServer): void
  {
    this.onConnect(socket, io)

    socket.on("message", async (arg, callback) => this.message(socket, arg))
    socket.on("move", async (arg, callback) => this.move(socket, arg))
  }

  private onConnect(socket: Socket, io: IOServer): void
  {
    console.log('tentando emitir essas mensagens....')
    console.log(this.messages)
    socket.emit(this.EVENT_MESSAGES, this.messages)
  }

  private message(socket: Socket, arg: any): void
  {
    const {username, roomId} = socket.data
    const message = {from: username, content: arg.content}
    this.messages.push(message)
    socket.to(roomId).emit(this.EVENT_MESSAGE, message)
  }

  private move(socket: Socket, arg: any): void
  {
    const {username, roomId} = socket.data
    const message = {from: username, content: arg.content}
    socket.to(roomId).emit(this.EVENT_MOVE, message)
  }

  public registerMiddlewares(io: IOServer): void
  {
  }
}