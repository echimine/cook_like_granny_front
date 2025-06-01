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
              <div class="bg-gray-500 w-[30px] h-[30px] rounded-[50%]"></div>
            </div>
            <Typographie>{{ userIdentifiant }}</Typographie>
          </div>
          <div v-else>Se connecter</div>
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

const { data: users } = await useFetch<User[]>(
  `${config.public.apiBase}/users`
);
</script>

<style scoped></style>
