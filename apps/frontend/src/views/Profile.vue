<script lang="ts" setup>
import { useIntersector } from "@/composables/useIntersector";
import MainLayout from "@/layouts/MainLayout.vue";
import type Profile from "@/models/profile";
import type { Post } from "@/services/dto/post.dto";
import PostService from "@/services/posts.service";
import ProfileService from "@/services/profile.service";
import PostComponent from "@/shared/components/PostComponent.vue";
import { reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const profileId = route.params.profileId as undefined | "me" | string;
if (!profileId) router.push("/feed");

const profileService = ProfileService.getInstance();
const postService = PostService.getInstance();

const posts = reactive<Post[]>([]);

let profile: Profile;
if (profileId == "me") {
	profile = await profileService.getMyProfile();
	posts.unshift(...(await postService.getMyPosts()));
} else if (typeof profileId == "string") {
	profile = await profileService.getProfile(profileId);
	posts.unshift(...(await postService.getPostsByUuid(profileId)));
}
</script>

<template>
	<MainLayout>
		<div class="card bg-amber-100 max-lg:m v-else in-h-[150px] text-black mb-5">
			<div class="card-body">
				<div class="card-title">
					<div class="avatar">
						<div
							class="relative rounded-full w-24 bg-red-600 text-black flex justify-center items-center"
						>
							<img v-if="profile?.profilePicture" :src="profile.profilePicture" alt="" />
							<p v-else class="text-3xl flex justify-center">
								{{ profile.username.charAt(0).toUpperCase() }}
							</p>
							<div
								v-if="'me' === profileId"
								class="absolute top-0 left-0 w-full group h-full hover:bg-black/20 hover:cursor-pointer flex justify-center items-center"
							>
								<i class="bi bi-eye hidden group-hover:block text-white text-2xl"></i>
							</div>
						</div>
					</div>

					{{ profile?.username }}
					<span v-if="profileId === 'me'"> (You) </span>
				</div>
				Bio soon!
				<div class="card-subtitle">
					<p class="badge">Friends {{ profile?.friendProfileList.length }}</p>
				</div>
			</div>
		</div>

		<div class="flex flex-col items-center w-full">
			<div class="flex flex-col gap-5 min-w-xl max-w-2xl">
				<PostComponent v-for="post in posts" :key="post.uuid" :post="post" />
			</div>
		</div>
	</MainLayout>
</template>
