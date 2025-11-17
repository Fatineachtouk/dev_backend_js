<template>
  <div class="home">
    <h2 v-if="tagFromRoute">Articles avec le tag: {{ tagFromRoute }}</h2>
    <h2 v-else>Tous les articles</h2>
    
    <div class="layout">
      <PostList :posts="filteredPosts" :error="error" />
      <TagCloud :posts="posts" />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PostList from '../composants/PostList.vue'
import TagCloud from '../composants/TagCloud.vue'
import getPosts from '../composables/getPosts'

export default {
  name: 'Home',
  components: {
    PostList,
    TagCloud
  },
  setup() {
    const route = useRoute()
    const { posts, error, load } = getPosts()
    
    load()

    const tagFromRoute = computed(() => route.params.tag)

    const filteredPosts = computed(() => {
      if (tagFromRoute.value) {
        return posts.value.filter(post => 
          post.tags.includes(tagFromRoute.value)
        )
      }
      return posts.value
    })

    return { posts, filteredPosts, error, tagFromRoute }
  }
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  color: #fdfbfb;
}

.layout {
  display: flex;
  gap: 30px;
}

@media (max-width: 768px) {
  .layout {
    flex-direction: column;
  }
}
</style>