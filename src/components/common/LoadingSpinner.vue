<script setup lang="ts">
defineProps<{
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}>();
</script>

<template>
  <div class="flex flex-col items-center justify-center p-8 space-y-3">
    <div class="relative">
      <div class="absolute inset-0 rounded-full bg-slate-900/5 animate-ping"></div>
      <svg :class="['animate-spin text-slate-600', size === 'sm' ? 'h-5 w-5' : size === 'lg' ? 'h-10 w-10' : 'h-7 w-7']" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    <p v-if="text" class="text-sm text-slate-500">{{ text }}</p>
  </div>
</template>
