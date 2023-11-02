<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter, useRoute } from 'vue-router'
import { useStorage } from '../composables/useStorage'
import { useRoom } from '../composables/useRoom'

const getAgent = (): string => {
  const userAgent = navigator.userAgent
  if (userAgent.match(/opr\//i)) {
    return 'opera'
  } else if(userAgent.match(/chrome|chromium|crios/i)){
    return 'chrome'
  }
  return 'firefox'
}

const userId = useStorage('userId', getAgent())
const username = useStorage('username', getAgent())
const room = useRoom(userId.value, username.value)

const router = useRouter()
const createRoom = () => {
  room.create().then((newRoom: any) => {
    const roomId = newRoom.id as string
    router.push({
      name: 'room',
      params: {
        roomId
      }
    })
  })
}

onMounted(() => {
  room.connect()
})
</script>

<template>
  <div class="h-screen w-full bg-zinc-800 text-green-500">
    <div class="flex flex-col h-screen w-full justify-center items-center">
      <div class="flex flex-col w-96">
        <label>UserId</label>
        <input type="text" v-model="userId" class="border p-2 my-2 w-full bg-zinc-700"/>
      </div>

      <div class="flex flex-col w-96">
        <label>Username</label>
        <input type="text" v-model="username" class="border p-2 my-2 w-full bg-zinc-700"/>
      </div>

      <div class="flex flex-col w-96 mt-4">
        <button @click="createRoom" class="w-full p-2 border bg-gray-700 text-white rounded-lg">
          Create room
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
