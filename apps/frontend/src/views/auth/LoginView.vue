<script setup lang="ts">
import AuthService from '@/services/auth.service';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const authService = AuthService.getInstance();

const password = ref('');
const username = ref('');

const registerUser = async (event: SubmitEvent) => {
  event.preventDefault();
  await authService.login(username.value, password.value);
  router.push('/');
};
</script>

<template>
  <div class="container-fluid justify-content-center">
    <div class="row">
      <div class="col gap-3 d-flex flex-column justify-content-center align-items-center">
        <form @submit="registerUser($event)" class="d-flex flex-column gap-4" id="login-form">
          <input type="text" placeholder="Username" v-model="username" class="form-control" />
          <input type="password" placeholder="Password" v-model="password" class="form-control" />
        </form>
        <button class="btn btn-primary" form="login-form">Login</button>
        <RouterLink to="/register" class="btn btn-secondary">Register</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
input {
  min-width: 20rem;
  min-height: 2rem;
}

button {
  min-width: 6rem;
  min-height: 2rem;
}
</style>
