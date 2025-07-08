<template>
	<div class="space-y-6">
		<div class="bg-white shadow-sm rounded-lg">
			<div class="px-6 py-8">
				<h1 class="text-2xl font-bold text-gray-900">Profile Settings</h1>
				<p class="mt-2 text-sm text-gray-600">
					Update your profile information and manage your account settings.
				</p>
			</div>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- Profile Information -->
			<div class="bg-white shadow-sm rounded-lg">
				<div class="px-6 py-8">
					<h2 class="text-lg font-medium text-gray-900 mb-6">
						Profile Information
					</h2>

					<form @submit.prevent="handleUpdateProfile" class="space-y-4">
						<div>
							<label
								for="full_name"
								class="block text-sm font-medium text-gray-700"
							>
								Full Name
							</label>
							<input
								id="full_name"
								v-model="profileForm.full_name"
								type="text"
								class="mt-1 input"
								placeholder="Enter your full name"
							/>
						</div>

						<div>
							<label
								for="email"
								class="block text-sm font-medium text-gray-700"
							>
								Email Address
							</label>
							<input
								id="email"
								:value="user?.email"
								type="email"
								disabled
								class="mt-1 input bg-gray-50 text-gray-500 cursor-not-allowed"
								placeholder="Email cannot be changed"
							/>
						</div>

						<div>
							<label
								for="phone"
								class="block text-sm font-medium text-gray-700"
							>
								Phone Number
							</label>
							<input
								id="phone"
								v-model="profileForm.phone"
								type="tel"
								class="mt-1 input"
								placeholder="Enter your phone number"
							/>
						</div>

						<button
							type="submit"
							:disabled="loading"
							class="btn btn-primary w-full py-2"
						>
							{{ loading ? "Updating..." : "Update Profile" }}
						</button>
					</form>
				</div>
			</div>

			<!-- Password Change -->
			<div class="bg-white shadow-sm rounded-lg">
				<div class="px-6 py-8">
					<h2 class="text-lg font-medium text-gray-900 mb-6">
						Change Password
					</h2>

					<form @submit.prevent="handlePasswordChange" class="space-y-4">
						<div>
							<label
								for="newPassword"
								class="block text-sm font-medium text-gray-700"
							>
								New Password
							</label>
							<input
								id="newPassword"
								v-model="passwordForm.newPassword"
								type="password"
								class="mt-1 input"
								placeholder="Enter new password"
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
								v-model="passwordForm.confirmPassword"
								type="password"
								class="mt-1 input"
								placeholder="Confirm new password"
							/>
						</div>

						<button
							type="submit"
							:disabled="loading"
							class="btn btn-secondary w-full py-2"
						>
							{{ loading ? "Updating..." : "Update Password" }}
						</button>
					</form>
				</div>
			</div>
		</div>

		<!-- Avatar Upload -->
		<div class="bg-white shadow-sm rounded-lg">
			<div class="px-6 py-8">
				<h2 class="text-lg font-medium text-gray-900 mb-6">Profile Avatar</h2>

				<div class="flex items-center space-x-6">
					<div class="flex-shrink-0">
						<img
							v-if="profile?.avatar_url"
							:src="profile.avatar_url"
							alt="Profile"
							class="h-20 w-20 rounded-full object-cover"
						/>
						<UserCircleIcon v-else class="h-20 w-20 text-gray-400" />
					</div>

					<div class="flex-1">
						<label for="avatar" class="cursor-pointer">
							<span class="btn btn-outline">
								<CameraIcon class="w-4 h-4 mr-2" />
								Change Avatar
							</span>
							<input
								id="avatar"
								type="file"
								accept="image/*"
								class="hidden"
								@change="handleAvatarUpload"
							/>
						</label>
						<p class="mt-2 text-sm text-gray-500">
							JPG, PNG or GIF. Max file size 2MB.
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Success/Error Messages -->
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
					<h3 class="text-sm font-medium text-green-800">Success</h3>
					<p class="mt-1 text-sm text-green-700">{{ success }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted } from "vue";
	import {
		UserCircleIcon,
		CameraIcon,
		ExclamationTriangleIcon,
		CheckCircleIcon,
	} from "@heroicons/vue/24/outline";
	import { useAuthStore } from "../../stores/auth";

	const authStore = useAuthStore();

	const user = computed(() => authStore.user);
	const { loading } = authStore;

	const profile = ref<any>(null);
	const error = ref("");
	const success = ref("");

	const profileForm = ref({
		full_name: "",
		phone: "",
	});

	const passwordForm = ref({
		newPassword: "",
		confirmPassword: "",
	});

	const loadProfile = async () => {
		if (!user.value) return;

		try {
			const profileData = await authStore.getProfile(user.value.id);
			if (profileData) {
				profile.value = profileData;
				profileForm.value.full_name = profileData.full_name || "";
				profileForm.value.phone = profileData.phone || "";
			}
		} catch (err) {
			console.error("Error loading profile:", err);
		}
	};

	const handleUpdateProfile = async () => {
		error.value = "";
		success.value = "";

		try {
			await authStore.updateProfile({
				full_name: profileForm.value.full_name,
				phone: profileForm.value.phone,
			});
			success.value = "Profile updated successfully!";
			await loadProfile();
		} catch (err: any) {
			error.value = err.message || "Failed to update profile";
		}
	};

	const handlePasswordChange = async () => {
		error.value = "";
		success.value = "";

		if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
			error.value = "Passwords do not match";
			return;
		}

		if (passwordForm.value.newPassword.length < 6) {
			error.value = "Password must be at least 6 characters long";
			return;
		}

		try {
			await authStore.resetPassword(passwordForm.value.newPassword);
			success.value = "Password updated successfully!";
			passwordForm.value.newPassword = "";
			passwordForm.value.confirmPassword = "";
		} catch (err: any) {
			error.value = err.message || "Failed to update password";
		}
	};

	const handleAvatarUpload = async (event: Event) => {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (!file) return;

		if (file.size > 2 * 1024 * 1024) {
			error.value = "File size must be less than 2MB";
			return;
		}

		error.value = "";
		success.value = "";

		try {
			const avatarUrl = await authStore.uploadAvatar(file);
			success.value = "Avatar uploaded successfully!";
			await loadProfile();
		} catch (err: any) {
			error.value = err.message || "Failed to upload avatar";
		}
	};

	onMounted(() => {
		loadProfile();
	});
</script>
