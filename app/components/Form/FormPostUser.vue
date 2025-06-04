<template>
  <h2 class="text-2xl font-semibold mb-4">Créer un compte</h2>
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

    <button
      type="submit"
      :disabled="userStore.loading"
      class="bg-blue py-2 px-4 rounded-lg"
    >
      {{ userStore.loading ? 'Chargement...' : 'Envoyer' }}
    </button>

    <p v-if="error" class="text-red-500">{{ error.message }}</p>
    <p v-if="success" class="text-green-500">Utilisateur créé avec succès !</p>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
const auth = useAuthStore();
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
    // 1. Créer l'utilisateur
    const { error: createError } = await useFetch(
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

    if (createError.value) {
      const backendMessage =
        createError.value.data?.message || 'Erreur à la création du compte';
      throw new Error(backendMessage);
    }

    // 2. Connexion automatique
    const { data: loginData, error: loginError } = await useFetch<{
      access_token: string;
    }>(`${config.public.apiBase}/auth/login`, {
      method: 'POST',
      body: {
        identifiant: identifiant.value,
        password: password.value,
      },
    });

    if (loginError.value) {
      throw new Error(loginError.value.data?.message || 'Erreur lors du login');
    }

    auth.login(loginData.value!.access_token);

    // 3. Rappelle la fonction getUsers() du store user
    await userStore.getUsers();

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
