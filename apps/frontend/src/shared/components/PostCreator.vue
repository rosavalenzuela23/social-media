<script setup lang="ts">
import hotheys from "hotkeys-js";
import { onMounted, ref, useId } from "vue";

const emit = defineEmits(["createPostEvent"]);

const formId = useId();
const modalId = useId();
const message = ref();

function toggleModal() {
  const modal = document.getElementById(`${modalId}`) as HTMLDialogElement;
  if (modal.open) modal.close();
  else modal.showModal();
}

function createPostEvent(event: SubmitEvent) {
  event.preventDefault();
  emit("createPostEvent", { message: message.value });
  alert("hello world!");
}

hotheys("alt+k", (event: KeyboardEvent) => {
  toggleModal();
});

onMounted(() => {});
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
        <input type="file" class="file-input w-full" />
      </form>

      <button :form="formId" type="submit" class="btn btn-primary mt-6">
        <i class="bi bi-chat-text-fill"></i>
        Create post
      </button>
    </div>
  </dialog>
</template>
