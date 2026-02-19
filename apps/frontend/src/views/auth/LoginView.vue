<script setup lang="ts">
import AuthService from '@/services/auth.service';
import { ref } from 'vue';

const authService = AuthService.getInstance();

const password = ref("")
const username = ref("")

const registerUser = async (event: SubmitEvent) => {
    event.preventDefault();
    await authService.login(username.value, password.value)
}

</script>

<template>

    <form @submit="registerUser($event)">
        <input type="text" placeholder="Username" v-model="username">
        <input type="text" placeholder="Password" v-model="password">
        <button>
            Login
        </button>
    </form>

    <button>Register</button>

</template>