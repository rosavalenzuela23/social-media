import { onUnmounted, ref } from "vue";

export function useIntersector() {
	const isIntersecting = ref(false);

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				isIntersecting.value = entry.isIntersecting;
			});
		},
		{
			root: null,
			rootMargin: "30px",
			threshold: 0.1,
		},
	);

	onUnmounted(() => {
		observer.disconnect();
	});

	return { isIntersecting, observer };
}
