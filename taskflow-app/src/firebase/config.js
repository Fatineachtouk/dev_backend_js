import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Étudiants, remplacez ceci par votre propre config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCeT8gCdiNbZhAU-t_XflJeQDZPzr-Oq1U",
  authDomain: "taskflow-app-a1ccd.firebaseapp.com",
  projectId: "taskflow-app-a1ccd",
  storageBucket: "taskflow-app-a1ccd.firebasestorage.app",
  messagingSenderId: "172879662264",
  appId: "1:172879662264:web:0681bafa7e12f6e271784d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };