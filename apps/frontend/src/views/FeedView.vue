<script async setup lang="ts">
import MainLayout from "@/layouts/MainLayout.vue";
import type { Post } from "@/services/dto/post.dto";
import PostService from "@/services/posts.service";
import PostComponent from "@/shared/components/PostComponent.vue";
import { onMounted, reactive, ref } from "vue";

const postsService = PostService.getInstance();

const posts = reactive<Post[]>([]);

onMounted(async () => {
  posts.push(...(await postsService.getFeed()));
});

document.addEventListener("post:created", async () => {
  posts.unshift(...(await postsService.getFeed()));
});
</script>

<template>
  <MainLayout>
    <div class="flex flex-col items-center w-full">
      <div class="flex flex-col gap-5 min-w-xl max-w-2xl">
        <PostComponent v-for="post in posts" :key="post.uuid" :post="post" />
      </div>
    </div>
  </MainLayout>
</template>
