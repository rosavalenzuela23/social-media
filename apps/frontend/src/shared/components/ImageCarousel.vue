<script setup lang="ts">
import { ref } from "vue";
import type { Image } from "@/services/dto/post.dto.ts";
import ProtectedImage from "./ProtectedImage.vue";

const props = defineProps<{
	images: Image[];
}>();

const carouselRef = ref<HTMLElement | null>(null);
const currentIndex = ref(0);

function scrollToImage(index: number) {
	const el = carouselRef.value;
	if (!el) return;
	const items = el.querySelectorAll(".carousel-item");
	const targetItem = items[index] as HTMLElement;
	if (targetItem) {
		el.scrollTo({
			left: targetItem.offsetLeft,
			behavior: "smooth",
		});
	}
}

function prevImage() {
	if (props.images.length === 0) return;
	currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length;
	scrollToImage(currentIndex.value);
}

function nextImage() {
	if (props.images.length === 0) return;
	currentIndex.value = (currentIndex.value + 1) % props.images.length;
	scrollToImage(currentIndex.value);
}
</script>

<template>
	<div class="relative w-full h-full group">
		<div ref="carouselRef" class="carousel rounded-box h-full w-full scroll-smooth" data-length>
			<div class="carousel-item w-full" :id="`carousel-${img.uuid}`" v-for="img of images">
				<ProtectedImage
					:key="img.uuid"
					:path="`/api/posts/images/${img.uuid}`"
					class="h-[450px] w-full object-cover"
				></ProtectedImage>
			</div>
		</div>

		<template v-if="props.images.length > 1">
			<button
				@click="prevImage"
				class="absolute left-4 top-1/2 -translate-y-1/2 z-10 btn btn-circle btn-sm bg-black/40 hover:bg-black/60 border-none text-white"
			>
				<i class="bi bi-arrow-left-short text-xl"></i>
			</button>
			<button
				@click="nextImage"
				class="absolute right-4 top-1/2 -translate-y-1/2 z-10 btn btn-circle btn-sm bg-black/40 hover:bg-black/60 border-none text-white"
			>
				<i class="bi bi-arrow-right-short text-xl"></i>
			</button>
		</template>
	</div>
</template>

