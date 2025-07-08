import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { supabase } from "../supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export const useAuthStore = defineStore("auth", () => {
	const user = ref<User | null>(null);
	const session = ref<Session | null>(null);
	const loading = ref(false);

	const isAuthenticated = computed(() => !!user.value);

	const setAuth = (newUser: User | null, newSession: Session | null) => {
		user.value = newUser;
		session.value = newSession;
	};

	const login = async (email: string, password: string) => {
		loading.value = true;
		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) throw error;

			setAuth(data.user, data.session);
			return data;
		} catch (error) {
			console.error("Login error:", error);
			throw error;
		} finally {
			loading.value = false;
		}
	};

	const loginWithGitHub = async () => {
		loading.value = true;
		try {
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: "github",
				options: {
					redirectTo: `${window.location.origin}/dashboard`,
				},
			});

			if (error) throw error;

			return data;
		} catch (error) {
			console.error("GitHub login error:", error);
			throw error;
		} finally {
			loading.value = false;
		}
	};

	const register = async (
		email: string,
		password: string,
		full_name: string
	) => {
		loading.value = true;
		try {
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						full_name,
					},
				},
			});

			if (error) throw error;

			// Create profile after successful registration
			if (data.user) {
				await createProfile(data.user.id, full_name);
			}

			return data;
		} catch (error) {
			console.error("Registration error:", error);
			throw error;
		} finally {
			loading.value = false;
		}
	};

	const logout = async () => {
		loading.value = true;
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;

			setAuth(null, null);
		} catch (error) {
			console.error("Logout error:", error);
			throw error;
		} finally {
			loading.value = false;
		}
	};

	const forgotPassword = async (email: string) => {
		loading.value = true;
		try {
			const { error } = await supabase.auth.resetPasswordForEmail(email, {
				redirectTo: `${window.location.origin}/reset-password`,
			});

			if (error) throw error;
		} catch (error) {
			console.error("Password reset error:", error);
			throw error;
		} finally {
			loading.value = false;
		}
	};

	const resetPassword = async (password: string) => {
		loading.value = true;
		try {
			const { error } = await supabase.auth.updateUser({
				password,
			});

			if (error) throw error;
		} catch (error) {
			console.error("Password update error:", error);
			throw error;
		} finally {
			loading.value = false;
		}
	};

	const createProfile = async (userId: string, full_name: string) => {
		try {
			const { error } = await supabase.from("profiles").insert([
				{
					id: userId,
					full_name,
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
				},
			]);

			if (error) throw error;
		} catch (error) {
			console.error("Profile creation error:", error);
			throw error;
		}
	};

	const updateProfile = async (updates: {
		full_name?: string;
		phone?: string;
		avatar_url?: string;
	}) => {
		if (!user.value) throw new Error("No user logged in");

		loading.value = true;
		try {
			const { error } = await supabase
				.from("profiles")
				.update({
					...updates,
					updated_at: new Date().toISOString(),
				})
				.eq("id", user.value.id);

			if (error) throw error;
		} catch (error) {
			console.error("Profile update error:", error);
			throw error;
		} finally {
			loading.value = false;
		}
	};

	const uploadAvatar = async (file: File) => {
		if (!user.value) throw new Error("No user logged in");

		loading.value = true;
		try {
			const fileExt = file.name.split(".").pop();
			const fileName = `${user.value.id}.${fileExt}`;

			const { error: uploadError } = await supabase.storage
				.from("avatars")
				.upload(fileName, file, { upsert: true });

			if (uploadError) throw uploadError;

			const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);

			await updateProfile({ avatar_url: data.publicUrl });

			return data.publicUrl;
		} catch (error) {
			console.error("Avatar upload error:", error);
			throw error;
		} finally {
			loading.value = false;
		}
	};

	const getProfile = async (userId: string) => {
		try {
			const { data, error } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", userId)
				.single();

			if (error) throw error;
			return data;
		} catch (error) {
			console.error("Profile fetch error:", error);
			return null;
		}
	};

	const initializeAuth = async () => {
		try {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			if (session) {
				setAuth(session.user, session);
			}
		} catch (error) {
			console.error("Auth initialization error:", error);
		}
	};

	return {
		user,
		session,
		loading,
		isAuthenticated,
		setAuth,
		login,
		loginWithGitHub,
		register,
		logout,
		forgotPassword,
		resetPassword,
		updateProfile,
		uploadAvatar,
		getProfile,
		initializeAuth,
	};
});
