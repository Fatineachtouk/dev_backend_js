<template>
  <div v-if="job">
    <h1>Modifier l'Emploi</h1>
    <form @submit.prevent="editJob">
      <div>
        <label>Titre:</label>
        <input v-model="job.title" required />
      </div>
      
      <div>
        <label>Description:</label>
        <textarea v-model="job.description" required></textarea>
      </div>
      
      <div>
        <label>Salaire:</label>
        <input v-model="job.salary" required />
      </div>
      
      <div>
        <label>Années d'expérience:</label>
        <input v-model.number="job.experienceYears" type="number" required />
      </div>
      
      <div>
        <label>Date de création:</label>
        <input v-model="job.createdAt" type="date" required />
      </div>
      
      <button type="submit">Modifier</button>
      <button type="button" @click="goBack">Annuler</button>
    </form>
  </div>
</template>

<script>
// jobs.json is located in `src/` so from `views/` use ../src/
import jobs from '../src/jobs.json'

export default {
  data() {
    return {
      job: null
    }
  },
  mounted() {
    const id = parseInt(this.$route.params.id)
    const foundJob = jobs.find(j => j.id === id)
    this.job = { ...foundJob }
  },
  methods: {
    editJob() {
      alert('Emploi modifié !')
      this.$router.push(`/job/${this.job.id}`)
    },
    goBack() {
      this.$router.push(`/job/${this.job.id}`)
    }
  }
}
</script>

<style scoped>
div {
  margin: 10px 0;
}
label {
  display: block;
  margin-bottom: 5px;
}
input, textarea {
  width: 100%;
  padding: 8px;
}
button {
  padding: 10px;
  margin: 5px;
  cursor: pointer;
}
</style>