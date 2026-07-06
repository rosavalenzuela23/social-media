<script lang="ts" setup>
import type { Post } from "@/services/dto/post.dto";
import { Temporal } from "temporal-polyfill";
import ProtectedImage from "./ProtectedImage.vue";
import PostService from "@/services/posts.service.ts";
import ProfileService from "@/services/profile.service.ts";
import { ref } from "vue";

const props = defineProps<{ post: Post }>();
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
</script>

<template>
	<div class="card bg-amber-50 text-black">
		<div class="card-body overflow-x-hidden">
			<div class="pt-3 card-title">
				{{ props.post.creatorUsername }}
			</div>
			{{ props.post.message }}

			<figure
				class="bg-red-400 min-h-[450px]"
				v-if="props.post.images && props.post.images.length > 0"
			>
				<ProtectedImage :path="props.post.images[0]!.uuid" class="h-[100px]"></ProtectedImage>
			</figure>

			<div class="card-actions flex justify-between p-5">
				<div>
					{{ creationText }}
				</div>

				<div class="flex gap-3 text-white">
					<button class="btn">
						Comment
						<i class="bi bi-chat-dots"></i>
					</button>
					<button class="btn text-danger" @click="toggleLike">
						Like
						<i class="bi bi-heart-fill" v-if="isLiked"></i>
						<i class="bi bi-heart" v-else></i>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
