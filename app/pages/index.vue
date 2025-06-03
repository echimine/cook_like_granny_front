<template>
  <main class="p-10">
    <div v-if="isLoggedIn" class="mb-4 text-green-500">
      Bonjour, {{ userIdentifiant }} 👋
      <ProfileUser />
    </div>
    <div v-else class="mb-4 text-gray-500">Vous n'êtes pas connecté.</div>

    <button @click="logout" v-if="isLoggedIn" class="btn-secondary">
      Se déconnecter
    </button>

    <!-- form pour se connecter ou créer un compte -->
    <FormPostUser v-if="!isLoggedIn && !showLogin" />
    <FormLoginUser v-if="!isLoggedIn && showLogin" />

    <button
      v-if="!isLoggedIn"
      @click="showLogin = !showLogin"
      class="border-2 p-4 mt-4"
    >
      {{ showLogin ? 'Créer un compte' : 'Se connecter' }}
    </button>

    <!-- liste des users -->
    <h2 class="text-3xl mt-10">Liste des Users</h2>
    <div v-if="userStore.loading">Chargement des utilisateurs...</div>
    <ul>
      <li v-for="user in userStore.users" :key="user.id_user">
        {{ user.identifiant }}
      </li>
    </ul>
  </main>
</template>

<script setup lang="ts">
const showLogin = ref(false);

import { useAuthStore } from '../store/auth';
import { useUserStore } from '../store/user';
const auth = useAuthStore();
const userStore = useUserStore();
const config = useRuntimeConfig();
const isLoggedIn = computed(() => auth.isLoggedIn);
const userIdentifiant = computed(() => auth.identifiant);

const logout = () => auth.logout();

onMounted(() => userStore.getUsers());
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
