import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth } from '@/firebase/config'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'

export const useAuthStore = defineStore('auth', () => {
  // Variable pour stocker l'utilisateur connecté
  const user = ref(null)
  const error = ref('')
  const loading = ref(false)

  // Fonction pour se connecter avec email et mot de passe
  const login = async (email, password) => {
    loading.value = true
    error.value = ''
    try {
      const resultat = await signInWithEmailAndPassword(auth, email, password)
      user.value = resultat.user
      console.log('Utilisateur connecté:', user.value.email)
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        error.value = 'Email ou mot de passe incorrect'
      } else if (err.code === 'auth/wrong-password') {
        error.value = 'Mot de passe incorrect'
      } else {
        error.value = 'Erreur de connexion: ' + err.message
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  // --- MODIFICATION ICI : INSCRIPTION ---
  const signup = async (email, password) => {
    loading.value = true
    error.value = ''
    try {
      // 1. Création du compte
      await createUserWithEmailAndPassword(auth, email, password)
      
      // 2. NOUVEAU : On déconnecte immédiatement l'utilisateur
      await signOut(auth)
      user.value = null
      
      console.log('Compte créé avec succès, déconnexion forcée.')
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        error.value = 'Cet email est déjà utilisé'
      } else if (err.code === 'auth/weak-password') {
        error.value = 'Le mot de passe doit contenir au moins 6 caractères'
      } else {
        error.value = 'Erreur inscription: ' + err.message
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fonction pour se connecter avec Google
  const loginWithGoogle = async () => {
    loading.value = true
    error.value = ''
    try {
      const provider = new GoogleAuthProvider()
      const resultat = await signInWithPopup(auth, provider)
      user.value = resultat.user
      console.log('Connecté avec Google:', user.value.email)
    } catch (err) {
      error.value = 'Erreur connexion Google: ' + err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fonction pour se déconnecter
  const logout = async () => {
    try {
      await signOut(auth)
      user.value = null
      console.log('Déconnexion réussie')
    } catch (err) {
      error.value = 'Erreur déconnexion: ' + err.message
      throw err
    }
  }

  return { 
    user, 
    error, 
    loading, 
    login, 
    signup, 
    loginWithGoogle, 
    logout 
  }
})