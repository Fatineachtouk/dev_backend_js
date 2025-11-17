<template>
  <div class="tag-cloud">
    <h3>Tags</h3>
    <div v-if="tags.length" class="tags">
      <router-link 
        v-for="tag in tags" 
        :key="tag" 
        :to="{ name: 'TagPosts', params: { tag: tag } }"
        class="tag"
      >
        {{ tag }}
      </router-link>
    </div>
    <div v-else class="no-tags">
      <p>Aucun tag disponible</p>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'TagCloud',
  props: {
    posts: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const tags = computed(() => {
      // Extraire tous les tags de tous les posts
      const allTags = []
      props.posts.forEach(post => {
        if (post.tags) {
          allTags.push(...post.tags)
        }
      })
      
      // Retourner les tags uniques
      return [...new Set(allTags)]
    })

    return { tags }
  }
}
</script>

<style scoped>
.tag-cloud {
  background-color: rgb(44, 43, 43);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ddd;
  min-width: 200px;
}

h3 {
  margin-top: 0;
  color: #fafafa;
}

.tags {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tag {
  background-color: #46a8fe;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  text-decoration: none;
  text-align: center;
  transition: background-color 0.3s;
}

.tag:hover {
  background-color: #46a8fe;
}

.no-tags {
  text-align: center;
  padding: 20px;
  color: #fffcfc;
  font-style: italic;
}
</style>