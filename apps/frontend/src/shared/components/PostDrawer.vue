<script lang="ts" setup>
import type { Comment, Post } from "@/services/dto/post.dto";
import PostService from "@/services/posts.service";
import ProfileService from "@/services/profile.service";
import { onMounted, onUnmounted, reactive, useTemplateRef } from "vue";
import CommentComponent from "./CommentComponent.vue";
import { toast } from "vue-sonner";
import ImageCarousel from "./ImageCarousel.vue";
const modalRef = useTemplateRef("modalRef");

const postService = PostService.getInstance();
const profileService = ProfileService.getInstance();

const userProfile = await profileService.getMyProfile();

const eventListener = (e: CustomEvent<{ post: Post }>) => {
	Object.assign(post, e.detail.post);
	modalRef.value?.showModal();
};

const onCloseListener = () => {
	const form = document.getElementById("post-drawer-text-input") as HTMLFormElement;
	form.reset();
};

const post = reactive<Post>({});

const getComments = async () => {
	const comments = await postService.getComments(post.uuid);
	post.comments = [...comments];
};

const addComent = async (e: SubmitEvent) => {
	e.preventDefault();
	const form = e.target as HTMLFormElement;
	const formData = new FormData(form);
	await postService.addComment(post.uuid, formData.get("comment") as string);
	form.reset();
	await getComments();
};

const likeComment = async ({
	data: comment,
	returnState,
}: {
	data: Comment;
	returnState: (state: "success" | "error") => void;
}) => {
	try {
		await postService.likeComment(post.uuid, comment.uuid);
		returnState("success");
	} catch (err) {
		returnState("error");
		toast.error("Failed to like comment");
	}
};

onMounted(() => {
	document.addEventListener("post:opened", eventListener);
	modalRef.value?.addEventListener("close", onCloseListener);
});

onUnmounted(() => {
	document.removeEventListener("post:opened", eventListener);
	modalRef.value?.removeEventListener("close", onCloseListener);
});
</script>

<template>
	<dialog class="modal" ref="modalRef">
		<div class="modal-box w-11/12 max-w-5xl p-0 m-0 h-4/5 flex flex-col">
			<form method="dialog" class="z-100">
				<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
			</form>

			<div class="w-full">
				<p class="font-bold p-3 text-xl">
					{{ post.creatorUsername }}
				</p>
			</div>

			<div class="overflow-y-auto px-5 mb-15">
				<div class="my-10">{{ post.message }}</div>

				<figure class="max-h-[400px] overflow-hidden" v-if="post.images && post.images.length > 0">
					<ImageCarousel :images="post.images"></ImageCarousel>
				</figure>

				<div v-if="post.comments?.length == 0" class="justify-center my-10 flex text-2xl font-bold">
					<p>No comments yet!</p>
				</div>

				<div id="comments" v-for="comment in post?.comments" :key="comment.uuid" class="my-10">
					<CommentComponent
						:comment="comment"
						:checked="!!comment.likes?.find(async (c) => c.userUuid === userProfile.uuid)"
						@like-pressed="likeComment"
					/>
					<div class="divider"></div>
				</div>
			</div>

			<div class="fixed w-full flex items-center justify-center h-1/8 left-0 bottom-0">
				<form
					class="join flex-1 justify-center"
					id="post-drawer-text-input"
					@submit.prevent="addComent"
				>
					<input type="text" required class="input w-1/2" placeholder="Say meow!" name="comment" />
					<button type="submit" class="btn join-item">
						<i class="bi bi-send"></i>
					</button>
				</form>
			</div>
		</div>
	</dialog>
</template>
