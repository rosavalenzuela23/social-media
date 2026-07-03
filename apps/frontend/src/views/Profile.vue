<script lang="ts" setup>
import MainLayout from "@/layouts/MainLayout.vue";
import type Profile from "@/models/profile";
import type { Post } from "@/services/dto/post.dto";
import PostService from "@/services/posts.service";
import ProfileService from "@/services/profile.service";
import PostComponent from "@/shared/components/PostComponent.vue";
import { onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const profileId = route.params.profileId;
if (!profileId) router.push("/feed");

const profileService = ProfileService.getInstance();
const postService = PostService.getInstance();

const posts = reactive<Post[]>([]);

let profile: Profile;
if (profileId == "me") {
  profile = await profileService.getMyProfile();
  posts.unshift(...(await postService.getMyPosts()));
} else {
  // profile = await profileService.getProfile(profileId);
}
</script>

<template>
  <MainLayout>
    <div class="card bg-amber-100 max-lg:min-h-[150px] text-black mb-5">
      <div class="card-body">
        <div class="card-title">
          {{ profile?.username }}
        </div>
        Bio soon!
        <div class="card-subtitle">
          <p class="badge">Friends {{ profile?.friendProfileList.length }}</p>
        </div>
      </div>
    </div>

    <div class="flex flex-col items-center w-full">
      <div class="flex flex-col gap-5 min-w-xl max-w-2xl">
        <PostComponent v-for="post in posts" :key="post.uuid" :post="post" />
      </div>
    </div>

  </MainLayout>
</template>
