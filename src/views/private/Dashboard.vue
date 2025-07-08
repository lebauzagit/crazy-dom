<template>
	<div class="space-y-6">
		<div class="bg-white overflow-hidden shadow-sm rounded-lg">
			<div class="px-6 py-8">
				<div class="flex items-center">
					<div class="flex-shrink-0 w-6 h-6">
						<UserCircleIcon class="h-6 w-6 text-gray-400" />
					</div>
					<div class="ml-4">
						<h1 class="text-2xl font-bold text-gray-900">
							Welcome back, {{ user?.user_metadata?.name || "User" }}!
						</h1>
						<p class="text-gray-600">
							{{ user?.email }}
						</p>
					</div>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			<div class="bg-white overflow-hidden shadow-sm rounded-lg">
				<div class="px-6 py-8">
					<div class="flex items-center">
						<div class="flex-shrink-0 w-6 h-6">
							<UserIcon class="h-6 w-6 text-primary-600" />
						</div>
						<div class="ml-4">
							<h3 class="text-lg font-medium text-gray-900">Profile</h3>
							<p class="text-sm text-gray-600">
								Manage your account settings and preferences
							</p>
						</div>
					</div>
					<div class="mt-6">
						<router-link
							to="/profile"
							class="btn btn-primary w-full justify-center py-2"
						>
							View Profile
						</router-link>
					</div>
				</div>
			</div>

			<div class="bg-white overflow-hidden shadow-sm rounded-lg">
				<div class="px-6 py-8">
					<div class="flex items-center">
						<div class="flex-shrink-0 w-6 h-6">
							<ShieldCheckIcon class="h-6 w-6 text-secondary-600" />
						</div>
						<div class="ml-4">
							<h3 class="text-lg font-medium text-gray-900">Security</h3>
							<p class="text-sm text-gray-600">
								Update your password and security settings
							</p>
						</div>
					</div>
					<div class="mt-6">
						<router-link
							to="/profile"
							class="btn btn-secondary w-full justify-center py-2"
						>
							Security Settings
						</router-link>
					</div>
				</div>
			</div>

			<div class="bg-white overflow-hidden shadow-sm rounded-lg">
				<div class="px-6 py-8">
					<div class="flex items-center">
						<div class="flex-shrink-0 w-6 h-6">
							<Cog6ToothIcon class="h-6 w-6 text-gray-600" />
						</div>
						<div class="ml-4">
							<h3 class="text-lg font-medium text-gray-900">Settings</h3>
							<p class="text-sm text-gray-600">
								Customize your application preferences
							</p>
						</div>
					</div>
					<div class="mt-6">
						<button class="btn btn-outline w-full justify-center py-2" disabled>
							Coming Soon
						</button>
					</div>
				</div>
			</div>
		</div>

		<div class="bg-white overflow-hidden shadow-sm rounded-lg">
			<div class="px-6 py-8">
				<h3 class="text-lg font-medium text-gray-900 mb-4">
					Account Information
				</h3>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<dt class="text-sm font-medium text-gray-500">User ID</dt>
						<dd class="mt-1 text-sm text-gray-900 font-mono">{{ user?.id }}</dd>
					</div>
					<div>
						<dt class="text-sm font-medium text-gray-500">Account Created</dt>
						<dd class="mt-1 text-sm text-gray-900">
							{{ formatDate(user?.created_at ?? null) }}
						</dd>
					</div>
					<div>
						<dt class="text-sm font-medium text-gray-500">Last Sign In</dt>
						<dd class="mt-1 text-sm text-gray-900">
							{{ formatDate(user?.last_sign_in_at ?? null) }}
						</dd>
					</div>
					<div>
						<dt class="text-sm font-medium text-gray-500">Email Verified</dt>
						<dd class="mt-1 text-sm text-gray-900">
							<span v-if="user?.email_confirmed_at" class="text-green-600">
								✓ Verified
							</span>
							<span v-else class="text-red-600"> ✗ Not verified </span>
						</dd>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed } from "vue";
	import {
		UserCircleIcon,
		UserIcon,
		ShieldCheckIcon,
		Cog6ToothIcon,
	} from "@heroicons/vue/24/outline";
	import { useAuthStore } from "../../stores/auth";

	const authStore = useAuthStore();

	const user = computed(() => authStore.user);

	const formatDate = (dateString: string | null) => {
		if (!dateString) return "N/A";
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};
</script>
