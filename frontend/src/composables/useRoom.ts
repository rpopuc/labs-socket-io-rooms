import { ref, Ref, watch } from "vue"
import socket from "../socket"

export interface User {
  id: string
  name: string
  connected: boolean
}

export function useRoom(userId: string, username: string, roomId: string)
{
  let users: Ref<User[]> = ref([])

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

  const connect = (): void => {
    socket.auth = { username, userId, roomId }
    socket.connect()
  }

  const disconnect = (): void => {
    socket.off("USERS");
    socket.off("USER_DISCONNECTED");
    socket.disconnect()
  }

  return {
    users,
    socket,
    connect,
    disconnect
  }
}
