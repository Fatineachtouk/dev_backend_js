<template>
  <div class="post">
    <h3>{{ post.title }}</h3>
    <p class="snippet">{{ snippet }}</p>
    <div class="tags">
      <span v-for="tag in post.tags" :key="tag" class="tag">
        {{ tag }}
      </span>
    </div>
    <router-link :to="{ name: 'PostDetail', params: { id: post.id } }">
      Lire l'article complet
    </router-link>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'SinglePost',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const snippet = computed(() => {
      return props.post.body.substring(0, 50) + '...'
    })

    return { snippet }
  }
}
</script>

<style scoped>
.post {
  padding: 20px;
  margin: 20px 0;
  border: 1px solid #000000;
  border-radius: 8px;
  background-color: rgb(39, 38, 38);
}

h3 {
  margin-top: 0;
  color: #fefefe;
}

.snippet {
  color: #ffffff;
  margin: 10px 0;
}

.tags {
  display: flex;
  gap: 10px;
  margin: 15px 0;
}

.tag {
  background-color: #46a8fe;
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
}

a {
  color: #46a8fe;
  text-decoration: none;
  font-weight: bold;
}

a:hover {
  text-decoration: underline;
}
</style>