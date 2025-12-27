<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')
const authStore = useAuthStore()
const router = useRouter()

const handleSubmit = async () => {
  try {
    await authStore.login(email.value, password.value)
    router.push('/dashboard')
  } catch (err) {
    error.value = err.message
  }
}
</script>

<template>
  <div class="auth-form">
    <h2>Connexion</h2>
    <form @submit.prevent="handleSubmit">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Mot de passe" required />
      <button type="submit">Se connecter</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
    <p>Note aux étudiants: Implémentez l'inscription ici.</p>
  </div>
</template>

<style scoped>
.auth-form { max-width: 300px; margin: 2rem auto; display: flex; flex-direction: column; gap: 1rem; }
.error { color: red; }
</style>