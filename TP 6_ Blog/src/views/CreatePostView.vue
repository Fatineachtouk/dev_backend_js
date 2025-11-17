<template>
  <div class="create-post">
    <h2>Créer un nouvel article</h2>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Titre:</label>
        <input type="text" v-model="title" required />
      </div>

      <div class="form-group">
        <label>Contenu:</label>
        <textarea v-model="body" rows="10" required></textarea>
      </div>

      <div class="form-group">
        <label>Tags (séparés par des virgules):</label>
        <input type="text" v-model="tagsInput" placeholder="vue, javascript, web" />
      </div>

      <button type="submit">Publier l'article</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'CreatePostView',
  setup() {
    const router = useRouter()
    const title = ref('')
    const body = ref('')
    const tagsInput = ref('')

    const handleSubmit = () => {
      // Convertir les tags en tableau
      const tags = tagsInput.value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const newPost = {
        id: Date.now(), // ID unique basé sur le timestamp
        title: title.value,
        body: body.value,
        tags: tags
      }

      // Récupérer les posts existants depuis localStorage
      const savedPosts = localStorage.getItem('blog_posts')
      let posts = []
      
      if (savedPosts) {
        posts = JSON.parse(savedPosts)
      }
      
      // Ajouter le nouveau post
      posts.push(newPost)
      
      // Sauvegarder dans localStorage
      localStorage.setItem('blog_posts', JSON.stringify(posts))
      
      alert('Article créé avec succès!')
      router.push('/')
    }

    return {
      title,
      body,
      tagsInput,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.create-post {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  color: #ffffff;
}

form {
  background-color: rgb(51, 47, 47);
  padding: 30px;
  border-radius: 8px;
  border: 1px solid #1f1d1d;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #fffefe;
  font-weight: bold;
}

input,
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
}

textarea {
  font-family: inherit;
  resize: vertical;
}

button {
  background-color: #46a8fe;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
}

button:hover {
  background-color: #46a8fe;
}
</style>