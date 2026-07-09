<script setup lang="ts">
import { Suspense } from "vue";
import { RouterView } from "vue-router";
import { Toaster } from "vue-sonner";
import ProfileService from "./services/profile.service";

const profileService = ProfileService.getInstance();

document.addEventListener("refreshProfile", async () => {
	await profileService.getMyProfile(true);
	window.location.reload();
});
</script>

<template>
	<Toaster theme="system" :expand="true" />
	<Suspense>
		<RouterView></RouterView>
	</Suspense>
</template>

<style scoped></style>
