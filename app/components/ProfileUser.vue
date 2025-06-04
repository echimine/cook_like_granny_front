<template>
  <div v-if="user">
    <h2 class="text-2xl font-bold mb-4">Mon Profil</h2>
    <p><strong>Identifiant :</strong> {{ user.identifiant }}</p>
    <p><strong>Role :</strong> {{ user.role }}</p>
    <img v-if="user.photo" :src="user.photo" :alt="user.identifiant" />

    <div class="mt-6">
      <h3 class="text-xl font-semibold">Mes recettes :</h3>
      <div>
        <ul v-if="user.recipes?.length > 0">
          <li
            v-for="recipe in user.recipes"
            :key="recipe.id_recipe"
            class="mb-4 border p-4 rounded-lg flex flex-col gap-2"
          >
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-semibold">Titre : {{ recipe.title }}</h4>
                <p v-if="recipe.description">
                  Description : {{ recipe.description }}
                </p>
              </div>

              <button
                class="text-sm text-gray-500 self-start px-2 py-1 border-2 rounded-lg hover:border-red-500"
                @click="openDeleteModal(recipe.id_recipe)"
              >
                supprimer
              </button>
            </div>

            <ul class="ml-4 mt-2 list-disc" v-if="recipe.instructions?.length">
              <li
                v-for="step in recipe.instructions"
                :key="step.id_instruction"
              >
                {{ step.text_instruction }} - {{ step.ordre }}
              </li>
            </ul>
          </li>
        </ul>
        <p v-else>Aucune recette pour l'instant.</p>
      </div>
    </div>
  </div>

  <!-- 🔴 MODALE DE CONFIRMATION -->
  <div
    v-if="showModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
  >
    <div class="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
      <h2 class="text-lg font-semibold mb-4">Supprimer la recette ?</h2>
      <p class="mb-4 text-sm text-gray-600">
        Cette action est irréversible. Es-tu sûr de vouloir continuer ?
      </p>
      <div class="flex justify-end gap-2">
        <button
          class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          @click="cancelDelete"
        >
          Annuler
        </button>
        <button
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          @click="confirmDelete"
        >
          Confirmer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '@/store/user';
import { useAuthStore } from '@/store/auth';
import { useRecipeStore } from '@/store/recipe';

const auth = useAuthStore();
const userStore = useUserStore();
const recipeStore = useRecipeStore();

const user = computed(() => userStore.userDetail);

const showModal = ref(false);
const selectedRecipeId = ref<number | null>(null);

// ⛔ Ouvre la modale
function openDeleteModal(id: number) {
  selectedRecipeId.value = id;
  showModal.value = true;
}

// ❌ Annule la suppression
function cancelDelete() {
  showModal.value = false;
  selectedRecipeId.value = null;
}

// ✅ Confirme et supprime
async function confirmDelete() {
  if (selectedRecipeId.value !== null) {
    await recipeStore.deleteRecipe(selectedRecipeId.value);
    await userStore.getUserDetail(auth.identifiant); // Rechargement
    showModal.value = false;
    selectedRecipeId.value = null;
  }
}

onMounted(() => {
  if (auth.identifiant) {
    userStore.getUserDetail(auth.identifiant);
  }
});
</script>
