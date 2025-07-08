<template>
	<div class="space-y-6">
		<div class="text-center">
			<h2 class="text-2xl font-bold text-gray-900">Forgot your password?</h2>
			<p class="mt-2 text-sm text-gray-600">
				Enter your email address and we'll send you a link to reset your
				password.
			</p>
		</div>

		<form @submit.prevent="handleForgotPassword" class="space-y-4">
			<div>
				<label for="email" class="block text-sm font-medium text-gray-700">
					Email address
				</label>
				<input
					id="email"
					v-model="form.email"
					type="email"
					required
					class="mt-1 input"
					placeholder="Enter your email"
				/>
			</div>

			<button
				type="submit"
				:disabled="loading"
				class="w-full btn btn-primary py-3 text-base font-medium"
			>
				{{ loading ? "Sending..." : "Send reset link" }}
			</button>
		</form>

		<div class="text-center">
			<router-link
				to="/login"
				class="text-sm text-primary-600 hover:text-primary-500"
			>
				Back to sign in
			</router-link>
		</div>

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
					<h3 class="text-sm font-medium text-green-800">Email Sent</h3>
					<p class="mt-1 text-sm text-green-700">{{ success }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import {
		ExclamationTriangleIcon,
		CheckCircleIcon,
	} from "@heroicons/vue/24/outline";
	import { useAuthStore } from "../../stores/auth";

	const authStore = useAuthStore();

	const form = ref({
		email: "",
	});

	const error = ref("");
	const success = ref("");
	const { loading } = authStore;

	const handleForgotPassword = async () => {
		error.value = "";
		success.value = "";

		try {
			await authStore.forgotPassword(form.value.email);
			success.value = "Password reset link sent to your email address.";
		} catch (err: any) {
			error.value = err.message || "Failed to send reset link";
		}
	};
</script>
