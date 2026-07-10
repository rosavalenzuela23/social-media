<script setup lang="ts">
import { reactive, ref, useTemplateRef } from "vue";
import InterestsStep from "./steps/InterestsStep.vue";
import UserInformationStep from "./steps/UserInformationStep.vue";
import FinalMessage from "./steps/FinalMessage.vue";
import ProfileService from "@/services/profile.service.ts";
import confetti from "@hiseb/confetti";
import { useRouter } from "vue-router";

const router = useRouter();

const currentStep = ref<number>(0);

const userInformationChild = useTemplateRef("user-information");
const interestChild = useTemplateRef("interests");

const profileService = ProfileService.getInstance();

const userInformation = reactive({
	name: "",
	biography: "" as string | undefined,
	profilePicture: undefined as File | undefined,
	interests: {
		cats: false,
		dogs: false,
		snakes: false,
	},
});

const createProfile = async () => {
	const userInterests = [];
	for (const [interest, value] of Object.entries(userInformation.interests)) {
		if (value) {
			userInterests.push(interest);
		}
	}

	await profileService.createProfile(
		userInformation.name,
		userInterests,
		userInformation.biography,
		userInformation.profilePicture,
	);

	const mousePosition = { x: window.screen.width / 2, y: window.screen.height / 2 };

	confetti({
		count: 300,
		fade: true,
		position: mousePosition,
	});

	router.push({
		name: "feed",
	});
};

const validateUserInformationData = () => {
	if (!userInformationChild.value) throw new Error("User information data is not defined");
	if (!userInformationChild.value.getData()) throw new Error("User information data is not valid");

	const data = userInformationChild.value.getData();

	userInformation.name = data!.name;
	userInformation.biography = data?.biography;
	userInformation.profilePicture = data?.profilePicture || null;
};

const validateInterestsStep = () => {
	if (!interestChild.value) throw new Error("Interests data is not defined");

	const data = interestChild.value.getData();

	if (!data.cats && !data.dogs && !data.snakes) {
		throw new Error("You must select at least one interest");
	}

	userInformation.interests = data;
};

const nextStep = async () => {
	if (currentStep.value === 2) {
		await createProfile();
		return;
	}

	if (currentStep.value == 0) {
		validateUserInformationData();
	} else if (currentStep.value == 1) {
		validateInterestsStep();
	}

	currentStep.value += 1;
};

const prevStep = () => {
	if (currentStep.value === 0) return;
	currentStep.value -= 1;
};
</script>

<template>
	<div class="flex h-[80vh] flex-col items-center justify-center">
		<div class="flex flex-col min-w-[40%]">
			<ul class="steps mb-10">
				<li class="step" :class="{ 'step-primary': currentStep >= 0 }">User information</li>
				<li class="step" :class="{ 'step-primary': currentStep >= 1 }">Interests</li>
				<li class="step" :class="{ 'step-primary': currentStep >= 2 }">Finish!</li>
			</ul>

			<div class="min-h-75 max-h-75 items-center justify-center flex">
				<UserInformationStep v-if="currentStep == 0" ref="user-information" />
				<InterestsStep v-if="currentStep == 1" ref="interests" />
				<FinalMessage v-if="currentStep == 2" />
			</div>

			<div class="flex justify-between w-full mt-10" :class="{ 'justify-end': currentStep == 0 }">
				<button class="btn btn-primary" @click="prevStep" v-if="currentStep >= 1">
					<i class="bi bi-arrow-left"></i> Prev
				</button>
				<button class="btn btn-primary" @click="nextStep">
					{{ currentStep === 2 ? "Finish" : "Next" }} <i class="bi bi-arrow-right"></i>
				</button>
			</div>
		</div>
	</div>
</template>
