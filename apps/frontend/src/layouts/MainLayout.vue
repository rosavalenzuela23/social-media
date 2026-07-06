<script setup lang="ts">
import NavBar from "@/shared/components/NavBar.vue";
import PostCreator from "@/shared/components/PostCreator/PostCreator.vue";

import AuthService from "@/services/auth.service";
import { useRouter } from "vue-router";
import ProfileService from "@/services/profile.service";

const authService = AuthService.getInstance();

const router = useRouter();

async function handleLogout() {
	const message = await authService.logout();
	if (message) {
		// toast.success(message);
		router.push("/auth/login");
	}
}
</script>

<template>
	<div class="drawer lg:drawer-open">
		<input id="my-drawer-4" type="checkbox" class="drawer-toggle" />

		<div class="drawer-content">
			<NavBar></NavBar>
			<div class="p-5 mt-15">
				<PostCreator />
				<slot></slot>
			</div>
		</div>

		<div class="drawer-side is-drawer-close:overflow-visible">
			<label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>

			<div
				class="flex text-[18px] justify-between min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64"
			>
				<!-- Sidebar content here -->
				<ul class="menu w-full grow">
					<!-- List item -->
					<li>
						<RouterLink
							to="/"
							class="is-drawer-close:tooltip is-drawer-close:tooltip-right"
							data-tip="Homepage"
						>
							<!-- Home icon -->
							<i class="bi bi-house-door"></i>
							<span class="is-drawer-close:hidden">Homepage</span>
						</RouterLink>
					</li>

					<!-- List item -->
					<li>
						<RouterLink
							:to="`/profile/me`"
							class="is-drawer-close:tooltip is-drawer-close:tooltip-right"
							data-tip="Me"
						>
							<!-- Settings icon -->
							<i class="bi bi-person-fill"></i>
							<span class="is-drawer-close:hidden">Me</span>
						</RouterLink>
					</li>
				</ul>

				<ul class="menu w-full pb-4">
					<li>
						<button
							class="is-drawer-close:tooltip is-drawer-close:tooltip-right"
							data-tip="Log Out"
							@click="handleLogout"
						>
							<i class="bi bi-box-arrow-left"></i
							><span class="is-drawer-close:hidden">Log Out</span>
						</button>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
