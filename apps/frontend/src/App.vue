<script setup async lang="ts">
import { onMounted } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import ProfileService from './services/profile.service';
import NavBar from './shared/components/NavBar.vue';
import PostCreator from './shared/components/PostCreator.vue';
import PostService from './services/posts.service';

const router = useRouter();

const profileService = ProfileService.getInstance();
const postService = PostService.getInstance();

async function createPost(data: { message: string }) {
  await postService.createPost(data.message);  
}

onMounted(async () => {

  try {
    const myProfile = await profileService.getMyProfile();

    if (!myProfile) {
      const name = prompt("What is your name?");
      if (!name) {
        alert("Please enter a name")
        window.location.reload();
        return;
      }
      await profileService.createProfile(name);
    }

  } catch {
    router.push("/login")
    return;
  }

})

</script>

<template>
  <PostCreator @create-post-event="createPost" />
  <div class="container-fluid vh-100">
    <NavBar></NavBar>
    <Suspense>
      <RouterView></RouterView>
    </Suspense>
  </div>
</template>

<style scoped></style>
