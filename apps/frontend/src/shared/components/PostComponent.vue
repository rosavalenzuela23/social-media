<script lang="ts" setup>
import type { Post } from '@/services/dto/post.dto';

const props = defineProps<{ post: Post }>();
// <i class="bi bi-heart"></i>
</script>

<template>
  <div class="container card">
    <div class="row pt-3 card-title">
      <div class="col-8">
        {{ props.post.creatorUsername }}
      </div>
    </div>
    <div class="row card-body">
      <div class="col">
        {{ props.post.message }}
      </div>
    </div>
    <div class="row card-footer">
      <div class="col-8"></div>
      <div class="col-4 d-flex justify-content-end">
        <button class="btn">
          <i class="bi bi-chat-square-text"></i>
        </button>
        <button class="btn text-danger">
          <i class="bi bi-heart-fill"></i>
        </button>
      </div>
    </div>
  </div>
</template>
