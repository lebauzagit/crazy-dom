<template>
	<div class="space-y-6">
		<div class="text-center">
			<h2 class="text-2xl font-bold text-gray-900">Create your account</h2>
			<p class="mt-2 text-sm text-gray-600">
				Already have an account?
				<router-link
					to="/login"
					class="text-primary-600 hover:text-primary-500 font-medium"
				>
					Sign in
				</router-link>
			</p>
		</div>

		<form @submit.prevent="handleRegister" class="space-y-4">
			<div>
				<label for="full_name" class="block text-sm font-medium text-gray-700">
					Full Name
				</label>
				<input
					id="full_name"
					v-model="form.full_name"
					type="text"
					required
					class="mt-1 input"
					placeholder="Enter your full name"
				/>
			</div>

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

			<div>
				<label
					for="confirmPassword"
					class="block text-sm font-medium text-gray-700"
				>
					Confirm Password
				</label>
				<input
					id="confirmPassword"
					v-model="form.confirmPassword"
					type="password"
					required
					class="mt-1 input"
					placeholder="Confirm your password"
				/>
			</div>

			<div class="flex items-center">
				<input
					id="terms"
					v-model="form.terms"
					type="checkbox"
					required
					class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
				/>
				<label for="terms" class="ml-2 block text-sm text-gray-700">
					I agree to the
					<a href="#" class="text-primary-600 hover:text-primary-500"
						>Terms of Service</a
					>
					and
					<a href="#" class="text-primary-600 hover:text-primary-500"
						>Privacy Policy</a
					>
				</label>
			</div>

			<button
				type="submit"
				:disabled="loading"
				class="w-full btn btn-primary py-3 text-base font-medium"
			>
				{{ loading ? "Creating account..." : "Create account" }}
			</button>
		</form>

		<div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
			<div class="flex">
				<ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
				<div class="ml-3">
					<h3 class="text-sm font-medium text-red-800">Registration Error</h3>
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
					<h3 class="text-sm font-medium text-green-800">
						Registration Successful
					</h3>
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
		full_name: "",
		email: "",
		password: "",
		confirmPassword: "",
		terms: false,
	});

	const error = ref("");
	const success = ref("");
	const { loading } = authStore;

	const handleRegister = async () => {
		error.value = "";
		success.value = "";

		if (form.value.password !== form.value.confirmPassword) {
			error.value = "Passwords do not match";
			return;
		}

		try {
			await authStore.register(
				form.value.email,
				form.value.password,
				form.value.full_name
			);
			success.value =
				"Account created successfully! Please check your email to verify your account.";

			setTimeout(() => {
				router.push("/login");
			}, 2000);
		} catch (err: any) {
			error.value = err.message || "Registration failed";
		}
	};
</script>
