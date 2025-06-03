<template>
  <div v-if="user">
    <h2 class="text-2xl font-bold mb-4">Mon Profil</h2>
    <p><strong>Identifiant :</strong> {{ user.identifiant }}</p>
    <p><strong>Role :</strong> {{ user.role }}</p>
    <img v-if="user.photo" :src="user.photo" :alt="user.identifiant" />

    <div class="mt-6">
      <h3 class="text-xl font-semibold">Mes recettes :</h3>
      <ul v-if="user.recipes?.length > 0">
        <li
          v-for="recipe in user.recipes"
          :key="recipe.id_recipe"
          class="mb-4 border p-4 rounded-lg"
        >
          <h4 class="font-semibold">Titre : {{ recipe.title }}</h4>
          <p v-if="recipe.description">
            Description : {{ recipe.description }}
          </p>
          <ul class="ml-4 mt-2 list-disc" v-if="recipe.instructions?.length">
            <li v-for="step in recipe.instructions" :key="step.id_instruction">
              {{ step.text_instruction }}
            </li>
          </ul>
        </li>
      </ul>
      <p v-else>Aucune recette pour l'instant.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useUserStore } from '@/store/user';
import { useAuthStore } from '@/store/auth';

const auth = useAuthStore();
const userStore = useUserStore();

const user = computed(() => userStore.userDetail);

onMounted(() => {
  if (auth.identifiant) {
    userStore.getUserDetail(auth.identifiant);
  }
});
</script>
