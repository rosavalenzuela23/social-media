<script lang="ts" setup>
import axios from "axios";

const props = defineProps<{
	path: string;
}>();

let finalPath;

if (props.path.startsWith("/")) {
	finalPath = props.path;
} else {
	finalPath = "/api/posts/images/" + props.path;
}

const blob = await axios.get<Blob>(finalPath, { responseType: "blob" });
const blobUrl = URL.createObjectURL(blob.data);
</script>

<template>
	<img :src="blobUrl" alt="image" />
</template>
