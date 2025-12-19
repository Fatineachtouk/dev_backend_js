import { ref } from 'vue'
import { collection, getDocs, addDoc, deleteDoc, writeBatch, orderBy, query, where, doc, updateDoc, increment } from 'firebase/firestore'
import { projectFirestore, serverTimestamp } from '@/firebase/config'

const useReponses = () => {
  const reponses = ref([])
  const error = ref(null)
  const chargement = ref(false)

  // Récupérer toutes les réponses d'une discussion
  const obtenirReponses = async (discussionId) => {
  console.log('Fetching reponses for discussionId:', discussionId)
  chargement.value = true
  error.value = null
  
  try {
    // Temporarily fetch all reponses and filter in code
    const q = query(collection(projectFirestore, 'reponses'))
    const snapshot = await getDocs(q)
    console.log('Total docs in collection:', snapshot.docs.length)
    
    const allReponses = snapshot.docs.map(doc => {
      const data = doc.data()
      console.log('Reponse doc:', doc.id, 'full data:', data)
      return {
        id: doc.id,
        ...data
      }
    })
    
    const reps = allReponses.filter(r => {
      const matches = r.discussionId === discussionId
      console.log('Filtering reponse:', r.id, 'discussionId:', r.discussionId, 'matches:', matches, 'target:', discussionId)
      return matches
    }).sort((a, b) => {
      const aTime = a.dateCreation?.seconds || a.dateCreation;
      const bTime = b.dateCreation?.seconds || b.dateCreation;
      return aTime - bTime;
    });
    
    console.log('Filtered reponses for discussionId:', reps.length, reps)
    reponses.value = reps
    return reps
  } catch (err) {
    console.error('Erreur lors du chargement des réponses:', err)
    error.value = 'Impossible de charger les réponses'
    return []
  } finally {
    chargement.value = false
  }
}

// Créer une nouvelle réponse
const creerReponse = async (discussionId, contenu, auteurId, auteurNom) => {
  console.log('Creating response:', { discussionId, contenu, auteurId, auteurNom })
  error.value = null
  
  try {
    const nouvelleReponse = {
      discussionId,
      contenu,
      auteurId,
      auteurNom,
      dateCreation: serverTimestamp()
    }
    
    console.log('Adding to Firestore...')
    // Ajouter la réponse
    const docRef = await addDoc(collection(projectFirestore, 'reponses'), nouvelleReponse)
    console.log('Document added with ID:', docRef.id)
    
    // Incrémenter le compteur de réponses de la discussion
    const discussionRef = doc(projectFirestore, 'discussions', discussionId)
    await updateDoc(discussionRef, {
      nombreReponses: increment(1)
    })
    console.log('Discussion counter incremented')
    
    return { id: docRef.id, ...nouvelleReponse }
  } catch (err) {
    console.error('Erreur lors de la création de la réponse:', err)
    error.value = 'Impossible de créer la réponse'
    return null
  }
}

  // Supprimer une réponse
  const supprimerReponse = async (reponseId, discussionId) => {
    error.value = null
    
    try {
      await deleteDoc(doc(projectFirestore, 'reponses', reponseId))
      
      // Décrémenter le compteur de réponses
      const discussionRef = doc(projectFirestore, 'discussions', discussionId)
      await updateDoc(discussionRef, {
        nombreReponses: increment(-1)
      })
      
      return true
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
      error.value = 'Impossible de supprimer la réponse'
      return false
    }
  }

  return {
    reponses,
    error,
    chargement,
    obtenirReponses,
    creerReponse,
    supprimerReponse
  }
}

export default useReponses