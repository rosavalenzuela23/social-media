<script setup lang="ts">
import type { Image } from "@/services/dto/post.dto.ts";
import ProtectedImage from "./ProtectedImage.vue";

const props = defineProps<{
	images: Image[];
}>();

console.log(props);

const getGridClasses = () => {
	switch (props.images.length) {
		case 1:
			return "grid-cols-1";
		case 2:
			return "grid-cols-2";
		case 3:
			return "grid-cols-3";
		case 4:
			return "grid-cols-4";
		case 5:
			return "grid-cols-5";
		default:
			return "grid-cols-1";
	}
};
</script>

<template>
	<div class="grid" :class="getGridClasses()">
		<ProtectedImage v-for="img of images" :key="img.uuid" :path="`/api/posts/images/${img.uuid}`"></ProtectedImage>
	</div>
</template>
