import { ref } from 'vue'
const posts = ref([
    {
        id: 1,
        title: "What is artificial intelligence (AI)?",
        body: "Artificial intelligence (AI) is technology that enables computers and machines to simulate human learning, comprehension, problem solving, decision making, creativity and autonomy. Applications and devices equipped with AI can see and identify objects. They can understand and respond to human language. They can learn from new information and experience. They can make detailed recommendations to users and experts. They can act independently, replacing the need for human intelligence or intervention (a classic example being a self-driving car). But in 2024, most AI researchers, practitioners and most AI-related headlines are focused on breakthroughs in generative AI (gen AI), a technology that can create original text, images, video and other content. To fully understand generative AI, it’s important to first understand the technologies on which generative AI tools are built: machine learning (ML) and deep learning.",
        tags: ["AI"]
    }
  ])
  const getPosts = () =>{
  const error = ref(null)

  const load = async () => {
    try {
      // Récupérer les articles depuis localStorage
      const savedPosts = localStorage.getItem('blog_posts')
      if (savedPosts) {
        posts.value = JSON.parse(savedPosts)
      } else {
        posts.value = []
      }
    } catch (err) {
      error.value = err.message
    }
  }

  return { posts, error, load }
}

export default getPosts