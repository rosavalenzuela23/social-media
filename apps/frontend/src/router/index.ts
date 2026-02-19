import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/login", alias: "/login", component: () => import("../views/auth/LoginView.vue") },
    { path: "/register", alias: "/register", component: () => import("../views/auth/RegisterView.vue") },
    { path: "/feed", alias: "/feed", component: () => import("../views/FeedView.vue") }
  ],
})

export default router
