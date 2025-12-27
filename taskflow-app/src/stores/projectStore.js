import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '@/firebase/config'
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore'

export const useProjectStore = defineStore('projects', () => {
  // Liste de tous les projets de l'utilisateur
  const projects = ref([])
  const loading = ref(false)
  const error = ref('')

  // Variable pour stocker l'unsubscribe de Firestore
  let unsubscribeProjects = null

  // Fonction pour charger les projets en temps réel
  const loadProjects = (userId) => {
    loading.value = true
    
    // Si on écoute déjà, on arrête d'abord
    if (unsubscribeProjects) {
      unsubscribeProjects()
    }

    // Créer une requête pour récupérer seulement les projets de cet utilisateur
    const q = query(
      collection(db, 'projects'), 
      where('userId', '==', userId)
    )

    // Écouter les changements en temps réel
    unsubscribeProjects = onSnapshot(q, (snapshot) => {
      projects.value = []
      snapshot.forEach((doc) => {
        // Ajouter chaque projet avec son ID
        projects.value.push({
          id: doc.id,
          ...doc.data()
        })
      })
      loading.value = false
      console.log('Projets chargés:', projects.value.length)
    }, (err) => {
      error.value = 'Erreur chargement projets: ' + err.message
      loading.value = false
    })
  }

  // Fonction pour créer un nouveau projet
  const createProject = async (userId, name, description, color) => {
    try {
      // Ajouter le projet dans Firestore
      const docRef = await addDoc(collection(db, 'projects'), {
        name: name,
        description: description,
        color: color,
        userId: userId,
        createdAt: serverTimestamp()
      })
      console.log('Projet créé avec ID:', docRef.id)
      return docRef.id
    } catch (err) {
      error.value = 'Erreur création projet: ' + err.message
      throw err
    }
  }

  // Fonction pour modifier un projet
  const updateProject = async (projectId, updates) => {
    try {
      const projectRef = doc(db, 'projects', projectId)
      await updateDoc(projectRef, updates)
      console.log('Projet modifié:', projectId)
    } catch (err) {
      error.value = 'Erreur modification projet: ' + err.message
      throw err
    }
  }

  // Fonction pour supprimer un projet
  const deleteProject = async (projectId) => {
    try {
      await deleteDoc(doc(db, 'projects', projectId))
      console.log('Projet supprimé:', projectId)
    } catch (err) {
      error.value = 'Erreur suppression projet: ' + err.message
      throw err
    }
  }

  // Fonction pour arrêter d'écouter les changements
  const stopListening = () => {
    if (unsubscribeProjects) {
      unsubscribeProjects()
      unsubscribeProjects = null
    }
  }

  return {
    projects,
    loading,
    error,
    loadProjects,
    createProject,
    updateProject,
    deleteProject,
    stopListening
  }
})