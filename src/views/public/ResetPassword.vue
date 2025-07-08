<template>
	<div class="space-y-6">
		<div class="text-center">
			<h2 class="text-2xl font-bold text-gray-900">Reset your password</h2>
			<p class="mt-2 text-sm text-gray-600">Enter your new password below.</p>
		</div>

		<form @submit.prevent="handleResetPassword" class="space-y-4">
			<div>
				<label for="password" class="block text-sm font-medium text-gray-700">
					New Password
				</label>
				<input
					id="password"
					v-model="form.password"
					type="password"
					required
					class="mt-1 input"
					placeholder="Enter your new password"
				/>
			</div>

			<div>
				<label
					for="confirmPassword"
					class="block text-sm font-medium text-gray-700"
				>
					Confirm New Password
				</label>
				<input
					id="confirmPassword"
					v-model="form.confirmPassword"
					type="password"
					required
					class="mt-1 input"
					placeholder="Confirm your new password"
				/>
			</div>

			<button
				type="submit"
				:disabled="loading"
				class="w-full btn btn-primary py-3 text-base font-medium"
			>
				{{ loading ? "Updating..." : "Update password" }}
			</button>
		</form>

		<div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
			<div class="flex">
				<ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
				<div class="ml-3">
					<h3 class="text-sm font-medium text-red-800">Error</h3>
					<p class="mt-1 text-sm text-red-700">{{ error }}</p>
				</div>
			</div>
		</div>

		<div
			v-if="success"
			class="bg-green-50 border border-green-200 rounded-md p-4"
		>
			<div class="flex">
				<CheckCircleIcon class="h-5 w-5 text-green-400" />
				<div class="ml-3">
					<h3 class="text-sm font-medium text-green-800">Password Updated</h3>
					<p class="mt-1 text-sm text-green-700">{{ success }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { useRouter } from "vue-router";
	import {
		ExclamationTriangleIcon,
		CheckCircleIcon,
	} from "@heroicons/vue/24/outline";
	import { useAuthStore } from "../../stores/auth";

	const router = useRouter();
	const authStore = useAuthStore();

	const form = ref({
		password: "",
		confirmPassword: "",
	});

	const error = ref("");
	const success = ref("");
	const { loading } = authStore;

	const handleResetPassword = async () => {
		error.value = "";
		success.value = "";

		if (form.value.password !== form.value.confirmPassword) {
			error.value = "Passwords do not match";
			return;
		}

		try {
			await authStore.resetPassword(form.value.password);
			success.value = "Password updated successfully! Redirecting to login...";

			setTimeout(() => {
				router.push("/login");
			}, 2000);
		} catch (err: any) {
			error.value = err.message || "Failed to update password";
		}
	};
</script>
