<template>
  <div class="login-form mt-6 max-w-md">
    <h2 class="text-2xl font-semibold mb-4">Connexion</h2>

    <form @submit.prevent="login" class="space-y-4">
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
        placeholder="Mot de passe"
        class="input"
        required
      />

      <input
        v-model="role"
        type="text"
        placeholder="role"
        class="input"
        required
        disabled
      />
      <button type="submit" class="btn btn-primary w-full">Se connecter</button>
    </form>

    <p v-if="error" class="text-red-500 mt-4">Erreur : {{ error }}</p>
    <p v-if="success" class="text-green-500 mt-4">Connexion réussie !</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // si tu veux rediriger après login
import { useAuthStore } from '../../store/auth';
const auth = useAuthStore();
const config = useRuntimeConfig();

const identifiant = ref('');
const password = ref('');
const role = ref('user');
const error = ref<string | null>(null);
const success = ref(false);
const router = useRouter(); // optionnel

async function login() {
  error.value = null;
  success.value = false;
  console.log(identifiant.value, password.value, role.value);
  try {
    const { data, error: fetchError } = await useFetch<{
      access_token: string;
    }>(`${config.public.apiBase}/auth/login`, {
      method: 'POST',
      body: {
        identifiant: identifiant.value,
        password: password.value,
        role: role.value,
      },
    });

    if (fetchError.value) {
      throw new Error(fetchError.value.data?.message || 'Erreur inconnue');
    }

    // Stocke le token dans localStorage (ou cookie)
    auth.login(data.value!.access_token);

    success.value = true;

    // Facultatif : rediriger ou notifier le parent
    // router.push('/dashboard') ou émettre un event

    identifiant.value = '';
    password.value = '';
  } catch (err: any) {
    error.value = err.message;
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
  background-color: #ff5f1f;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}
</style>
