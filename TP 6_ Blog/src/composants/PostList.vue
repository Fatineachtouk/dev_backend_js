<template>
  <div class="post-list">
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="posts.length">
      <SinglePost v-for="post in posts" :key="post.id" :post="post" />
    </div>
    <div v-else class="no-posts">
      <p>Aucun article pour le moment</p>
      <p>Créez votre premier article en cliquant sur "Ajouter un article"</p>
    </div>
  </div>
</template>

<script>
import SinglePost from './SinglePost.vue'

export default {
  name: 'PostList',
  components: {
    SinglePost
  },
  props: {
    posts: {
      type: Array,
      required: true
    },
    error: {
      type: String,
      default: null
    }
  }
}
</script>

<style scoped>
.post-list {
  flex: 1;
}

.error {
  color: red;
  padding: 10px;
  background-color: rgb(63, 62, 62);
  border-radius: 4px;
  margin-bottom: 20px;
}

.no-posts {
  text-align: center;
  padding: 40px;
  background-color: rgb(47, 46, 46);
  border-radius: 8px;
  border: 1px solid #060606;
}

.no-posts p {
  margin: 10px 0;
  color: #f8f8f8;
}

.no-posts p:first-child {
  font-size: 20px;
  font-weight: bold;
  color: #f4f0f0;
}
</style>