// store/auth.ts
import { defineStore } from 'pinia';
import { isClient } from '@vueuse/core';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    payload: null as Record<string, any> | null,
  }),

  actions: {
    login(token: string) {
      this.token = token;
      if (isClient) localStorage.setItem('access_token', token);

      const base64Payload = token.split('.')[1];
      this.payload = JSON.parse(atob(<any>base64Payload)); //a appeler quand on se login
    },

    logout() {
      this.token = null;
      this.payload = null;
      if (isClient) localStorage.removeItem('access_token'); //pour se deco c'est à dire enlever le token du local storage
    },

    init() {
      if (isClient) {
        const token = localStorage.getItem('access_token');
        if (token) this.login(token); //récupère le token au chargement dans le localstorage
      }
    },
  },

  getters: {
    isLoggedIn: (state) => !!state.token, //savoir si c'est le form de login de signin
    identifiant: (state) => state.payload?.identifiant || '', //pour prendre l'identifiant
  },
});
