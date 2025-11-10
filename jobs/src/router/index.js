import { createRouter, createWebHistory } from 'vue-router'
// router file is inside src/router — project `views` and `components` are at the repository root
import Home from '../../views/Home.vue'
import Jobdetail from '../../components/Jobdetail.vue'
import Addjob from '../../views/Addjob.vue'
import Editjob from '../../views/Editjob.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/job/:id',
    name: 'Jobdetail',
    component: Jobdetail
  },
  {
    path: '/add',
    name: 'Addjob',
    component: Addjob
  },
  {
    path: '/edit/:id',
    name: 'Editjob',
    component: Editjob
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router