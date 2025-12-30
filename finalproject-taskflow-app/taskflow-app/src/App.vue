<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import { useAuthStore } from '@/stores/authStore'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase/config'

const authStore = useAuthStore()

onMounted(() => {
  // Cette partie garde l'utilisateur connecté même après un refresh (F5)
  onAuthStateChanged(auth, (user) => {
    if (user) {
      authStore.user = user
    } else {
      authStore.user = null
    }
  })
})
</script>

<template>
  <Navbar />
  <div class="container">
    <RouterView />
  </div>
</template>

<style>
/* Un petit ajustement global pour que la navbar ne colle pas */
.container {
  min-height: calc(100vh - 60px);
}
</style>