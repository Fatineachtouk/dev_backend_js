<template>
  <nav>
    <h1>Articles</h1>
    <div class="links">
      <router-link to="/">Home</router-link>
      <router-link to="/create">Ajouter un article</router-link>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar'
}
</script>

<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #333;
  color: rgb(255, 251, 251);
}

h1 {
  margin: 0;
}

.links {
  display: flex;
  gap: 20px;
}

.links a {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
}

.links a:hover {
  background-color: #555;
}

.links a.router-link-active {
  background-color: #46a8fe;
}
</style>