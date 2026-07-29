<script setup lang="ts">
import { ref } from "vue";

const colors = [
	"bg-primary",
	"bg-secondary",
	"bg-accent",
	"bg-info",
	"bg-info-content",
	"bg-warning",
	"bg-success",
	"bg-success-content",
	"bg-error",
];

const color1 = colors[Math.floor(Math.random() * colors.length)];
const color2 = colors[Math.floor(Math.random() * colors.length)];
const color3 = colors[Math.floor(Math.random() * colors.length)];

const cats = ref(false);
const dogs = ref(false);
const snakes = ref(false);

type InterestsDto = {
	cats: boolean;
	dogs: boolean;
	snakes: boolean;
};

const getData = (): InterestsDto => {
	return {
		cats: cats.value,
		dogs: dogs.value,
		snakes: snakes.value,
	};
};

defineExpose({
  getData
})
</script>

<template>
	<div>
		<h2 class="text-3xl font-bold">Select your interests!</h2>
		<form class="grid grid-cols-2 gap-2">
			<label class="swap rounded font-bold text-center p-1 shadow" :class="color1">
				<input type="checkbox" v-model="cats" />
				<div class="swap-on">Cats <i class="bi bi-check2"></i></div>
				<div class="swap-off">Cats</div>
			</label>
			<label class="swap rounded font-bold text-center p-1 shadow" :class="color2">
				<input type="checkbox" v-model="dogs" />
				<div class="swap-on">Dogs <i class="bi bi-check2"></i></div>
				<div class="swap-off">Dogs</div>
			</label>
			<label class="swap rounded font-bold text-center p-1 shadow" :class="color3">
				<input type="checkbox" v-model="snakes" />
				<div class="swap-on">Snakes <i class="bi bi-check2"></i></div>
				<div class="swap-off">Snakes</div>
			</label>
		</form>
	</div>
</template>
