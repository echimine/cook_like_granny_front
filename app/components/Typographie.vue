<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';

type Size = 'h1' | 'h2' | 'h3' | 'h4' | 'bodyxl' | 'bodybase';
type Font = 'inter' | 'poppins';
type Weight = 'regular' | 'medium' | 'bold';
type Tag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';

const props = defineProps<{
  size?: Size;
  font?: Font;
  weight?: Weight;
  as?: Tag;
}>();

const size = props.size ?? 'bodybase';
const font = props.font ?? 'inter';
const weight = props.weight ?? 'regular';
const as = props.as ?? 'p';
const currentMode = ref<'light' | 'dark'>('light');

// ✅ Initialize MutationObserver only on client side
let observer: MutationObserver | null = null;

const updateMode = () => {
  const isDark = document.documentElement.classList.contains('dark');
  currentMode.value = isDark ? 'dark' : 'light';
};

onMounted(() => {
  updateMode();

  // ✅ Safely initialize MutationObserver (browser only)
  if (typeof window !== 'undefined') {
    observer = new MutationObserver(updateMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }
});

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect();
  }
});

//variant c'est la taille du text selon le tag
const sizeClasses: Record<Size, string> = {
  h1: 'text-[42px] md:text-[96px]',
  h2: '',
  h3: 'text-[clamp(20px,8vw,32px)]',
  h4: 'text-2xl',
  bodyxl: 'text-xl',
  bodybase: 'text-base',
};

// la police d'écriture
const fontClasses: Record<Font, string> = {
  inter: 'font-Inter',
  poppins: 'font-Poppins',
};

//la graisseur
const weightClasses: Record<Weight, string> = {
  regular: 'font-regular',
  medium: 'font-medium',
  bold: 'font-bold',
};

//chois de la class du text selon le theme mais c'est automatique avec le MutationObserver
const modeClasses: Record<'light' | 'dark', string> = {
  light: 'text-black',
  dark: 'text-white',
};

const finalClass = computed(() =>
  [
    sizeClasses[size],
    fontClasses[font],
    weightClasses[weight],
    modeClasses[currentMode.value],
  ].join(' ')
);
</script>

<template>
  <component :is="as" :class="finalClass">
    <slot />
  </component>
</template>
