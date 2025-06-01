<template>
  <main class="p-10">
    <div v-if="isLoggedIn" class="mb-4 text-green-500">
      Bonjour, {{ userIdentifiant }} 👋
    </div>
    <div v-else class="mb-4 text-gray-500">Vous n'êtes pas connecté.</div>

    <button @click="logout" v-if="isLoggedIn" class="btn-secondary">
      Se déconnecter
    </button>

    <FormLoginUser v-if="!isLoggedIn" />
    <FormPostUser v-if="isLoggedIn" />

    <h2 class="text-3xl mt-10">Liste des Users</h2>
    <ul class="mt-4 px-4">
      <li v-for="user in users" :key="user.id_user">{{ user.identifiant }}</li>
    </ul>
  </main>
</template>

<script setup lang="ts">
import type { User } from '@/types/user.type';
import { useAuthStore } from '../store/auth';
const auth = useAuthStore();

const config = useRuntimeConfig();
const isLoggedIn = computed(() => auth.isLoggedIn);
const userIdentifiant = computed(() => auth.identifiant);

const logout = () => auth.logout();

const { data: users } = await useFetch<User[]>(
  `${config.public.apiBase}/users`
);
</script>

<style scoped>
.btn-secondary {
  background-color: #ccc;
  color: black;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}
</style>
