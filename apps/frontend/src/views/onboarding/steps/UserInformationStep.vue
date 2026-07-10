<script lang="ts" setup>
import { ref, useTemplateRef } from "vue";

const fileInput = useTemplateRef("user-image-file");
const name = ref<string>("");
const biography = ref<string>("");

type UserInformationDto = {
	name: string;
	biography?: string;
	profilePicture?: File | null;
};

const getData = (): UserInformationDto | null => {
	if (!name.value) return null;

	return {
		name: name.value,
		biography: biography.value,
		profilePicture: fileInput.value?.files?.[0] || null,
	};
};

defineExpose({ getData });
</script>

<template>
	<div>
		<h1 class="text-3xl font-bold">First of all, please tell us your name!</h1>
		<form class="flex flex-col items-center mt-5 w-full">
			<fieldset class="fieldset w-full">
				<legend class="fieldset-legend">Name (required)</legend>
				<input
					type="text"
					class="input w-full"
					placeholder="Please tell us your name"
					v-model="name"
					required
				/>
			</fieldset>
			<fieldset class="fieldset w-full">
				<legend class="fieldset-legend">Biography</legend>
				<input
					type="text"
					class="input w-full"
					placeholder="Something that you want to share to the world?"
					v-model="biography"
				/>
			</fieldset>
			<fieldset class="fieldset w-full">
				<legend class="fieldset-legend">Profile Picture</legend>
				<input
					type="file"
					class="file-input w-full"
					placeholder="Something that you want to share to the world?"
					ref="user-image-file"
				/>
			</fieldset>
		</form>
	</div>
</template>
