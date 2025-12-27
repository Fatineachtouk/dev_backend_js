<script setup>
import { ref } from 'vue'
// TODO: Étudiants -> Créez un 'taskStore' pour gérer ces données avec Firestore
const tasks = ref([
  { id: 1, title: 'Exemple Tâche', status: 'todo' }
])
</script>

<template>
  <div class="dashboard">
    <h1>Tableau de bord</h1>
    <div class="kanban">
      <div class="column">
        <h3>À Faire</h3>
        <div class="card" v-for="task in tasks" :key="task.id">
          {{ task.title }}
        </div>
      </div>
      <div class="column"><h3>En Cours</h3></div>
      <div class="column"><h3>Terminé</h3></div>
    </div>
  </div>
</template>

<style scoped>
.kanban { display: flex; gap: 1rem; }
.column { flex: 1; background: #f4f4f4; padding: 1rem; min-height: 300px; }
.card { background: white; padding: 0.5rem; margin-bottom: 0.5rem; border: 1px solid #ddd; }
</style>