<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter, useRoute } from 'vue-router'
import { useStorage } from '../composables/useStorage'

let userId = useStorage('userId', '260976')
let username = useStorage('username', 'Robson')
let roomId = ref('12345')
let agent = ref('')

const router = useRouter()
const enterRoom = () => {
  router.push({
    name: 'room',
    params: {
      roomId: roomId.value
    }
  })
}

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
        <button @click="enterRoom" class="w-full p-2 border">Enter a room</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
