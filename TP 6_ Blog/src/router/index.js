import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import CreatePostView from '../views/CreatePostView.vue'
import PostDetailView from '../views/PostDetailView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/create',
    name: 'CreatePost',
    component: CreatePostView
  },
  {
    path: '/posts/:id',
    name: 'PostDetail',
    component: PostDetailView
  },
  {
    path: '/tags/:tag',
    name: 'TagPosts',
    component: Home
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router