<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"
import { useRoute } from 'vue-router'
import { useStorage } from '../composables/useStorage'
import { useRoom } from '../composables/useRoom'

const route = useRoute()

let userId = useStorage('userId', '260976')
let username = useStorage('username', 'Robson')
let roomId = route.params.roomId.toString()
const room = useRoom(userId.value, username.value, roomId)

onMounted(() => {
  room.connect()
})

onUnmounted(() => {
  room.disconnect()
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

      <div v-if="room.users" class="mt-4 border rounded flex flex-col gap-2 w-96">
        <label>Users</label>
        <div v-for="user in room.users.value" :key="user.id" class="w-96">
          {{ user.connected ? 'ON' : 'off' }} {{ user.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
