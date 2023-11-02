import "module-alias/register"
import express from "express"
import { RoomController } from "@/http/controllers/RoomController"

export class RoomRoutes
{
  setup() {
    const controller = new RoomController()
    const router = express.Router()

    router
      .route('/room/create')
        .post(controller.create())

    router
      .route('/room/:roomId')
        .get(controller.show())

    return router
  }
}