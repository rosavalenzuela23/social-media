<script async setup lang="ts">
import MainLayout from "@/layouts/MainLayout.vue";
import type { Post } from "@/services/dto/post.dto";
import PostService from "@/services/posts.service";
import PostComponent from "@/shared/components/PostComponent.vue";
import { onMounted, reactive, ref } from "vue";

const postsService = PostService.getInstance();

const posts = reactive<Post[]>([]);
const content = ref("");

const post: Post = {
  creatorUsername: "Rosita valenzuela",
  creatorUuid: "1234",
  date: new Date().toISOString(),
  imagesPaths: [],
  message: "Hola a todooos!!",
};

onMounted(async () => {
  posts.push(...(await postsService.getPosts()));
});
</script>

<template>
  <MainLayout>
    <div class="flex flex-col items-center w-full">
      <div class="flex flex-col gap-5 min-w-xl max-w-2xl">
        <PostComponent :post="post" />
        <PostComponent :post="post" />
        <PostComponent :post="post" />
        <PostComponent :post="post" />
        <PostComponent :post="post" />
        <PostComponent :post="post" />
        <PostComponent :post="post" />
        <PostComponent :post="post" />
        <PostComponent :post="post" />
        <PostComponent :post="post" />
        <PostComponent :post="post" />
        <PostComponent :post="post" />
        <PostComponent :post="post" />
        <PostComponent :post="post" />
        <PostComponent :post="post" />
        <PostComponent :post="post" />
        <PostComponent :post="post" />
        <PostComponent :post="post" />
        <PostComponent :post="post" />
        <PostComponent :post="post" />
        <PostComponent :post="post" />
        <PostComponent :post="post" />
        <PostComponent :post="post" />
        <PostComponent :post="post" />
        <PostComponent :post="post" />
        <PostComponent :post="post" />
        <PostComponent :post="post" />
        <PostComponent :post="post" />
        <PostComponent :post="post" />
        <PostComponent :post="post" />
        <PostComponent :post="post" />
        <PostComponent :post="post" />
        <PostComponent :post="post" />
        <PostComponent :post="post" />
        <PostComponent :post="post" />
        <PostComponent :post="post" />

      </div>
    </div>
  </MainLayout>
</template>
