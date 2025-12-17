import { ref } from 'vue'
import { collection, getDocs, addDoc, doc, getDoc, deleteDoc, writeBatch, orderBy, query, where, updateDoc, increment } from 'firebase/firestore'
import { projectFirestore, serverTimestamp } from '@/firebase/config'

const useDiscussions = () => {
  const discussions = ref([])
  const error = ref(null)
  const chargement = ref(false)

  // Récupérer toutes les discussions
  const obtenirDiscussions = async () => {
    chargement.value = true
    error.value = null
    
    try {
      const q = query(collection(projectFirestore, 'discussions'), orderBy('dateCreation', 'desc'))
      const snapshot = await getDocs(q)
      
      const discs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      discussions.value = discs
      return discs
    } catch (err) {
      console.error('Erreur lors du chargement des discussions:', err)
      // If Firestore permission error, give actionable guidance
      if (err && err.code === 'permission-denied') {
        error.value = "Impossible de charger les discussions — accès refusé. Vérifiez les règles Firestore et autorisez la lecture publique pour la collection 'discussions'."
      } else {
        error.value = 'Impossible de charger les discussions'
      }
      return []
    } finally {
      chargement.value = false
    }
  }

  // Créer une nouvelle discussion
  const creerDiscussion = async (titre, contenu, auteurId, auteurNom) => {
    error.value = null
    
    try {
      const nouvelleDiscussion = {
        titre,
        contenu,
        auteurId,
        auteurNom,
        dateCreation: serverTimestamp(),
        nombreReponses: 0
      }
      
      const docRef = await addDoc(collection(projectFirestore, 'discussions'), nouvelleDiscussion)
      
      return { id: docRef.id, ...nouvelleDiscussion }
    } catch (err) {
      console.error('Erreur lors de la création:', err)
      error.value = 'Impossible de créer la discussion'
      return null
    }
  }

  // Supprimer une discussion
  const supprimerDiscussion = async (discussionId) => {
    error.value = null
    
    try {
      // Supprimer d'abord toutes les réponses
      const q = query(collection(projectFirestore, 'reponses'), where('discussionId', '==', discussionId))
      const reponsesSnapshot = await getDocs(q)
      
      const batch = writeBatch(projectFirestore)
      reponsesSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref)
      })
      
      // Supprimer la discussion
      const discussionRef = doc(projectFirestore, 'discussions', discussionId)
      batch.delete(discussionRef)
      
      await batch.commit()
      return true
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
      error.value = 'Impossible de supprimer la discussion'
      return false
    }
  }

  // Mettre à jour le compteur de réponses pour une discussion
  const mettreAJourCompteurReponses = async (discussionId) => {
    error.value = null
    
    try {
      // Compter les réponses actuelles dans la collection 'reponses'
      const q = query(collection(projectFirestore, 'reponses'), where('discussionId', '==', discussionId))
      const snapshot = await getDocs(q)
      const count = snapshot.docs.length
      
      // Mettre à jour le compteur dans la discussion
      const discussionRef = doc(projectFirestore, 'discussions', discussionId)
      await updateDoc(discussionRef, {
        nombreReponses: count
      })
      
      console.log(`Updated response count for discussion ${discussionId} to ${count}`)
      return count
    } catch (err) {
      console.error('Erreur lors de la mise à jour du compteur:', err)
      error.value = 'Impossible de mettre à jour le compteur'
      return null
    }
  }

  // Récupérer une discussion par id
  const obtenirDiscussion = async (discussionId) => {
    error.value = null

    try {
      const discussionRef = doc(projectFirestore, 'discussions', discussionId)
      const snap = await getDoc(discussionRef)

      if (!snap.exists()) {
        error.value = 'Discussion introuvable'
        return null
      }

      return { id: snap.id, ...snap.data() }
    } catch (err) {
      console.error('Erreur lors de la récupération de la discussion:', err)
      error.value = 'Impossible de charger la discussion'
      return null
    }
  }

  return {
    discussions,
    error,
    chargement,
    obtenirDiscussions,
    creerDiscussion,
    supprimerDiscussion,
    obtenirDiscussion,
    mettreAJourCompteurReponses
  }
}

export default useDiscussions