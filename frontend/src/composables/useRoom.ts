import { ref, Ref, watch } from "vue"
import socket from "../socket"

export interface User {
  id: string
  name: string
  connected: boolean
}

export function useRoom(userId: string, username: string)
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
    socket.auth = { username, userId }
    socket.connect()
  }

  const disconnect = (): void => {
    socket.off("USERS");
    socket.off("USER_DISCONNECTED");
    socket.disconnect()
  }

  const create = async () => {
    return new Promise((resolve) => {
      socket.emit('create-room', {}, (response: any) => {
        resolve(response)
      })
    })
  }

  const enter = async (roomId: string) => {
    return new Promise((resolve) => {
      socket.emit('enter', {roomId}, (response: any) => {
        resolve(response)
      })
    })
  }

  return {
    users,
    socket,
    connect,
    disconnect,
    create,
    enter
  }
}
