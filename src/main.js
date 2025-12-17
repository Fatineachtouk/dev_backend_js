import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

console.log('Starting Vue app...')
const app = createApp(App)
console.log('Using router...')
app.use(router)
console.log('Mounting to #app...')
app.mount('#app')
console.log('App mounted successfully')