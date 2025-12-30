<script setup>
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const authStore = useAuthStore()
const router = useRouter()

// On utilise le store pour l'état utilisateur
const user = computed(() => authStore.user)

// --- 1. FONCTIONS POUR L'AVATAR (AJOUTÉES) ---
const getInitial = (email) => {
  // Prend la première lettre et la met en majuscule
  return email ? email.charAt(0).toUpperCase() : '?'
}

const getAvatarColor = (email) => {
  // Liste de couleurs sympas
  const colors = ['#F87171', '#60A5FA', '#34D399', '#FBBF24', '#A78BFA', '#F472B6'];
  // Choisit toujours la même couleur pour le même email
  const index = email.length % colors.length;
  return colors[index];
}
// ---------------------------------------------

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/auth') 
  } catch (error) {
    console.error("Erreur déconnexion:", error)
  }
}
</script>

<template>
  <nav class="navbar">
    <h3 class="logo">TaskFlow</h3>
    
    <div v-if="user" class="user-menu">
      
      <!-- 2. L'AVATAR EST AJOUTÉ ICI -->
      <div class="avatar" :style="{ backgroundColor: getAvatarColor(user.email) }">
        {{ getInitial(user.email) }}
      </div>

      <span class="user-email">{{ user.email }}</span>
      <button @click="handleLogout" class="btn-logout">Déconnexion</button>
    </div>
  </nav>
</template>

<style scoped>
.navbar { 
  display: flex; 
  justify-content: space-between; 
  align-items: center;
  padding: 1rem 2rem; 
  background: white; 
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  height: 60px;
}

.logo {
  font-weight: 700;
  color: #4F46E5;
  font-size: 1.2rem;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* 3. STYLE DE L'AVATAR (AJOUTÉ) */
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-transform: uppercase;
  flex-shrink: 0; /* Empêche l'avatar de s'écraser */
}

.user-email {
  color: #4b5563;
  font-size: 0.9rem;
  font-weight: 500;
}

.btn-logout {
  padding: 0.5rem 1rem;
  background-color: #fee2e2;
  color: #b91c1c;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.2s;
}

.btn-logout:hover {
  background-color: #fecaca;
}
</style>