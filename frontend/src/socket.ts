import { io } from "socket.io-client"

const URL = "http://localhost:8080"
const socket = io(URL, { autoConnect: false })

socket.onAny((event: string, ...args: any) => {
  console.log(event, args)
})

export default socket
