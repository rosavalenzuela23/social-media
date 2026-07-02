<script setup lang="ts">
import AuthService from "@/services/auth.service";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const authService = AuthService.getInstance();

const password = ref("");
const username = ref("");
const email = ref("");

const registerUser = async (event: SubmitEvent) => {
  event.preventDefault();

  try {
    await authService.register({
      email: email.value,
      username: username.value,
      password: password.value,
    });
  } catch (err) {
    console.log("There was an error when registering the user");
  }
};
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen gap-6">
    <div class="card border h-1/2 w-1/4">
      <div class="card-body flex flex-col justify-between">
        <div class="card-title">
          <h2>Register to SocialCat 🐈</h2>
        </div>
        <form
          @submit="registerUser($event)"
          class="flex flex-col gap-5"
          id="register-form"
          name="register-form"
        >
          <input
            class="input"
            type="text"
            name="username"
            placeholder="Username"
            v-model="username"
          />
          <input class="input" type="text" name="email" placeholder="Email" v-model="email" />
          <input
            class="input"
            type="text"
            name="password"
            placeholder="Password"
            v-model="password"
          />
        </form>
        <div class="card-actions flex flex-col gap-3 items-center">
          <button class="btn btn-primary w-full" form="register-form">Register</button>
          <RouterLink to="/auth/login" class="hover:underline">Go back</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
