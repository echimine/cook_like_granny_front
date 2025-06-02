<template>
  <header class="w-full h-[100px] bg-blue">
    <ul class="flex justify-around items-center w-full h-full gap-4">
      <li><Typographie font="poppins">Titre du site</Typographie></li>
      <li>
        <nav class="flex items-center gap-6">
          <Typographie>se connecter</Typographie>
          <Typographie>se connecter</Typographie>

          <div
            v-if="userIdentifiant"
            class="bg-white p-3 rounded-2xl flex items-center gap-4"
          >
            <div
              class="flex items-center justify-center bg-orange w-[40px] h-[40px] rounded-[50%]"
            >
              <!-- <img
                :src="users.photo"
                alt="Photo de profil"
                class="rounded-full w-20 h-20 object-cover"
              /> -->
            </div>
            <Typographie>{{ userIdentifiant }}</Typographie>
          </div>
          <div v-else><Typographie>se connecter</Typographie></div>
        </nav>
      </li>
    </ul>
  </header>
</template>

<script setup lang="ts">
import Typographie from '../Typographie.vue';
import type { User } from '@/types/user.type';
import { useAuthStore } from '../../store/auth';
const auth = useAuthStore();

const config = useRuntimeConfig();
const isLoggedIn = computed(() => auth.isLoggedIn);
const userIdentifiant = computed(() => auth.identifiant);
console.log(userIdentifiant);
const { data: users } = await useFetch<User[]>(
  `${config.public.apiBase}/users/${userIdentifiant.value}`,
  { immediate: !!userIdentifiant.value }
);
console.log(userIdentifiant.value);
</script>

<style scoped></style>
