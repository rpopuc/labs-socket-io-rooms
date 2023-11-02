import "module-alias/register"
import Server from "@/http/Server"
import { RoomEvents as RoomEventsRouter } from "@/http/routes/RoomEvents"
import { GameEvents as GameEventsRouter } from "@/http/routes/GameEvents"

const server = new Server()
server
  .registerSocketRoutes(new RoomEventsRouter())
  .registerSocketRoutes(new GameEventsRouter())
  .run()
