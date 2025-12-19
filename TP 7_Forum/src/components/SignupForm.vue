<template>
  <div class="welcome container">
    <form @submit.prevent="handleSignup">
      <input type="text" required placeholder="Nom d'utilisateur" v-model="displayName">
      <input type="email" required placeholder="Votre email" v-model="email">
      <input type="password" required placeholder="Votre mot de passe" v-model="password">
      <button>S'inscrire</button>
      <div class="error">{{ error }}</div>
    </form>
  </div>
</template>

<script setup>
import useSignup from '@/composables/useSignup';
import { ref } from 'vue';

const displayName = ref('')
const email = ref('email@uca.ac.ama')
const password = ref('')
const {error, signup} = useSignup()

const emit = defineEmits(['signup']);

const handleSignup = async () => {
  const response = await signup(email.value, password.value, displayName.value)
  if(!error.value){
    console.log("USER SIGNUP SUCCESS")
    emit('signup')
  }else {
    console.log("USER SIGNUP FAILED")
  }
}
</script>

<style>
.error {
  color: #ff4757;
  margin-top: 10px;
  font-size: 14px;
}
</style>