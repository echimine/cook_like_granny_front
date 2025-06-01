// composables/useAuth.ts
import { useState, onMounted } from '#imports';

export function useAuth() {
  const token = useState<string | null>('auth_token', () => null);

  const setToken = (newToken: string) => {
    token.value = newToken;
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', newToken);
    }
  };

  const clearToken = () => {
    token.value = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  };

  const loadTokenFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('access_token');
      if (stored) token.value = stored;
    }
  };

  onMounted(() => {
    if (!token.value) {
      loadTokenFromLocalStorage();
    }
  });

  const getPayload = (): { identifiant?: string } | null => {
    if (!token.value) return null;
    try {
      const base64Payload = <any>token.value.split('.')[1];
      const jsonPayload = atob(base64Payload);
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  const isLoggedIn = computed(() => !!token.value);

  return {
    token,
    setToken,
    clearToken,
    isLoggedIn,
    getPayload,
  };
}
