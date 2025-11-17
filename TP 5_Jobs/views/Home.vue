<template>
  <div>
    <h1>Liste des Emplois</h1>
    <button @click="goToAdd">Ajouter un Emploi</button>
    
    <div v-for="job in jobs" :key="job.id" class="job-card">
      <h3>{{ job.title }}</h3>
      <p>{{ job.description }}</p>
      <p>Salaire: {{ job.salary }}</p>
      <button @click="goToDetails(job.id)">Voir Détails</button>
    </div>
  </div>
</template>

<script>

import jobs from '../src/jobs.json'

export default {
  data() {
    return {
      jobs: jobs
    }
  },
  methods: {
    goToDetails(id) {
      this.$router.push(`/job/${id}`)
    },
    goToAdd() {
      this.$router.push('/add')
    }
  }
}
</script>

<style scoped>
.job-card {
  border: 1px solid #ccc;
  padding: 15px;
  margin: 10px 0;
}
button {
  padding: 10px;
  margin: 5px;
  cursor: pointer;
}
</style>