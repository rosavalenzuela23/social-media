<script lang="ts" setup>
import type { Post } from "@/services/dto/post.dto";
import { Temporal } from "temporal-polyfill";
import PostService from "@/services/posts.service.ts";
import ProfileService from "@/services/profile.service.ts";
import { ref, toRaw } from "vue";
import ImageCarousel from "./ImageCarousel.vue";

const props = defineProps<{ post: Post; likeButtonText?: string }>();
const date = Temporal.Instant.from(props.post.date).toZonedDateTimeISO("UTC");
const creationText = `${date.year}-${date.month}-${date.day}`;

const postService = PostService.getInstance();
const profileService = ProfileService.getInstance();

const user = await profileService.getMyProfile();

const isLiked = ref(props.post.likes?.some((l) => l.userUuid === user.uuid));

const toggleLike = async () => {
	await postService.likePost(props.post.uuid);
	isLiked.value = !isLiked.value;
};

function strictCapitalize(str: string) {
	if (!str) return "";
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const emitEvent = () => {
	const openPostEvent = new CustomEvent("post:opened", {
		detail: {
			post: toRaw(props.post),
		},
	});

	document.dispatchEvent(openPostEvent);
};
</script>

<template>
	<div class="card bg-amber-50 text-black">
		<div class="card-body overflow-x-hidden">
			<div class="pt-3 card-title">
				<RouterLink :to="`/profile/${props.post.creatorUuid}`" class="hover:underline">
					{{ props.post.creatorUsername }}
				</RouterLink>
			</div>
			{{ props.post.message }}

			<figure
				class="min-h-[450px] max-h-[450px] overflow-hidden"
				v-if="props.post.images && props.post.images.length > 0"
			>
				<ImageCarousel :images="props.post.images"></ImageCarousel>
			</figure>

			<div class="card-actions flex justify-between p-5">
				<div>
					{{ creationText }}
				</div>

				<div class="flex gap-3 text-white">
					<button class="btn" @click="emitEvent">
						<i class="bi bi-chat-dots"></i>
						Comment
					</button>
					<button class="btn text-danger" @click="toggleLike">
						<i class="bi bi-heart-fill" v-if="isLiked"></i>
						<i class="bi bi-heart" v-else></i>
						<span v-if="props.likeButtonText">
							{{ strictCapitalize(props.likeButtonText) }}
						</span>
						<span v-else> Meow </span>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
