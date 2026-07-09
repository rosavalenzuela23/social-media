<script setup lang="ts">
import { Suspense } from "vue";
import { RouterView } from "vue-router";
import { Toaster } from "vue-sonner";
</script>

<template>
	<Toaster theme="system" :expand="true" />
	<Suspense>
		<RouterView></RouterView>
	</Suspense>
</template>

<style scoped></style>
