<template>
	<div class="min-h-screen bg-gray-50">
		<!-- Navigation -->
		<nav class="bg-white shadow-sm border-b border-gray-200">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex justify-between h-16">
					<div class="flex items-center">
						<h1 class="text-xl font-semibold text-gray-900">Dashboard</h1>
					</div>

					<div class="flex items-center space-x-4">
						<router-link
							to="/dashboard"
							class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
							:class="{
								'text-primary-600 font-semibold': $route.name === 'Dashboard',
							}"
						>
							Dashboard
						</router-link>

						<router-link
							to="/profile"
							class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
							:class="{
								'text-primary-600 font-semibold': $route.name === 'Profile',
							}"
						>
							Profile
						</router-link>

						<button
							@click="handleLogout"
							class="flex cursor-pointer rounded-sm items-center outline-1 px-4 py-2"
							:disabled="loading"
						>
							<ArrowRightOnRectangleIcon class="w-4 h-4 mr-2" />
							{{ loading ? "Logging out..." : "Logout" }}
						</button>
					</div>
				</div>
			</div>
		</nav>

		<!-- Main Content -->
		<main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
			<router-view />
		</main>
	</div>
</template>

<script setup lang="ts">
	import { ArrowRightOnRectangleIcon } from "@heroicons/vue/24/outline";
	import { useAuthStore } from "../stores/auth";
	import { useRouter } from "vue-router";

	const authStore = useAuthStore();
	const router = useRouter();

	const { loading } = authStore;

	const handleLogout = async () => {
		try {
			await authStore.logout();
			router.push("/login");
		} catch (error) {
			console.error("Logout error:", error);
		}
	};
</script>
