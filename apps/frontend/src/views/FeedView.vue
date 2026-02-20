<script async setup lang="ts">
import type { Post } from '@/services/dto/post.dto';
import PostService from '@/services/posts.service';
import PostComponent from '@/shared/components/PostComponent.vue';
import { onMounted, reactive, ref } from 'vue';
import container from '@/services/di.service';

const postsService = container.get(PostService);

const posts = reactive<Post[]>([]);
const content = ref('');

onMounted(async () => {
  posts.push(...(await postsService.getPosts()));
});
</script>

<template>
  <div class="container-fluid w-100 justify-content-center">
    <PostComponent
      :key="post.creatorUuid"
      class="mt-4"
      v-for="post in posts"
      :creator-name="post.creatorUuid"
      :creator-profile-picture-url="post.creatorUuid"
      :post-content="post.message"
    />
  </div>
</template>
