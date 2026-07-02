<script lang="ts" setup>
import type { Post } from "@/services/dto/post.dto";
import { Temporal } from "temporal-polyfill";

const props = defineProps<{ post: Post }>();
const date = Temporal.Instant.from(props.post.date).toZonedDateTimeISO("UTC");
const creationText = `${date.year}-${date.month}-${date.day}`;
</script>

<template>
  <div class="card bg-amber-50 text-black">
    <figure></figure>

    <div class="card-body">
      <div class="row pt-3 card-title">
        {{ props.post.creatorUsername }}
      </div>
      <div class="row card-body">
        <div class="col">
          {{ props.post.message }}
        </div>
      </div>
    </div>

    <div class="card-actions flex justify-between p-5">
      <div>
        {{ creationText }}
      </div>

      <div class="flex gap-3 text-white">
        <button class="btn">
          Comment
          <i class="bi bi-chat-dots"></i>
        </button>
        <button class="btn text-danger">
          Like
          <i class="bi bi-heart"></i>
        </button>
      </div>
    </div>
  </div>
</template>
