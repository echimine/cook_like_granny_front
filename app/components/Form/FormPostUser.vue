<template>

    <h1 class="text-3xl py-4">Créer un utilisateur</h1>

    <form @submit.prevent="submitForm" class="space-y-4 max-w-md">
      <input
        v-model="identifiant"
        type="text"
        placeholder="Identifiant"
        class="input"
        required
      />
      <input
        v-model="password"
        type="password"
        placeholder="password"
        class="input"
      />
      <input
        v-model="role"
        disabled
        type="text"
        placeholder="role"
        class="input"
      />
      <button type="submit" class="btn btn-primary">Envoyer</button>
    </form>

    <p v-if="error" class="text-red-500 mt-4">Erreur : {{ error.message }}</p>
    <p v-if="success" class="text-green-500 mt-4">
      Utilisateur créé avec succès !
    </p>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { User } from '@/types/user.type';

const config = useRuntimeConfig();

const identifiant = ref('');
const password = ref('');
const role = ref('user');

const error = ref<Error | null>(null);
const success = ref(false);

async function submitForm() {
  error.value = null;
  success.value = false;
  try {
    const { data, error: fetchError } = await useFetch<User>(
      `${config.public.apiBase}/users`,
      {
        method: 'POST',
        body: {
          identifiant: identifiant.value,
          password: password.value,
          role: role.value,
        },
      }
    );
    if (fetchError.value) {
      // Essaie d'extraire un message d'erreur clair
      const backendMessage =
        fetchError.value.data?.message || 'Erreur inconnue';
      throw new Error(backendMessage);
    }
    success.value = true;
    identifiant.value = '';
    password.value = '';
    role.value = '';
  } catch (err) {
    error.value = err as Error;
  }
}
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn-primary {
  background-color: #008fd2;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
</style>
