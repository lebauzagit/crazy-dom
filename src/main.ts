import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import { supabase } from './supabase/client'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize auth state
const authStore = useAuthStore()

// Listen for auth state changes
supabase.auth.onAuthStateChange(async (event, session) => {
  console.log('Auth state changed:', event, session)
  
  if (event === 'SIGNED_IN' && session) {
    authStore.setAuth(session.user, session)
  } else if (event === 'SIGNED_OUT') {
    authStore.setAuth(null, null)
    router.push('/login')
  } else if (event === 'TOKEN_REFRESHED' && session) {
    console.log('Token refreshed successfully')
    authStore.setAuth(session.user, session)
  }
})

// Initialize auth on app start
authStore.initializeAuth()

app.mount('#app')