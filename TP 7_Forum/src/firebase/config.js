import { initializeApp } from 'firebase/app'
import { getFirestore, serverTimestamp } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCRnMA2kCwSh3mqB0k-Zh5yJ9UrSeO38sI",
  authDomain: "forum-cdf6a.firebaseapp.com",
  projectId: "forum-cdf6a",
  storageBucket: "forum-cdf6a.firebasestorage.app",
  messagingSenderId: "568112669666",
  appId: "1:568112669666:web:b2288d82ba3c4de02b4fbb"
}

// Initialiser Firebase
const app = initializeApp(firebaseConfig)

// Initialiser les services
const projectAuth = getAuth(app)
const projectFirestore = getFirestore(app)

// Configurer le timestamp (utiliser serverTimestamp du SDK modular)
const timestamp = serverTimestamp

export { projectAuth, projectFirestore, timestamp, serverTimestamp }