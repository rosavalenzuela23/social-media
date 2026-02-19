<script async setup lang="ts">
import type { Post } from '@/services/dto/post.dto';
import PostService from '@/services/posts.service';
import PostComponent from '@/shared/components/PostComponent.vue';
import { onMounted, reactive, ref } from 'vue';

const postsService = PostService.getInstance();

const posts = reactive<Post[]>([])
const content = ref("");

async function createPostEvent(submitEvent: SubmitEvent) {
    submitEvent.preventDefault();
    await postsService.createPost(content.value)
}

onMounted(async () => {
    posts.push(...await postsService.getPosts())
})

</script>


<template>
    <!-- <form @submit="createPostEvent">
        <textarea name="" id="" v-model="content" class="form-control">
            En que estas pensando!
        </textarea>
        <button class="btn btn-primary">
            Crear post
        </button>
    </form> -->

    <div class="container-fluid w-100 justify-content-center">
        <PostComponent :key="post.creatorUuid" class="mt-4" v-for="post in posts" :creator-name="post.creatorUuid"
            :creator-profile-picture-url="post.creatorUuid" :post-content="post.message" />
        <!-- <div v-for="post in posts" :key="post.creatorUuid">
            {{ post.message }}
        </div> -->
    </div>
</template>