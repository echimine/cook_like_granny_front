import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRuntimeConfig } from '#imports';
import type { Recipe } from '../types/recipe.type';
import { useAuthStore } from '@/store/auth';

export const useRecipeStore = defineStore('recipe', () => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const recipes = ref<Recipe[]>([]);
  const recipeDetail = ref<Recipe | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // 🔄 GET toutes les recettes
  async function getAllRecipes() {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch(`${config.public.apiBase}/recipes`);
      if (!res.ok) throw new Error('Erreur lors du chargement des recettes');
      const data = await res.json();
      recipes.value = data;
    } catch (err: any) {
      error.value = err.message || 'Erreur inconnue';
    } finally {
      loading.value = false;
    }
  }

  // ➕ POST - Créer une recette
  async function addRecipe(recipeData: FormData | object) {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch(`${config.public.apiBase}/recipes`, {
        method: 'POST',
        body:
          recipeData instanceof FormData
            ? recipeData
            : JSON.stringify(recipeData),
        headers:
          recipeData instanceof FormData
            ? undefined
            : {
                Authorization: `Bearer ${authStore.token}`,
                'Content-Type': 'application/json',
              },
      });
      if (!res.ok) throw new Error('Erreur lors de la création');
      const newRecipe = await res.json();
      recipes.value.push(newRecipe); // Optionnel si tu veux MAJ directement
      return newRecipe;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  // ✏️ PUT - Modifier une recette
  async function updateRecipe(id: number, updatedData: object) {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch(`${config.public.apiBase}/recipes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error('Erreur lors de la modification');
      const updated = await res.json();
      // Mets à jour localement la liste si nécessaire
      recipes.value = recipes.value.map((r) =>
        r.id_recipe === id ? updated : r
      );
      return updated;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  // ❌ DELETE - Supprimer une recette
  async function deleteRecipe(id: number) {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch(`${config.public.apiBase}/recipes/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      recipes.value = recipes.value.filter((r) => r.id_recipe !== id);
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  return {
    recipes,
    recipeDetail,
    loading,
    error,
    getAllRecipes,
    addRecipe,
    updateRecipe,
    deleteRecipe,
  };
});
