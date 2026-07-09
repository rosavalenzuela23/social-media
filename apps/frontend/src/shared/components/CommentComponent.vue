<script setup lang="ts">
import type { Comment } from "@/services/dto/post.dto";
import { ref } from "vue";

const props = defineProps<{
	comment: Comment;
	checked: boolean;
}>();

const emit = defineEmits(["likePressed"]);

const checkLike = ref(props.checked);

const likeComment = async (comment: Comment) => {
	emit("likePressed", {
		data: comment,
		returnState: (state: "success" | "error") => {
			if (state === "error") {
				checkLike.value = !checkLike.value;
			}
		},
	});
};
</script>

<template>
	<div class="flex justify-between">
		<div>
			<p class="font-bold">{{ comment.creatorUsername }}</p>
			{{ comment.message }}
		</div>
		<div>
			<label class="swap btn">
				<input type="checkbox" @change="() => likeComment(comment)" v-model="checkLike" />
				<div class="swap-on">
					<i class="bi bi-heart-fill"></i>
					Meow
				</div>
				<div class="swap-off">
					<i class="bi bi-heart"></i>
					Meow
				</div>
			</label>
		</div>
	</div>
</template>
