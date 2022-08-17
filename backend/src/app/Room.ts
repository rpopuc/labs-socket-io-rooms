import crypto from "crypto"
import { LoggerInterface } from "./LoggerInterface"

export interface User {
  id: string
  name: string
  connected: boolean
}

export class Room {
  public users: User[] = []
  public id: string = ''
  public owner: string = ''
  private logger: LoggerInterface

  constructor(logger: LoggerInterface) {
    this.logger = logger
  }

  public setId(id: string): void
  {
    this.id = id
  }

  public setOwner(id: string): void
  {
    this.owner = id
  }

  public join(userId: string, username: string): void
  {
    const index = this.users.findIndex(user => user.id === userId)
    if (index > -1) {
      this.users[index].connected = true
      this.logger.log('user connected', {users: this.users })
      return
    }

    this.users.push({id: userId, name: username, connected: true})
    this.logger.log('user joined', {users: this.users })
  }

  public disconnect(userId: string): void
  {
    const index = this.users.findIndex(user => user.id === userId)
    if (index == -1) {
      return
    }

    this.users[index].connected = false
    this.logger.log('User disconnected', {users: this.users})
  }
}