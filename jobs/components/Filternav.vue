<template>
  <nav>
    <router-link to="/">Accueil</router-link>
  </nav>
</template>

<script>
export default {
  name: 'Filternav'
}
</script>

<style scoped>
nav {
  padding: 20px;
  background-color: #333;
}
a {
  color: white;
  text-decoration: none;
  padding: 10px;
}
</style>