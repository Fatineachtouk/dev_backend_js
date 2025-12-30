<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const projectStore = useProjectStore()
const authStore = useAuthStore()

const showModal = ref(false)
const newProjectName = ref('')
const newProjectDesc = ref('')

// 1. CHARGEMENT DES PROJETS
onMounted(() => {
  if (authStore.user) {
    projectStore.loadProjects(authStore.user.uid)
  }
})

// Récupérer les projets depuis le store
const projects = computed(() => projectStore.projects)

// 2. CRÉATION AVEC FIREBASE
const handleCreateProject = async () => {
  if (!newProjectName.value) return;

  try {
    await projectStore.createProject(
      authStore.user.uid,
      newProjectName.value,
      newProjectDesc.value,
      '#6366f1' // Couleur par défaut
    )
    showModal.value = false
    newProjectName.value = ''
    newProjectDesc.value = ''
  } catch (e) {
    alert("Erreur: " + e.message)
  }
}

const goToProject = (id) => {
  router.push({ name: 'ProjectDetails', params: { id } })
}
</script>

<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <h1>Mes Projets</h1>
      <button @click="showModal = true" class="btn btn-primary">+ Nouveau Projet</button>
    </header>

    <!-- 1. LOADING STATE (SKELETON LOADER) - MODIFIÉ -->
    <div v-if="projectStore.loading" class="projects-grid">
      <!-- On affiche 3 fausses cartes pendant le chargement -->
      <div v-for="n in 3" :key="n" class="project-card skeleton">
        <div class="skeleton-title"></div>
        <div class="skeleton-text"></div>
        <div class="skeleton-text short"></div>
      </div>
    </div>

    <!-- 2. EMPTY STATE -->
    <div v-else-if="projects.length === 0" style="text-align:center; color:gray; padding: 2rem;">
      Aucun projet pour le moment. Créez-en un !
    </div>

    <!-- 3. GRILLE DES PROJETS RÉELS -->
    <div v-else class="projects-grid">
      <div 
        v-for="project in projects" 
        :key="project.id" 
        class="project-card"
        @click="goToProject(project.id)"
        :style="{ borderTop: `4px solid ${project.color || '#6366f1'}` }"
      >
        <h3>{{ project.name }}</h3>
        <p>{{ project.description }}</p>
        <span class="status-badge">Voir le tableau →</span>
      </div>
    </div>

    <!-- Modal avec Animation -->
    <Transition name="fade">
      <div v-if="showModal" class="modal-overlay">
        <div class="modal">
          <h2>Nouveau Projet</h2>
          <input v-model="newProjectName" placeholder="Nom du projet" />
          <textarea v-model="newProjectDesc" placeholder="Description courte"></textarea>
          <div class="modal-actions">
            <button @click="showModal = false" class="btn">Annuler</button>
            <button @click="handleCreateProject" class="btn btn-primary">Créer</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* --- STYLE EXISTANT --- */
.dashboard-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }
.dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
.project-card { background: var(--bg-card); padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); cursor: pointer; transition: transform 0.2s; }
.project-card:hover { transform: translateY(-5px); }
.project-card h3 { margin-bottom: 0.5rem; color: var(--text-main); }
.status-badge { font-size: 0.8rem; color: var(--primary); font-weight: 600; }

.modal-overlay { 
  position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
  background: rgba(0,0,0,0.5); 
  display: flex; justify-content: center; align-items: center; 
  z-index: 1000; 
}
.modal { background: white; padding: 2rem; border-radius: 12px; width: 400px; }
.modal-actions { display: flex; justify-content: flex-end; gap: 1rem; }

/* --- ANIMATIONS MODAL --- */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.fade-enter-active .modal { animation: slide-in 0.3s ease-out; }
.fade-leave-active .modal { animation: slide-in 0.3s ease-in reverse; }

@keyframes slide-in {
  from { transform: translateY(-30px) scale(0.95); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}

/* --- NOUVEAU : SKELETON LOADER CSS --- */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: #fff;
  cursor: default; /* Pas de main qui pointe sur le skeleton */
}

/* On désactive le hover effect sur le skeleton */
.skeleton:hover { transform: none; }

.skeleton-title, .skeleton-text {
  background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 10px;
}

.skeleton-title { height: 24px; width: 60%; margin-bottom: 15px; }
.skeleton-text { height: 16px; width: 100%; }
.skeleton-text.short { width: 80%; }
</style>