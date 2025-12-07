const firebaseConfig = {
  apiKey: "AIzaSyDrNW7sh1bSZxXgs33z3N4SkbPji-qM6Uc",
  authDomain: "ensa-safi-vote.firebaseapp.com",
  projectId: "ensa-safi-vote",
  storageBucket: "ensa-safi-vote.firebasestorage.app",
  messagingSenderId: "327668176584",
  appId: "1:327668176584:web:796dbb06ed33b5f818b7fd"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);

// Créer des références pour utiliser Firebase facilement
const auth = firebase.auth();
const db = firebase.firestore();

