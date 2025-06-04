<template>
  <div v-if="recipe" class="p-10">
    <h1 class="text-2xl font-bold mb-4">Modifier la recette</h1>

    <form @submit.prevent="handleSubmit" class="space-y-4 max-w-md">
      <div>
        <label for="title" class="font-medium">Titre</label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          class="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label for="description" class="font-medium">Description</label>
        <textarea
          id="description"
          v-model="form.description"
          class="w-full border p-2 rounded max-h-[500px]"
          required
        ></textarea>
      </div>

      <!-- Tu peux ajouter d’autres champs ici -->

      <button
        type="submit"
        class="bg-blue-600 hover:bg-blue-700 text-black px-4 py-2 rounded border-2"
      >
        Enregistrer les modifications
      </button>
    </form>
  </div>

  <p v-else>Chargement de la recette...</p>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { onMounted, reactive, watch, computed } from 'vue';
import { useRecipeStore } from '@/store/recipe';

const route = useRoute();
const router = useRouter();
const recipeStore = useRecipeStore();

const id_recipe = Number(route.params.id);

// 🧠 Accès à la recette détaillée depuis le store
const recipe = computed(() => recipeStore.recipeDetail);

// 🔁 Remplissage du formulaire
const form = reactive({
  title: '',
  description: '',
  // Tu peux ajouter ici : ingredients, instructions, etc.
});

onMounted(async () => {
  if (!isNaN(id_recipe)) {
    await recipeStore.getRecipe(id_recipe);
  }
});

watch(
  recipe,
  (value) => {
    if (value) {
      form.title = value.title;
      form.description = value.description;
      // Préremplis aussi les autres champs si présents
    }
  },
  { immediate: true }
);

// ✅ Utilise la méthode du store directement
async function handleSubmit() {
  try {
    await recipeStore.updateRecipe(id_recipe, {
      title: form.title,
      description: form.description,
      // Ajoute ici les autres champs si nécessaire
    });

    alert('Recette mise à jour avec succès !');
    router.push('/'); // Change si tu veux rediriger ailleurs
  } catch (e) {
    alert('Erreur lors de la mise à jour.');
    console.error(e);
  }
}
</script>
