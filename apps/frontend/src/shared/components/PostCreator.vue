<script setup lang="ts">
import hotheys from 'hotkeys-js';
import { Modal } from 'bootstrap';
import { onMounted, ref, useId } from 'vue';

const emit = defineEmits([
  "createPostEvent"
])

const formId = useId();
const modalId = useId();
let modal: Modal;
const message = ref()

function toggleModal() {
  modal.toggle()
}

function createPostEvent(event: SubmitEvent) {
  event.preventDefault()
  emit("createPostEvent", { message: message.value });
  alert("hello world!")
}

hotheys("ctrl+k", (event: KeyboardEvent) => {
  event.preventDefault()
  toggleModal();
})

onMounted(() => {
  modal = new Modal(
    document.querySelector(`#${modalId}`) as HTMLElement
  )
})

</script>

<template>
  <div class="modal fade" tabindex="-1" :id="modalId">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5>
            Say what whatever you're thinking!
          </h5>
          <button class="btn-close" @click="toggleModal"></button>
        </div>
        <div class="modal-body">
          <form @submit="createPostEvent" :id="formId">
            <textarea v-model="message" require :minlength="1" class="form-control" rows="10"></textarea>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="toggleModal">
            Close
          </button>
          <button :form="formId" type="submit" class="btn btn-primary">
            Create post
          </button>
        </div>
      </div>
    </div>
  </div>
</template>