<template>
  <div v-if="job">
    <h1>{{ job.title }}</h1>
    <p><strong>Description:</strong> {{ job.description }}</p>
    <p><strong>Salaire:</strong> {{ job.salary }}</p>
    <p><strong>Expérience:</strong> {{ job.experienceYears }} ans</p>
    <p><strong>Date de création:</strong> {{ job.createdAt }}</p>
    
    <button @click="goToEdit">Modifier</button>
    <button @click="deleteJob">Supprimer</button>
    <button @click="goBack">Retour</button>
  </div>
</template>

<script>
// jobs.json is located in `src/` so from `components/` use ../src/
import jobs from '../src/jobs.json'

export default {
  data() {
    return {
      job: null
    }
  },
  mounted() {
    const id = parseInt(this.$route.params.id)
    this.job = jobs.find(j => j.id === id)
  },
  methods: {
    goToEdit() {
      this.$router.push(`/edit/${this.job.id}`)
    },
    deleteJob() {
      if (confirm('Voulez-vous vraiment supprimer cet emploi ?')) {
        this.$router.push('/')
      }
    },
    goBack() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
button {
  padding: 10px;
  margin: 5px;
  cursor: pointer;
}
</style>