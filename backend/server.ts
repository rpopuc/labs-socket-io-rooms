import "module-alias/register"
import Server from "@/http/Server"
import { RoomEvents as RoomEventsRouter } from "@/http/routes/RoomEvents"

const server = new Server()
server
  .registerSocketRoutes(new RoomEventsRouter())
  .run()
