<script lang="ts" setup>
import { onMounted, onUnmounted, ref, useTemplateRef } from "vue";
import ProtectedImage from "./ProtectedImage.vue";
import ProfileService from "@/services/profile.service.ts";

const profileService = ProfileService.getInstance();

const profileId = ref<string>("me");

let openModalEventListener = (event: CustomEvent<{ profileId: string }>) => {
	profileId.value = event.detail.profileId;
	settingsModalRef.value?.showModal();
};

const settingsModalRef = useTemplateRef("ref-profile-settings-dialog");

const imagePreview = ref<string>("");
const changesMade = ref<boolean>(false);

const onImageChange = (file?: File) => {
	if (!file) return;

	const previewUrl = URL.createObjectURL(file);
	imagePreview.value = previewUrl;
	changesMade.value = true;
};

const onSubmitData = async (evt: SubmitEvent) => {
	const formData = new FormData(evt.target as HTMLFormElement);
	await profileService.updateProfileInfo(formData);
	settingsModalRef.value?.close();
};

onMounted(() => {
	document.addEventListener("openProfileSettings", openModalEventListener);
});

onUnmounted(() => {
	document.removeEventListener("openProfileSettings", openModalEventListener);
});
</script>

<template>
	<dialog class="modal" ref="ref-profile-settings-dialog">
		<div class="modal-box h-5/7">
			<form method="dialog">
				<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">x</button>
			</form>

			<form @submit.prevent="onSubmitData" class="flex flex-col gap-5 h-full">
				<div class="flex items-center gap-2">
					<img v-if="imagePreview" :src="imagePreview" alt="" class="max-w-[96px] max-h-[96px]" />
					<ProtectedImage
						v-else
						:path="`/api/profiles/me/picture`"
						class="max-w-[96px] max-h-[96px]"
					></ProtectedImage>
					<fieldset class="fieldset w-full">
						<legend for="" class="fieldset-legend">Change profile picture:</legend>
						<input
							type="file"
							@change="(evt: any) => onImageChange(evt.target.files[0])"
							class="file-input w-full"
							name="profile-picture"
						/>
					</fieldset>
				</div>

				<div class="w-full">
					<fieldset class="fieldset">
						<legend class="fieldset-legend">Like button text:</legend>
						<select name="like-button-text" class="select w-full">
							<option value="meow">Meow (cat)</option>
							<option value="neigh">Neigh (horse)</option>
							<option value="moo">Moo (cow)</option>
							<option value="arf">Arf (dog)</option>
							<option value="chirp">Chirp (bird)</option>
						</select>
					</fieldset>
				</div>

				<textarea
					class="textarea w-full h-full resize-none"
					placeholder="What are you purring?"
				></textarea>
				<button class="btn btn-primary" :disabled="!changesMade">Save changes!</button>
			</form>
		</div>
	</dialog>
</template>
