<script lang="ts" setup>
import axios from "axios";

const props = defineProps<{
  path: string;
}>();

const blob = await axios.get<Blob>(`/api/posts/images/${props.path}`, { responseType: "blob" });
const blobUrl = URL.createObjectURL(blob.data);
</script>

<template>
  <img :src="blobUrl" alt="aa" />
</template>
