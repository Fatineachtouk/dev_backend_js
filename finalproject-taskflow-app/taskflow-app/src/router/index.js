import { createRouter, createWebHistory } from 'vue-router'
// Assure-toi que ces fichiers existent ou seront créés
import AuthView from '../views/AuthView.vue' 
import DashboardView from '../views/DashboardView.vue'
import ProjectDetails from '../views/ProjectDetails.vue'
import { auth } from '../firebase/config'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/auth',  // On appelle ça Auth car ça fait Login + Inscription
      name: 'Auth',
      component: AuthView
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/project/:id', // L'ID unique du projet (ex: project/123abc)
      name: 'ProjectDetails',
      component: ProjectDetails,
      meta: { requiresAuth: true }
    }
  ]
})

// Protection des routes (Guard)
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const user = auth.currentUser // Vérifie si utilisateur connecté via Firebase

  // Note: auth.currentUser peut mettre du temps à charger au refresh.
  // Pour l'instant, on laisse simple.
  if (requiresAuth && !user) {
    next('/auth')
  } else {
    next()
  }
})

export default router