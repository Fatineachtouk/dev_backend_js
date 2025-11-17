<template>
  <div id="app">
    <Filternav />
    <router-view />
  </div>
</template>

<script>
// Filternav lives at the repository root `components/` folder; from `src/` go up one level
import Filternav from '../components/Filternav.vue'

export default {
  name: 'App',
  components: {
    Filternav
  }
}
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
}
</style>