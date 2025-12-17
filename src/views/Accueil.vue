<template>
  <div class="accueil">
    <BarreNavigation />
    
    <div class="container">
      <div class="header">
        <h2>Discussions Récentes</h2>
        
        <!-- Barre de recherche -->
        <div class="search-bar">
          <input 
            type="text" 
            v-model="recherche" 
            placeholder="🔍 Rechercher des discussions..."
            class="search-input"
          >
        </div>
      </div>

      <!-- Chargement -->
      <div v-if="chargement" class="chargement">
        Chargement des discussions...
      </div>

      <!-- Erreur -->
      <div v-else-if="error" class="error">
        {{ error }}
      </div>

      <!-- Liste des discussions -->
      <div v-else-if="discussionsFiltrees.length > 0" class="discussions-liste">
        <div 
          v-for="discussion in discussionsFiltrees" 
          :key="discussion.id"
          @click="voirDiscussion(discussion.id)"
          class="discussion-card"
        >
          <h3>{{ discussion.titre }}</h3>
          <p class="contenu">{{ discussion.contenu.substring(0, 150) }}...</p>
          <div class="meta">
            <span>👤 Par {{ discussion.auteurNom }}</span>
            <span>📅 {{ formatDate(discussion.dateCreation) }}</span>
            <span>💬 {{ discussion.nombreReponses }} réponse(s)</span>
          </div>
        </div>
      </div>

      <!-- Aucune discussion -->
      <div v-else class="vide">
        <p>Aucune discussion trouvée.</p>
        <router-link v-if="user" to="/creer" class="btn-create-first">
          Créer la première discussion
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BarreNavigation from '@/components/BarreNavigation.vue'
import useDiscussions from '@/composables/useDiscussions'
import getUser from '@/composables/getUser'

const router = useRouter()
const { user } = getUser()
const { discussions, error, chargement, obtenirDiscussions } = useDiscussions()

const recherche = ref('')

// Discussions filtrées par recherche
const discussionsFiltrees = computed(() => {
  if (!recherche.value) return discussions.value
  
  const terme = recherche.value.toLowerCase()
  return discussions.value.filter(disc => 
    disc.titre.toLowerCase().includes(terme) ||
    disc.contenu.toLowerCase().includes(terme)
  )
})

// Formater la date
const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('fr-FR')
}

// Voir une discussion
const voirDiscussion = (id) => {
  router.push(`/discussion/${id}`)
}

// Charger les discussions au montage
onMounted(() => {
  console.log('Accueil component mounted')
  obtenirDiscussions().then(() => {
    console.log('Discussions loaded:', discussions.value)
    console.log('Error:', error.value)
    console.log('Loading:', chargement.value)
  }).catch(err => {
    console.log('Error loading discussions:', err)
  })
})
</script>

<style scoped>
.accueil {
  min-height: 100vh;
  background-color: #ecf0f1;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

.header {
  margin-bottom: 30px;
}

.header h2 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  max-width: 600px;
  padding: 12px 20px;
  border: 1px solid #ddd;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #3498db;
}

.chargement, .error, .vide {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
}

.error {
  color: #884e47;
}

.discussions-liste {
  display: grid;
  gap: 20px;
}

.discussion-card {
  background: white;
  padding: 25px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e0e0e0;
}

.discussion-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.discussion-card h3 {
  color: #2c3e50;
  margin: 0 0 15px 0;
  font-size: 20px;
}

.contenu {
  color: #555;
  margin: 0 0 15px 0;
  line-height: 1.6;
}

.meta {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #7f8c8d;
}

.btn-create-first {
  display: inline-block;
  margin-top: 20px;
  padding: 12px 24px;
  background-color: #27ae60;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.2s;
}

.btn-create-first:hover {
  background-color: #229954;
}
</style>