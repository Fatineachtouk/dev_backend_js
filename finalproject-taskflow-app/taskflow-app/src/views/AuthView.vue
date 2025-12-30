<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const isLogin = ref(true); // Switch entre Login et Inscription

const email = ref('');
const password = ref('');
// NOUVEAU : Variable pour le message de succès
const successMessage = ref('');

const handleSubmit = async () => {
  // On nettoie les messages avant de commencer
  successMessage.value = '';
  authStore.error = '';

  try {
    if (isLogin.value) {
      // --- CAS CONNEXION ---
      await authStore.login(email.value, password.value);
      // Redirection UNIQUEMENT si c'est une connexion
      router.push('/dashboard');
    } else {
      // --- CAS INSCRIPTION ---
      await authStore.signup(email.value, password.value);
      
      // Si l'inscription réussit :
      // 1. On repasse en mode "Connexion"
      isLogin.value = true;
      // 2. On affiche le message de succès
      successMessage.value = "Compte créé avec succès ! Connectez-vous.";
      // 3. On vide le champ mot de passe (sécurité)
      password.value = '';
    }
  } catch (error) {
    // L'erreur est gérée dans le store et affichée via authStore.error
    console.error(error);
  }
};

// Fonction pour basculer entre Login/Signup et nettoyer les messages
const toggleMode = () => {
  isLogin.value = !isLogin.value;
  successMessage.value = '';
  authStore.error = '';
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>{{ isLogin ? 'Connexion' : 'Créer un compte' }}</h2>
      
      <!-- Affichage des erreurs (ROUGE) -->
      <div v-if="authStore.error" class="error-msg">
        {{ authStore.error }}
      </div>

      <!-- NOUVEAU : Affichage du succès (VERT) -->
      <div v-if="successMessage" class="success-msg">
        {{ successMessage }}
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="input-group">
          <label>Email</label>
          <input type="email" v-model="email" placeholder="exemple@mail.com" required />
        </div>
        
        <div class="input-group">
          <label>Mot de passe</label>
          <input type="password" v-model="password" placeholder="******" required />
        </div>

        <button type="submit" class="btn btn-primary w-100" :disabled="authStore.loading">
          {{ authStore.loading ? 'Chargement...' : (isLogin ? 'Se connecter' : "S'inscrire") }}
        </button>
      </form>

      <p class="toggle-text">
        {{ isLogin ? "Pas encore de compte ?" : "Déjà un compte ?" }}
        <!-- On utilise la fonction toggleMode ici -->
        <span @click="toggleMode">{{ isLogin ? "S'inscrire" : "Se connecter" }}</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}

.auth-card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.error-msg {
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 0.5rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

/* NOUVEAU STYLE POUR LE SUCCÈS */
.success-msg {
  background-color: #dcfce7;
  color: #166534;
  padding: 0.5rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  border: 1px solid #bbf7d0;
}

.w-100 { width: 100%; margin-top: 1rem; }

.toggle-text { margin-top: 1.5rem; font-size: 0.9rem; color: var(--text-muted); }
.toggle-text span { color: #4F46E5; cursor: pointer; font-weight: 600; margin-left: 5px; }
.toggle-text span:hover { text-decoration: underline; }

/* Ajout pour la couleur primaire si elle n'est pas globale */
.btn-primary {
  background-color: #4F46E5;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.btn-primary:disabled {
  background-color: #a5a3e4;
  cursor: not-allowed;
}
</style>