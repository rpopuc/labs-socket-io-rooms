<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter, useRoute } from 'vue-router'
import { useStorage } from '../composables/useStorage'
import { Room } from "../services/Room"

let userId = useStorage('userId', '260976')
let username = useStorage('username', 'Robson')
let agent = ref('')

const router = useRouter()
const createRoom = () => {
  const roomService = new Room()
  roomService.create(userId).then(room => {
    router.push({
      name: 'room',
      params: {
        roomId: room.id
      }
    })
  })
}

onMounted(() => {
  const userAgent = navigator.userAgent
  agent.value = userAgent
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
    <div class="flex flex-col h-screen w-full justify-center items-center gap-6">

      <div class="flex flex-col w-96">
        <label>UserId</label>
        <input type="text" v-model="userId" class="border p-2 my-2 w-full"/>
      </div>

      <div class="flex flex-col w-96">
        <label>Username</label>
        <input type="text" v-model="username" class="border p-2 my-2 w-full"/>
      </div>

      <div class="flex flex-col w-96 mt-4">
        <button @click="createRoom" class="w-full p-2 border bg-gray-600 text-white rounded">Create a room</button>
      </div>
    </div>
  </div>
</template>