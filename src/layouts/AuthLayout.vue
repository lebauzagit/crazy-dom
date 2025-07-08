<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">Welcome</h1>
        <p class="mt-2 text-sm text-gray-600">
          Secure authentication with Supabase
        </p>
      </div>
      
      <div class="card p-8">
        <router-view />
      </div>
      
      <div class="text-center">
        <p class="text-xs text-gray-500">
          Built with Vue 3 + TypeScript + Supabase
        </p>
      </div>
    </div>
  </div>
</template>