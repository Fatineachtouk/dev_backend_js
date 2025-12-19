<template>
  <div class="creer-discussion">
    <BarreNavigation />
    
    <div class="container">
      <div class="form-card">
        <h2>Créer une Nouvelle Discussion</h2>
        
        <form @submit.prevent="handleCreer">
          <div class="form-group">
            <label>Titre de la discussion</label>
            <input 
              type="text" 
              v-model="titre" 
              placeholder="Entrez un titre accrocheur..."
              required
              class="form-input"
            >
          </div>
          
          <div class="form-group">
            <label>Contenu</label>
            <textarea 
              v-model="contenu" 
              placeholder="Décrivez votre question ou sujet..."
              required
              rows="10"
              class="form-textarea"
            ></textarea>
          </div>
          
          <div v-if="error" class="error">{{ error }}</div>
          
          <div class="form-actions">
            <button type="submit" class="btn-publier" :disabled="chargement">
              {{ chargement ? 'Publication...' : 'Publier' }}
            </button>
            <button type="button" @click="$router.push('/')" class="btn-annuler">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BarreNavigation from '@/components/BarreNavigation.vue'
import useDiscussions from '@/composables/useDiscussions'
import getUser from '@/composables/getUser'

const router = useRouter()
const { user } = getUser()
const { error, creerDiscussion } = useDiscussions()

const titre = ref('')
const contenu = ref('')
const chargement = ref(false)

const handleCreer = async () => {
  if (!user.value) {
    alert('Vous devez être connecté')
    router.push('/welcome')
    return
  }
  
  chargement.value = true
  
  const resultat = await creerDiscussion(
    titre.value,
    contenu.value,
    user.value.uid,
    user.value.displayName
  )
  
  chargement.value = false
  
  if (resultat) {
    alert('Discussion créée avec succès !')
    router.push('/')
  }
}
</script>

<style scoped>
.creer-discussion {
  min-height: 100vh;
  background-color: #ecf0f1;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px 20px;
}

.form-card {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.form-card h2 {
  color: #2c3e50;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 600;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus, .form-textarea:focus {
  border-color: #3498db;
}

.form-textarea {
  resize: vertical;
  min-height: 200px;
}

.error {
  color: #e74c3c;
  margin-bottom: 15px;
  padding: 10px;
  background-color: #fadbd8;
  border-radius: 5px;
}

.form-actions {
  display: flex;
  gap: 15px;
}

.btn-publier, .btn-annuler {
  padding: 12px 30px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-publier {
  background-color: #27ae60;
  color: white;
}

.btn-publier:hover:not(:disabled) {
  background-color: #229954;
}

.btn-publier:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-annuler {
  background-color: #95a5a6;
  color: white;
}

.btn-annuler:hover {
  background-color: #7f8c8d;
}
</style>