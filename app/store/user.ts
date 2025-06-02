// store/user.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '@/types/user.type';
import { useRuntimeConfig } from '#imports'; // si tu es en Nuxt 3

export const useUserStore = defineStore('user', () => {
  const config = useRuntimeConfig(); //pour nextconfig

  const users = ref<User[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function getUsers() {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${config.public.apiBase}/users`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des utilisateurs');
      }
      const data = await response.json();
      users.value = data;
    } catch (err: any) {
      error.value = err.message || 'Erreur inconnue';
    } finally {
      loading.value = false;
    }
  }

  return {
    users,
    loading,
    error,
    getUsers,
  };
});
