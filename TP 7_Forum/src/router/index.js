import { createRouter, createWebHistory } from 'vue-router'
import Welcome from '../views/Welcome.vue'
import Accueil from '../views/Accueil.vue'
import CreerDiscussion from '../views/CreerDiscussion.vue'
import VoirDiscussion from '../views/VoirDiscussion.vue'
import { projectAuth } from '../firebase/config'

// Protection des routes
const requireAuth = (to, from, next) => {
  let user = projectAuth.currentUser
  if (!user) {
    next({ name: 'Welcome' })
  } else {
    next()
  }
}

const routes = [
  {
    path: '/',
    name: 'Accueil',
    component: Accueil
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: Welcome
  },
  {
    path: '/creer',
    name: 'CreerDiscussion',
    component: CreerDiscussion,
    beforeEnter: requireAuth
  },
  {
    path: '/discussion/:id',
    name: 'VoirDiscussion',
    component: VoirDiscussion
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router