import "module-alias/register"

import express, { Express, Router } from "express"
import cors from "cors"
import dotenv from "dotenv"
import http from 'http'
import { Server as IOServer, Socket } from "socket.io"
import { EventRouter } from "@/http/routes/EventRouter"

dotenv.config()

export class ServerConfig {
  httpPort?: number = 8080
  socketPort?: number = 3000
  socketDomain?: string = "http://localhost"
}

export default class Server
{
  app: Express
  eventRouters: EventRouter[] = []
  server: http.Server | null = null
  config: ServerConfig

  constructor(config: ServerConfig = {})
  {
    this.app = express()
    this.app.use(express.json())
    this.app.use(cors())
    this.config = config
  }

  registerRoutes(router: Router): Server
  {
    this.app.use(router)
    return this
  }

  registerSocketRoutes(router: EventRouter): Server
  {
    // Registra o roteador de eventos para ser usado no método run()
    this.eventRouters.push(router)
    return this
  }

  run(): void {
    const port = this.config.httpPort ?? 8080
    const server = http.createServer(this.app)
    const io = new IOServer(server, {
      cors: {
        origin: `${this.config.socketDomain}:${this.config.socketPort}`,
        methods: ["GET", "POST"]
      }
    })

    // Percorre todos os roteadores de eventos e registra os middlewares
    this.eventRouters.forEach(eventRouter => eventRouter.registerMiddlewares(io))

    // Notifica todos os roteadores de eventos que uma conexão foi estabelecida
    io.on("connection", (socket) => {
      console.log(JSON.stringify({"type": "socket", "message": "User connected"}))
      this.eventRouters.forEach(eventRouter => eventRouter.onConnect(socket, io))
    })

    this.server = server.listen(port, () => {
      console.log(`listening on *:${port}`)
    })
  }
}
