import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/auth",
      alias: "/auth",
      children: [
        { path: "login", alias: "login", component: () => import("../views/auth/LoginView.vue") },
        {
          path: "register",
          alias: "register",
          component: () => import("../views/auth/RegisterView.vue"),
        },
      ],
    },
    {
      path: "/",
      alias: "/",
      redirect: "/feed",
    },
    { path: "/feed", alias: "/feed", component: () => import("../views/FeedView.vue") },
    {
      path: "/profile/:profileId",
      alias: "/profile/:profileId",
      component: () => import("../views/Profile.vue"),
    },
    { path: "/:pathMatch(.*)*", component: () => import("../views/NotFoundPage.vue") },
  ],
});

export default router;
