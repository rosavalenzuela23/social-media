<script setup lang="ts">
import AuthService from '@/services/auth.service';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const authService = AuthService.getInstance();

const password = ref('');
const username = ref('');
const email = ref('');

const registerUser = async (event: SubmitEvent) => {
  event.preventDefault();

  try {
    await authService.register({
      email: email.value,
      username: username.value,
      password: password.value,
    });
  } catch (err) {
    console.log('There was an error when registering the user');
  }
};
</script>

<template>
  <form @submit="registerUser($event)">
    <input type="text" placeholder="Username" v-model="username" />
    <input type="text" placeholder="Email" v-model="email" />
    <input type="text" placeholder="Password" v-model="password" />
    <button>Register</button>
  </form>
</template>
