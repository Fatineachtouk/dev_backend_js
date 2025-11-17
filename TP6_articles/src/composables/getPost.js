import { ref } from 'vue'

const getPost = (id) => {
  const post = ref(null)
  const error = ref(null)

  const load = async () => {
    try {
      // Récupérer les articles depuis localStorage
      const savedPosts = localStorage.getItem('blog_posts')
      if (savedPosts) {
        const allPosts = JSON.parse(savedPosts)
        post.value = allPosts.find(p => p.id == id)
        
        if (!post.value) {
          throw new Error('Article non trouvé')
        }
      } else {
        throw new Error('Aucun article trouvé')
      }
    } catch (err) {
      error.value = err.message
    }
  }

  return { post, error, load }
}

export default getPost