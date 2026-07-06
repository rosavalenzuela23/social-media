<script lang="ts" setup>
import MainLayout from "@/layouts/MainLayout.vue";
import type Profile from "@/models/profile";
import type { Post } from "@/services/dto/post.dto";
import PostService from "@/services/posts.service";
import ProfileService from "@/services/profile.service";
import PostComponent from "@/shared/components/PostComponent.vue";
import { onMounted, reactive } from "vue";
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
		<div class="card bg-amber-100 max-lg:min-h-[150px] text-black mb-5">
			<div class="card-body">
				<div class="card-title">
					<div v-if="profile?.profilePicture" class="avatar">
						<img :src="profile.profilePicture" alt="" />
					</div>

					<div v-else class="avatar">
						<div class="rounded-full w-24 bg-red-600 text-black flex justify-center items-center">
							<p class="text-3xl flex justify-center">
								{{ profile.username.charAt(0).toUpperCase() }}
							</p>
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
