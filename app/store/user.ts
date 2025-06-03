import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '@/types/user.type';
import { useRuntimeConfig } from '#imports';

export const useUserStore = defineStore('user', () => {
  const config = useRuntimeConfig();

  const users = ref<User[]>([]);
  const userDetail = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Récupère tous les utilisateurs
  async function getUsers() {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${config.public.apiBase}/users`);
      if (!response.ok)
        throw new Error('Erreur lors du chargement des utilisateurs');
      const data = await response.json();
      users.value = data;
    } catch (err: any) {
      error.value = err.message || 'Erreur inconnue';
    } finally {
      loading.value = false;
    }
  }

  // Récupère un utilisateur par identifiant
  async function getUserDetail(identifiant: string) {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(
        `${config.public.apiBase}/users/by-identifiant/${identifiant}`
      );
      if (!response.ok)
        throw new Error('Erreur lors du chargement de l’utilisateur');
      const data = await response.json();
      userDetail.value = data;
    } catch (err: any) {
      error.value = err.message || 'Erreur inconnue';
    } finally {
      loading.value = false;
    }
  }

  return {
    users,
    userDetail,
    loading,
    error,
    getUsers,
    getUserDetail,
  };
});
