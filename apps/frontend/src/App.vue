<script setup async lang="ts">
import { onMounted } from "vue";
import { RouterView } from "vue-router";

onMounted(async () => {});
</script>

<template>
  <Suspense>
    <RouterView></RouterView>
  </Suspense>
</template>

<style scoped></style>
