<script setup lang="ts">
import PostService from "@/services/posts.service";
import hotheys from "hotkeys-js";
import { onMounted, onUnmounted, ref, useId, useTemplateRef } from "vue";

const formId = useId();
const modalId = useId();
const message = ref();

const postService = PostService.getInstance();

const fileInput = useTemplateRef("fileInput");

function toggleModal() {
	const modal = document.getElementById(`${modalId}`) as HTMLDialogElement;
	if (modal.open) modal.close();
	else modal.showModal();
}

async function createPostEvent(event: SubmitEvent) {
	event.preventDefault();

	let images = fileInput.value?.files;

  if (!images || images.length == 0) {
		images = undefined;
	}

	await postService.createPost(message.value, images);
	toggleModal();
	message.value = "";

	const messageCreatedEvent = new CustomEvent("post:created");
	document.dispatchEvent(messageCreatedEvent);
}

function requestSubmit() {
	const form = document.getElementById(formId) as HTMLFormElement;
	form.requestSubmit();
}

onMounted(() => {
	const modal = document.getElementById(`${modalId}`) as HTMLDialogElement;

	hotheys("alt+k", () => toggleModal());
	hotheys("ctrl+return", () => {
		if (!modal.open) return;
		requestSubmit();
	});
});

onUnmounted(() => {
	hotheys.unbind("alt+k");
	hotheys.unbind("ctrl+enter");
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
					required
					:minlength="1"
					class="textarea w-full"
					rows="10"
					placeholder="Say what whatever you're thinking!"
					@keydown.ctrl.enter="requestSubmit()"
				></textarea>
				<input
					type="file"
					name="images"
					accept="image/*"
					ref="fileInput"
					multiple
					class="file-input w-full"
				/>
			</form>

			<button :form="formId" type="submit" class="btn btn-primary mt-6">
				<i class="bi bi-chat-text-fill"></i>
				Create post
			</button>
		</div>
	</dialog>
</template>
