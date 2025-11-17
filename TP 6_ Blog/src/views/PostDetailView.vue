<template>
  <div class="post-detail">
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="post" class="layout">
      <div class="content">
        <h1>{{ post.title }}</h1>
        <div class="tags">
          <span v-for="tag in post.tags" :key="tag" class="tag">
            {{ tag }}
          </span>
        </div>
        <p class="body">{{ post.body }}</p>
        <router-link to="/" class="back-link">← Retour à l'accueil</router-link>
      </div>
      <TagCloud :posts="allPosts" />
    </div>
    <div v-else-if="!error">
      <p>Chargement...</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import TagCloud from '../composants/TagCloud.vue'
import getPost from '../composables/getPost'
import getPosts from '../composables/getPosts'

export default {
  name: 'PostDetailView',
  components: {
    TagCloud
  },
  setup() {
    const route = useRoute()
    const { post, error, load } = getPost(route.params.id)
    const { posts: allPosts, load: loadAll } = getPosts()
    
    load()
    loadAll()

    return { post, error, allPosts }
  }
}
</script>

<style scoped>
.post-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.layout {
  display: flex;
  gap: 30px;
}

.content {
  flex: 1;
  background-color: rgb(46, 45, 45);
  padding: 30px;
  border-radius: 8px;
  border: 1px solid #000000;
}

h1 {
  margin-top: 0;
  color: #fffdfd;
}

.tags {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}

.tag {
  background-color: #46a8fe;
  color: white;
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 14px;
}

.body {
  line-height: 1.8;
  color: #fcfbfb;
  font-size: 18px;
  margin: 30px 0;
}

.back-link {
  color: #46a8fe;
  text-decoration: none;
  font-weight: bold;
}

.back-link:hover {
  text-decoration: underline;
}

.error {
  color: red;
  padding: 20px;
  background-color: rgb(61, 59, 59);
  border-radius: 8px;
}

@media (max-width: 768px) {
  .layout {
    flex-direction: column;
  }
}
</style>