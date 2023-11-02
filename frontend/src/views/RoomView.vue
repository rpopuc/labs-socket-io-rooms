<script setup>
import { ref, onMounted, onUnmounted } from "vue"
import { useRoute } from 'vue-router'
import { useStorage } from '../composables/useStorage'
import { useRoom } from '../composables/useRoom'

const route = useRoute()

let userId = useStorage('userId', '260976')
let username = useStorage('username', 'Robson')
let roomId = route.params.roomId.toString()
let isValid = ref(false)
const message = ref('')
const room = useRoom(userId.value, username.value)
const messages = ref([])
const messageArea = ref(null)

const scrollToBottom = () => {
  if (messageArea.value) {
    console.log('bottom')
    messageArea.value.scrollToBottom()
  }
}

const sendMessage = () => {
  room.socket.emit('message', {content: message.value})
  messages.value.push({from: username, content: message.value})
  message.value = ''
  scrollToBottom()
}

onMounted(() => {
  room.connect()

  const el = document.getElementById('move')

  room.socket.on('MESSAGE', message => {
    messages.value.push(message)
    scrollToBottom()
  })

  room.socket.on('MOVE', message => {
    console.log(message)
    el.style.top = message.content.y + 'px'
    el.style.left = message.content.x + 'px'
  })

  room.socket.on('MESSAGES', allMessages => {
    console.log('recebi as mensage', allMessages)
    messages.value = allMessages
    scrollToBottom()
  })

  room.enter(roomId).then(response => {
    isValid.value = response.ok
  })

  document.addEventListener('mousemove', e => {
    room.socket.emit('move', {
      content: {
        x: e.pageX,
        y: e.pageY
      }
    })
  })
})

onUnmounted(() => {
  room.disconnect()
})

</script>

<template>
  <div class="h-screen w-full bg-zinc-800 text-green-500">
    <div id="move" class="h-8 w-8 bg-green-500 absolute"></div>

    <div v-if="isValid" class="">
      <div class="flex w-full justify-between p-4 bg-zinc-700">
        <div>{{ userId }}</div>
        <div>{{ username }}</div>
      </div>

      <div class="flex gap-6 w-full mt-4 px-12">
        <div>
          <div class="mt-4 flex flex-col w-96">
            <div class="p-4 bg-zinc-700 mb-8">Users</div>
            <div class="flex flex-col gap-4">
              <div v-for="user in room.users.value" :key="user.id" class="w-96 flex justify-between">
                <div>{{ user.name }}</div>
                <div>{{ user.connected ? 'ON' : 'off' }} </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="mt-4 flex flex-col w-96">
            <div class="p-4 bg-zinc-700 mb-8">Chat</div>
            <div class="flex flex-col gap-2 bg-zinc-900 p-4 max-h-72 h-72 overflow-auto" :ref="messageArea">
              <div v-for="(message, idx) in messages" :key="idx">
                {{ message.from }}: {{ message.content}}
              </div>
            </div>
            <input type="text" v-model="message" @keyup.enter="sendMessage" class="mt-2 p-2 text-gray-300 bg-gray-700">
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      Sala inexistente
    </div>
  </div>
</template>

<style scoped>
</style>
