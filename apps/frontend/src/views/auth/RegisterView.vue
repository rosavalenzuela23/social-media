<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';

const password = ref("")
const username = ref("")
const email = ref("")


const registerUser = async (event: SubmitEvent) => {
    event.preventDefault();


}

</script>
 
<template>

    <form @submit="registerUser($event)">
        <input type="text" placeholder="Username" v-model="username">
        <input type="text" placeholder="Email" v-model="email">
        <input type="text" placeholder="Password" v-model="password">
        <button>
            Register
        </button>
    </form>

</template>