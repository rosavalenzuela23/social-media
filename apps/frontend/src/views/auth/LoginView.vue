<script setup lang="ts">
import AuthService from "@/services/auth.service";
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const authService = AuthService.getInstance();

const password = ref("");
const username = ref("");

const registerUser = async (event: SubmitEvent) => {
  event.preventDefault();
  await authService.login(username.value, password.value);
  router.push("/");
};
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen gap-6">
    <div class="card border h-1/2 w-1/4">
      <div class="card-body flex flex-col justify-between">
        <div class="card-title">
          <h2>Login to SocialCat 🐈</h2>
        </div>
        <form @submit="registerUser($event)" class="flex flex-col gap-5" id="login-form">
          <input type="text" placeholder="Username" v-model="username" class="w-full input" />
          <input type="password" placeholder="Password" v-model="password" class="w-full input" />
        </form>
        <div class="card-actions flex flex-col gap-3 items-center">
          <button class="btn btn-primary w-full" form="login-form">Login</button>
          <RouterLink to="/auth/register" class="hover:underline">Register</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
