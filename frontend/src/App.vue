<script setup lang="ts">
import { ref, onMounted } from "vue"
import socket from "./socket"

type User = {
  id: string
  name: string
  connected: boolean
}

let userId = ref('260976')
let username = ref('Robson')
let roomId = ref('12345')
let agent = ref('')
let users = ref([] as User[])

const connect = () => {
  socket.auth = { username: username.value, userId: userId.value, roomId: roomId.value }
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
  const userAgent = navigator.userAgent
  agent.value = userAgent
  roomId.value = 'my-room'
  if (userAgent.match(/opr\//i)) {
    username.value = 'Opera'
    userId.value = 'opera'
  } else if(userAgent.match(/chrome|chromium|crios/i)){
    username.value = 'Chrome'
    userId.value = 'chrome'
  } else {
    username.value = 'Firefox'
    userId.value = 'firefox'
  }
})
</script>

<template>
  <div>
    <div class="flex flex-col h-screen w-full justify-center items-center">

      <div class="flex flex-col w-96">
        <label>RoomId</label>
        <input type="text" v-model="roomId" class="border p-2 my-2 w-full"/>
      </div>

      <div class="flex flex-col w-96">
        <label>UserId</label>
        <input type="text" v-model="userId" class="border p-2 my-2 w-full"/>
      </div>

      <div class="flex flex-col w-96">
        <label>Username</label>
        <input type="text" v-model="username" class="border p-2 my-2 w-full"/>
      </div>

      <div class="flex flex-col w-96 mt-4">
        <button @click="connect" class="w-full p-2 border">Enter a room</button>
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
