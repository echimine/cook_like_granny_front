<template>
  <div>
    <NuxtLayout> <NuxtPage /></NuxtLayout>
  </div>
</template>
<script setup lang="ts">
import { useAuthStore } from './store/auth';

onMounted(() => {
  const auth = useAuthStore();
  auth.init();
});
</script>
