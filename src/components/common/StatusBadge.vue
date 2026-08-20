<script setup lang="ts">
import { computed } from 'vue';
import type { OrderStatus } from '../../types';

const props = defineProps<{
  status: OrderStatus;
}>();

const label = computed(() => {
  switch (props.status) {
    case 'PENDING':
      return 'Pending';
    case 'IN_TRANSIT':
      return 'In Transit';
    case 'DELIVERED':
      return 'Delivered';
    case 'CANCELED':
      return 'Canceled';
    default:
      return props.status;
  }
});
</script>

<template>
  <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50/50 text-[11px] font-semibold text-slate-600 select-none shadow-sm shadow-slate-100/50">
    <!-- PENDING: Dashed loading circle -->
    <svg v-if="status === 'PENDING'" class="w-3.5 h-3.5 text-amber-500 animate-spin [animation-duration:3s]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <circle cx="12" cy="12" r="9" stroke-dasharray="4 3" />
    </svg>

    <!-- IN_TRANSIT: Partial progress circle -->
    <svg v-else-if="status === 'IN_TRANSIT'" class="w-3.5 h-3.5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <circle cx="12" cy="12" r="9" class="opacity-30" />
      <path stroke-linecap="round" d="M12 3a9 9 0 019 9" />
    </svg>

    <!-- DELIVERED: Checkmark circle -->
    <svg v-else-if="status === 'DELIVERED'" class="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0" />
    </svg>

    <!-- CANCELED: Cross circle -->
    <svg v-else-if="status === 'CANCELED'" class="w-3.5 h-3.5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>

    <!-- DEFAULT: Simple dot -->
    <span v-else class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>

    {{ label }}
  </span>
</template>

