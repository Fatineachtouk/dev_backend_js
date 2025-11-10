<template>
  <div>
    <h1>Ajouter un Emploi</h1>
    <form @submit.prevent="addJob">
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
      
      <button type="submit">Ajouter</button>
      <button type="button" @click="goBack">Annuler</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      job: {
        title: '',
        description: '',
        salary: '',
        experienceYears: 0,
        createdAt: ''
      }
    }
  },
  mounted() {
    const today = new Date().toISOString().split('T')[0]
    this.job.createdAt = today
  },
  methods: {
    addJob() {
      alert('Emploi ajouté !')
      this.$router.push('/')
    },
    goBack() {
      this.$router.push('/')
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