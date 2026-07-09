<script setup lang="ts">
import { useIntersector } from "@/composables/useIntersector";
import MainLayout from "@/layouts/MainLayout.vue";
import type { Post } from "@/services/dto/post.dto";
import PostService from "@/services/posts.service";
import ProfileService from "@/services/profile.service";
import PostComponent from "@/shared/components/PostComponent.vue";
import { onMounted, onUnmounted, reactive, useTemplateRef, watch } from "vue";

const pageState = {
	page: 0,
	limit: 10,
};

const postsService = PostService.getInstance();
const profileService = ProfileService.getInstance();

const userProfile = await profileService.getMyProfile();

const posts = reactive<Post[]>([]);
const { observer, isIntersecting } = useIntersector();
const myIntersectableDiv = useTemplateRef("intersectableDiv");

onMounted(async () => {
	posts.push(...(await postsService.getFeed()));
	observer.observe(myIntersectableDiv.value as HTMLDivElement);
	pageState.page += 1;
});

watch(isIntersecting, async () => {
	if (isIntersecting.value) {
		posts.push(...(await postsService.getFeed(pageState.page, pageState.limit)));
		pageState.page += 1;
	}
});

onUnmounted(() => {
	observer.disconnect();
});

document.addEventListener("post:created", async () => {
	posts.unshift(...(await postsService.getFeed()));
});
</script>

<template>
	<MainLayout>
		<div class="flex flex-col items-center w-full">
			<div class="flex flex-col gap-5 min-w-xl max-w-2xl">
				<PostComponent
					v-for="post in posts"
					:key="post.uuid"
					:post="post"
					:like-button-text="userProfile?.likeText"
				/>
				<div
					ref="intersectableDiv"
					class="flex items-center justify-center w-full h-12 mb-30 mt-15 underline text-2xl font-bold"
				>
					<p class="text-center text-muted-foreground">
						Your feed has finished, reload the page the see if there are new posts!
					</p>
				</div>
			</div>
		</div>
	</MainLayout>
</template>
