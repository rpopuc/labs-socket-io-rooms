import "module-alias/register"

import express, { Express, Router } from "express"
import cors from "cors"
import dotenv from "dotenv"
import http from 'http'
import { Server as IOServer, Socket } from "socket.io"
import { EventRouter } from "@/http/routes/EventRouter"

dotenv.config()

export default class Server
{
  app: Express
  eventRouters: EventRouter[] = []
  server: http.Server | null = null

  constructor()
  {
    this.app = express()
    this.app.use(express.json())
    this.app.use(cors())
  }

  registerRoutes(router: Router): Server
  {
    this.app.use(router)
    return this
  }

  registerSocketRoutes(router: EventRouter): Server
  {
    this.eventRouters.push(router)
    return this
  }

  run(): void {
    const port = process.env.PORT ?? 8888
    const server = http.createServer(this.app)
    const io = new IOServer(server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    })

    this.eventRouters.forEach(eventRouter => eventRouter.registerMiddlewares(io))

    io.on("connection", (socket) => {
      console.log(JSON.stringify({"type": "socket", "message": "User connected"}))
      this.eventRouters.forEach(eventRouter => eventRouter.setup(socket, io))
    })

    this.server = server.listen(port, () => {
      console.log(`listening on *:${port}`)
    })
  }
}
