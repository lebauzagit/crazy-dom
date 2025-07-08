<template>
	<div class="space-y-6">
		<div class="text-center">
			<h2 class="text-2xl font-bold text-gray-900">Sign in to your account</h2>
			<p class="mt-2 text-sm text-gray-600">
				Don't have an account?
				<router-link
					to="/register"
					class="text-primary-600 hover:text-primary-500 font-medium"
				>
					Sign up
				</router-link>
			</p>
		</div>

		<!-- GitHub OAuth Button -->
		<button
			@click="handleGitHubLogin"
			:disabled="loading"
			class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
		>
			<svg
				class="w-5 h-5 mr-3"
				fill="currentColor"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path
					fill-rule="evenodd"
					d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
					clip-rule="evenodd"
				/>
			</svg>
			{{ loading ? "Signing in..." : "Continue with GitHub" }}
		</button>

		<!-- Divider -->
		<div class="relative">
			<div class="absolute inset-0 flex items-center">
				<div class="w-full border-t border-gray-300" />
			</div>
			<div class="relative flex justify-center text-sm">
				<span class="px-2 bg-gray-50 text-gray-500"
					>Or continue with email</span
				>
			</div>
		</div>

		<form @submit.prevent="handleLogin" class="space-y-4">
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

			<div>
				<label for="password" class="block text-sm font-medium text-gray-700">
					Password
				</label>
				<input
					id="password"
					v-model="form.password"
					type="password"
					required
					class="mt-1 input"
					placeholder="Enter your password"
				/>
			</div>

			<div class="flex items-center justify-between">
				<div class="flex items-center">
					<input
						id="remember"
						v-model="form.remember"
						type="checkbox"
						class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
					/>
					<label for="remember" class="ml-2 block text-sm text-gray-700">
						Remember me
					</label>
				</div>

				<router-link
					to="/forgot-password"
					class="text-sm text-primary-600 hover:text-primary-500"
				>
					Forgot your password?
				</router-link>
			</div>

			<button
				type="submit"
				:disabled="loading"
				class="w-full btn btn-primary py-3 text-base font-medium"
			>
				{{ loading ? "Signing in..." : "Sign in" }}
			</button>
		</form>

		<div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
			<div class="flex">
				<ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
				<div class="ml-3">
					<h3 class="text-sm font-medium text-red-800">Sign In Failed</h3>
					<p class="mt-1 text-sm text-red-700">{{ errorMessage }}</p>
					<div v-if="showHelpText" class="mt-2 text-sm text-red-600">
						<p>Please check your email and password, or:</p>
						<ul class="mt-1 list-disc list-inside space-y-1">
							<li>
								<router-link
									to="/register"
									class="underline hover:no-underline"
								>
									Create a new account
								</router-link>
							</li>
							<li>
								<router-link
									to="/forgot-password"
									class="underline hover:no-underline"
								>
									Reset your password
								</router-link>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed } from "vue";
	import { useRouter } from "vue-router";
	import { ExclamationTriangleIcon } from "@heroicons/vue/24/outline";
	import { useAuthStore } from "../../stores/auth";

	const router = useRouter();
	const authStore = useAuthStore();

	const form = ref({
		email: "",
		password: "",
		remember: false,
	});

	const error = ref("");
	const { loading } = authStore;

	const errorMessage = computed(() => {
		if (!error.value) return "";

		// Handle common authentication errors with user-friendly messages
		if (
			error.value.includes("Invalid login credentials") ||
			error.value.includes("invalid_credentials")
		) {
			return "The email or password you entered is incorrect.";
		}

		if (error.value.includes("Email not confirmed")) {
			return "Please check your email and click the confirmation link before signing in.";
		}

		if (error.value.includes("Too many requests")) {
			return "Too many login attempts. Please wait a moment before trying again.";
		}

		if (error.value.includes("OAuth")) {
			return "GitHub sign-in failed. Please try again or use email/password.";
		}

		// Default to the original error message for other cases
		return error.value;
	});

	const showHelpText = computed(() => {
		return (
			error.value.includes("Invalid login credentials") ||
			error.value.includes("invalid_credentials")
		);
	});

	const handleLogin = async () => {
		error.value = "";

		try {
			await authStore.login(form.value.email, form.value.password);
			router.push("/dashboard");
		} catch (err: any) {
			error.value = err.message || "Login failed";
		}
	};

	const handleGitHubLogin = async () => {
		error.value = "";

		try {
			await authStore.loginWithGitHub();
			// Note: OAuth redirects will be handled by Supabase
			// The user will be redirected back to the app after authentication
		} catch (err: any) {
			error.value = err.message || "GitHub sign-in failed";
		}
	};
</script>
