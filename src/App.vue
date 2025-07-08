<template>
	<div id="app">
		<AuthLayout v-if="!isAuthenticated" />
		<AppLayout v-else />
	</div>
</template>

<script setup lang="ts">
	import { computed } from "vue";
	import { useAuthStore } from "./stores/auth";
	import AuthLayout from "./layouts/AuthLayout.vue";
	import AppLayout from "./layouts/AppLayout.vue";

	const authStore = useAuthStore();

	const isAuthenticated = computed(() => authStore.isAuthenticated);
</script>
