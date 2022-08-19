<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"
import { useRoute } from 'vue-router'
import { useStorage } from '../composables/useStorage'
import socket from "../socket"

const route = useRoute()

type User = {
  id: string
  name: string
  connected: boolean
}

let userId = useStorage('userId', '260976')
let username = useStorage('username', 'Robson')
let users = ref([] as User[])
let roomId = route.params.roomId.toString()

const connect = () => {
  socket.auth = { username: username.value, userId: userId.value, roomId }
  console.log('Connecting', socket.auth)
  console.log(socket.connect())
}

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

onMounted(() => {
  connect()
})

onUnmounted(() => {
  socket.off("USERS");
  socket.off("USER_DISCONNECTED");
  socket.disconnect()
})
</script>

<template>
  <div>
    <div class="flex flex-col h-screen w-full justify-center items-center">

      <div class="flex flex-col w-96">
        <label>RoomId</label>
        <input type="text" :value="roomId" readonly class="border p-2 my-2 w-full"/>
      </div>

      <div class="flex flex-col w-96">
        <label>UserId</label>
        <input type="text" :value="userId" readonly class="border p-2 my-2 w-full"/>
      </div>

      <div class="flex flex-col w-96">
        <label>Username</label>
        <input type="text" :value="username" readonly class="border p-2 my-2 w-full"/>
      </div>

      <div class="mt-4 border rounded flex flex-col gap-2 w-96">
        <label>Users</label>
        <div v-for="user in users" :key="user.id" class="w-96">
          {{ user.connected ? 'ON' : 'off' }} {{ user.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
