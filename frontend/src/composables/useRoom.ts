import { ref, Ref, watch } from "vue"
import { useSocket } from "./useSocket"
import { Socket } from "socket.io-client"

export interface User {
  id: string
  name: string
  connected: boolean
}

export type Room = {
  users: Ref<User[]>
  socket: Socket|null
  init: Function
  connect: Function
  disconnect: Function
}

export function useRoom(userId: string, username: string, roomId: string): Room
{
  let users: Ref<User[]> = ref([])
  let socket: Socket|null = null

  const init = (): void => {
    socket = useSocket('http://localhost:8080').init()

    socket.on("USERS", roomUsers => {
      users.value = roomUsers
    })

    socket.on('USER_CONNECTED', newUser => {
      const user = users.value.find(user => user.id === newUser.id)

      if (user) {
        user.connected = true
        return
      }

      users.value.push(newUser)
    })

    socket.on("USER_DISCONNECTED", userId => {
      const user = users.value.find(user => user.id === userId)
      if (user) {
        user.connected = false
      }
    })
  }

  const connect = (): void => {
    if (!socket) init()
    if (!socket) return
    socket.auth = { username, userId, roomId }
    socket.connect()
  }

  const disconnect = (): void => {
    if (!socket) return
    socket.off("USERS");
    socket.off("USER_DISCONNECTED");
    socket.disconnect()
  }

  return {
    users,
    socket,
    init,
    connect,
    disconnect
  }
}
