<script lang="ts" setup>
import { onMounted, onUnmounted, ref, useTemplateRef } from "vue";
import ProtectedImage from "./ProtectedImage.vue";
import ProfileService from "@/services/profile.service.ts";

const profileService = ProfileService.getInstance();
const userProfile = await profileService.getMyProfile();
const profileId = ref<string>("me");

let openModalEventListener = (e: Event) => {
	const event = e as CustomEvent<{ profileId: string }>;
	profileId.value = event.detail.profileId;
	settingsModalRef.value?.showModal();
};

const settingsModalRef = useTemplateRef("ref-profile-settings-dialog");

const imagePreview = ref<string>("");
const changesMade = ref<boolean>(false);

let imageValue: File;
let bioValue: string;
let likeTextValue: string;

const onImageChange = (file?: File) => {
	if (!file) return;

	const previewUrl = URL.createObjectURL(file);
	imagePreview.value = previewUrl;
	changesMade.value = true;

	imageValue = file;
};

const onLikeTextButtonInput = (evt: InputEvent) => {
	changesMade.value = true;
	likeTextValue = (evt.target as HTMLSelectElement).value;
};

const onTextAreaInput = (evt: InputEvent) => {
	changesMade.value = true;
	bioValue = (evt.target as HTMLTextAreaElement).value;
};

const onSubmitData = async (evt: SubmitEvent) => {
	const finalData = new FormData();

	if (imageValue) {
		finalData.append("image", imageValue);
	}

	if (bioValue) {
		finalData.append("bio", bioValue);
	}

	if (likeTextValue) {
		finalData.append("likeText", likeTextValue);
	}

	await profileService.updateProfileInfo(finalData);
	settingsModalRef.value?.close();

	document.dispatchEvent(new CustomEvent("refreshProfile"));
};

const onModalClose = () => {
	const target = document.getElementById("profile-configuration-form") as HTMLFormElement;
	target.reset();
	changesMade.value = false;
};

onMounted(() => {
	document.addEventListener("openProfileSettings", openModalEventListener);
	settingsModalRef.value?.addEventListener("close", onModalClose);
});

onUnmounted(() => {
	document.removeEventListener("openProfileSettings", openModalEventListener);
	settingsModalRef.value?.removeEventListener("close", onModalClose);
});
</script>

<template>
	<dialog class="modal" ref="ref-profile-settings-dialog">
		<div class="modal-box h-5/7">
			<form method="dialog">
				<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">x</button>
			</form>

			<form
				@submit.prevent="onSubmitData"
				class="flex flex-col gap-5 h-full"
				id="profile-configuration-form"
			>
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
							id="profile-picture-input"
							name="image"
						/>
					</fieldset>
				</div>

				<div class="w-full">
					<fieldset class="fieldset">
						<legend class="fieldset-legend">Like button text:</legend>
						<select
							:value="userProfile.likeText"
							name="likeText"
							class="select w-full"
							@input="onLikeTextButtonInput"
						>
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
					name="bio"
					placeholder="What are you purring?"
					@input="onTextAreaInput"
				></textarea>
				<button class="btn btn-primary" :disabled="!changesMade">Save changes!</button>
			</form>
		</div>
	</dialog>
</template>
