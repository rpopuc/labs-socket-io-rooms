import "module-alias/register"
import Server from "@/http/Server"
import { RoomEvents as RoomEventsRouter } from "@/http/routes/RoomEvents"
import { RoomRoutes } from "@/http/routes/RoomRoutes"

const server = new Server({
  httpPort: 8080,
  socketPort: 3000,
  socketDomain: 'http://localhost'
})

server
  .registerSocketRoutes(new RoomEventsRouter())
  .registerRoutes(new RoomRoutes().setup())
  .run()
