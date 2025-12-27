import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '@/firebase/config'
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore'

export const useTaskStore = defineStore('tasks', () => {
  // Liste de toutes les tâches du projet actuel
  const tasks = ref([])
  const loading = ref(false)
  const error = ref('')

  let unsubscribeTasks = null

  // Fonction pour charger les tâches d'un projet en temps réel
  const loadTasks = (projectId) => {
    loading.value = true
    
    // Arrêter l'écoute précédente si elle existe
    if (unsubscribeTasks) {
      unsubscribeTasks()
    }

    // Référence vers la sous-collection tasks d'un projet
    const tasksRef = collection(db, 'projects', projectId, 'tasks')

    // Écouter les changements en temps réel
    unsubscribeTasks = onSnapshot(tasksRef, (snapshot) => {
      tasks.value = []
      snapshot.forEach((doc) => {
        tasks.value.push({
          id: doc.id,
          ...doc.data()
        })
      })
      loading.value = false
      console.log('Tâches chargées:', tasks.value.length)
    }, (err) => {
      error.value = 'Erreur chargement tâches: ' + err.message
      loading.value = false
    })
  }

  // Fonction pour créer une nouvelle tâche
  const createTask = async (projectId, title, description, dueDate) => {
    try {
      const tasksRef = collection(db, 'projects', projectId, 'tasks')
      const docRef = await addDoc(tasksRef, {
        title: title,
        description: description,
        dueDate: dueDate,
        status: 'todo', // Par défaut dans "À faire"
        createdAt: serverTimestamp()
      })
      console.log('Tâche créée avec ID:', docRef.id)
      return docRef.id
    } catch (err) {
      error.value = 'Erreur création tâche: ' + err.message
      throw err
    }
  }

  // Fonction pour modifier une tâche (ex: changer le statut)
  const updateTask = async (projectId, taskId, updates) => {
    try {
      const taskRef = doc(db, 'projects', projectId, 'tasks', taskId)
      await updateDoc(taskRef, updates)
      console.log('Tâche modifiée:', taskId)
    } catch (err) {
      error.value = 'Erreur modification tâche: ' + err.message
      throw err
    }
  }

  // Fonction pour supprimer une tâche
  const deleteTask = async (projectId, taskId) => {
    try {
      const taskRef = doc(db, 'projects', projectId, 'tasks', taskId)
      await deleteDoc(taskRef)
      console.log('Tâche supprimée:', taskId)
    } catch (err) {
      error.value = 'Erreur suppression tâche: ' + err.message
      throw err
    }
  }

  // Fonction pour arrêter d'écouter les changements
  const stopListening = () => {
    if (unsubscribeTasks) {
      unsubscribeTasks()
      unsubscribeTasks = null
    }
  }

  return {
    tasks,
    loading,
    error,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    stopListening
  }
})