import { io, Socket } from "socket.io-client"

export function useSocket(url: string) {
  return {
    init: (): Socket => {
      const socket = io(url, {autoConnect: false })

      socket.onAny((event: string, ...args: any) => {
        // console.log(event, args)
      })

      return socket
    }
  }
}
