import "module-alias/register"
import asyncHandler from "express-async-handler"
import { Request, Response as ExpressResponse } from "express"
import { randomUUID } from "crypto"

export class Room
{
  public id: string = ''
  public ownerId: string = ''
}

export class RoomController
{
  private rooms: Room[] = []

  constructor() {
  }

  public create() {
    return asyncHandler(async (req: Request, res: ExpressResponse, next: any) => {
      const roomId = randomUUID()
      const room = {
        id: roomId,
        ownerId: req.get('ownerId') ?? ''
      }
      this.rooms.push(room)
      res.status(201)
      res.json(room)
    })
  }

  public show() {
    return asyncHandler(async (req: Request, res: ExpressResponse, next: any) => {
      const roomId = req.params.roomId
      const room = this.rooms.find(room => room.id === roomId)
      if (!room) {
        res.status(404)
        res.json({error: 'Not found'})
        return
      }

      res.status(200)
      res.json(room)
    })
  }
}