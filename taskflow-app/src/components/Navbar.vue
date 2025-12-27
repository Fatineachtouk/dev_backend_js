<script setup>
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { auth } from '@/firebase/config'

const authStore = useAuthStore()
const router = useRouter()
const user = computed(() => auth.currentUser)

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="navbar">
    <h3>TaskFlow</h3>
    <div v-if="user">
      <span>{{ user.email }}</span>
      <button @click="handleLogout">Déconnexion</button>
    </div>
  </nav>
</template>

<style scoped>
.navbar { display: flex; justify-content: space-between; padding: 1rem; background: #eee; }
</style>