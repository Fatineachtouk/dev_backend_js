<template>
  <nav class="navbar">
    <div class="container navbar-content">
      <div class="logo" @click="$router.push('/')">
        <span class="logo-icon">💬</span>
        <h1>Forum Communautaire</h1>
      </div>
      
      <div class="nav-links">
        <router-link to="/" class="nav-link">Accueil</router-link>
        
        <template v-if="user">
          <router-link to="/creer" class="nav-link btn-create">
            + Nouvelle Discussion
          </router-link>
          <span class="user-name">Bonjour, {{ user.displayName }}</span>
          <button @click="handleDeconnexion" class="btn-deconnexion">
            Déconnexion
          </button>
        </template>
        
        <template v-else>
          <router-link to="/welcome" class="nav-link btn-connexion">
            Connexion
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import getUser from '@/composables/getUser'
import { projectAuth } from '@/firebase/config'
import { useRouter } from 'vue-router'

const { user } = getUser()
const router = useRouter()

const handleDeconnexion = async () => {
  await projectAuth.signOut()
  router.push('/welcome')
}
</script>

<style scoped>
.navbar {
  background-color: #2c3e50;
  color: white;
  padding: 15px 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.logo-icon {
  font-size: 28px;
}

.logo h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 5px;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: rgba(255,255,255,0.1);
}

.btn-create {
  background-color: #27ae60;
  font-weight: 600;
}

.btn-create:hover {
  background-color: #229954;
}

.btn-connexion {
  background-color: #3498db;
  font-weight: 600;
}

.btn-connexion:hover {
  background-color: #2980b9;
}

.user-name {
  color: #ecf0f1;
  font-size: 14px;
}

.btn-deconnexion {
  background-color: #9a5b53;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.btn-deconnexion:hover {
  background-color: #945952;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
</style>