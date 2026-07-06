<script setup lang="ts">
import PostService from "@/services/posts.service";
import hotheys from "hotkeys-js";
import { onMounted, onUnmounted, ref, useId } from "vue";

const formId = useId();
const modalId = useId();
const message = ref();

const postService = PostService.getInstance();

function toggleModal() {
	const modal = document.getElementById(`${modalId}`) as HTMLDialogElement;
	if (modal.open) modal.close();
	else modal.showModal();
}

async function createPostEvent(event: SubmitEvent) {
	event.preventDefault();
	const formData = new FormData(event.target as HTMLFormElement);

	let images = formData.get("images") as File | File[] | null | undefined;

	if (!(images.name || images.length >= 0)) images = undefined;

	await postService.createPost(message.value, images);
	toggleModal();
	message.value = "";

	const messageCreatedEvent = new CustomEvent("post:created");
	document.dispatchEvent(messageCreatedEvent);
}

hotheys("alt+k", () => toggleModal());

onUnmounted(() => {
	hotheys.unbind("alt+k");
});
</script>

<template>
	<dialog class="modal" tabindex="-1" :id="modalId">
		<div class="modal-box flex flex-col gap-3">
			<form method="dialog">
				<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
			</form>
			<h2 class="text-bold text-2xl">Create a new post!</h2>

			<form @submit="createPostEvent" :id="formId" class="w-full flex flex-col gap-3">
				<textarea
					v-model="message"
					require
					:minlength="1"
					class="textarea w-full"
					rows="10"
					placeholder="Say what whatever you're thinking!"
				></textarea>
				<input type="file" name="images" class="file-input w-full" />
			</form>

			<button :form="formId" type="submit" class="btn btn-primary mt-6">
				<i class="bi bi-chat-text-fill"></i>
				Create post
			</button>
		</div>
	</dialog>
</template>
