<template>
  <div class="voir-discussion">
    <BarreNavigation />
    
    <div class="container">
      <!-- Chargement -->
      <div v-if="chargement" class="chargement">
        Chargement de la discussion...
      </div>

      <!-- Discussion -->
      <div v-else-if="discussion" class="discussion-container">
        <!-- En-tête de la discussion -->
        <div class="discussion-header">
          <div class="discussion-content">
            <h2>{{ discussion.titre }}</h2>
            <p class="meta">
               Par {{ discussion.auteurNom }} • 
               {{ formatDate(discussion.dateCreation) }}
            </p>
            <p class="contenu">{{ discussion.contenu }}</p>
          </div>
          
          <button 
            v-if="user && user.uid === discussion.auteurId"
            @click="handleSupprimer"
            class="btn-supprimer"
          >
             Supprimer
          </button>
        </div>

        <!-- Réponses -->
        <div class="reponses-section">
          <h3>Réponses ({{ reponses.length }})</h3>
          
          <div v-if="reponses.length === 0" class="vide">
            Aucune réponse pour le moment. Soyez le premier à répondre !
          </div>
          
          <div v-else class="reponses-liste">
            <div 
              v-for="reponse in reponses" 
              :key="reponse.id"
              class="reponse-card"
            >
              <p class="meta">
                 {{ reponse.auteurNom }} • 
                 {{ formatDate(reponse.dateCreation) }}
              </p>
              <p class="contenu">{{ reponse.contenu }}</p>
            </div>
          </div>
        </div>

        <!-- Formulaire de réponse -->
        <div v-if="user" class="formulaire-reponse">
          <h3>Votre réponse</h3>
          <textarea 
            v-model="nouvelleReponse" 
            placeholder="Écrivez votre réponse..."
            rows="5"
            class="reponse-textarea"
          ></textarea>
          
          <div v-if="errorReponse" class="error">{{ errorReponse }}</div>
          
          <button 
            @click="handleAjouterReponse" 
            class="btn-repondre"
            :disabled="!nouvelleReponse.trim()"
          >
            Publier la réponse
          </button>
        </div>
        
        <div v-else class="connexion-requise">
          <p>Vous devez être connecté pour répondre</p>
          <router-link to="/welcome" class="btn-connexion">
            Se connecter
          </router-link>
        </div>
      </div>

      <!-- Erreur -->
      <div v-else-if="error" class="error-page">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BarreNavigation from '@/components/BarreNavigation.vue'
import useDiscussions from '@/composables/useDiscussions'
import useReponses from '@/composables/useReponses'
import getUser from '@/composables/getUser'

// Réactives
const route = useRoute()
const router = useRouter()
const { user } = getUser()
const { obtenirDiscussion, supprimerDiscussion, mettreAJourCompteurReponses } = useDiscussions()
const { obtenirReponses, creerReponse } = useReponses()

const discussion = ref(null)
const reponses = ref([])
const chargement = ref(true)
const error = ref(null)
const nouvelleReponse = ref('')
const errorReponse = ref('')

// Charger la discussion et les réponses au montage
onMounted(async () => {
  try {
    const discussionId = route.params.id
    console.log('Loading discussion:', discussionId)
    discussion.value = await obtenirDiscussion(discussionId)
    console.log('Discussion loaded:', discussion.value)
    reponses.value = await obtenirReponses(discussionId)
    console.log('Reponses loaded:', reponses.value)
    // Mettre à jour le compteur de réponses pour corriger les incohérences
    await mettreAJourCompteurReponses(discussionId)
  } catch (err) {
    error.value = 'Erreur lors du chargement de la discussion.'
  } finally {
    chargement.value = false
  }
})

// Formater la date
const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp.seconds * 1000)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Ajouter une réponse
const handleAjouterReponse = async () => {
  if (!nouvelleReponse.value.trim()) return

  if (!user.value) {
    console.error('User not logged in')
    errorReponse.value = 'Vous devez être connecté pour répondre.'
    return
  }

  console.log('User:', user.value)
  console.log('Adding reponse:', nouvelleReponse.value)
  try {
    const result = await creerReponse(route.params.id, nouvelleReponse.value, user.value.uid, user.value.displayName)
    console.log('Reponse added:', result)
    nouvelleReponse.value = ''
    errorReponse.value = ''
    // Recharger les réponses
    reponses.value = await obtenirReponses(route.params.id)
    console.log('Reponses reloaded:', reponses.value)
  } catch (err) {
    console.error('Error adding response:', err)
    errorReponse.value = 'Erreur lors de l\'ajout de la réponse.'
  }
}

// Supprimer la discussion
const handleSupprimer = async () => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette discussion ?')) return

  try {
    await supprimerDiscussion(route.params.id)
    router.push('/')
  } catch (err) {
    error.value = 'Erreur lors de la suppression de la discussion.'
  }
}
</script>
