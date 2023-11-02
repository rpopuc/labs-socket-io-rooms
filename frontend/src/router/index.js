import { createRouter, createWebHistory } from "vue-router"
import HomeView from "../views/HomeView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/create-room",
      name: "create-room",
      component: () => import("../views/CreateRoomView.vue"),
    },
    {
      path: "/room/:roomId",
      name: "room",
      component: () => import("../views/RoomView.vue"),
    },
  ],
})

export default router
