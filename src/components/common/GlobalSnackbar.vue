<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useSnackbarStore } from '../../stores/snackbar';
import type { SnackbarType } from '../../types/snackbar';

const snackbarStore = useSnackbarStore();
const { snackbars } = storeToRefs(snackbarStore);

const iconMap: Record<SnackbarType, { svg: string; bg: string }> = {
  success: {
    bg: 'bg-emerald-100',
    svg: `<svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>`,
  },
  error: {
    bg: 'bg-rose-100',
    svg: `<svg class="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>`,
  },
  warning: {
    bg: 'bg-amber-100',
    svg: `<svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`,
  },
  info: {
    bg: 'bg-sky-100',
    svg: `<svg class="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
  },
};
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-0 right-0 flex flex-col pointer-events-none z-[100] p-4 sm:p-6 gap-2.5 max-w-sm w-full">
      <TransitionGroup
        name="toast"
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-x-full opacity-0"
        enter-to-class="translate-x-0 opacity-100"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="translate-x-0 opacity-100"
        leave-to-class="translate-x-full opacity-0"
      >
        <div
          v-for="snackbar in snackbars"
          :key="snackbar.id"
          class="pointer-events-auto w-full overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-slate-900/5"
        >
          <div class="p-4">
            <div class="flex items-start gap-3">
              <div
                class="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                :class="iconMap[snackbar.type].bg"
                v-html="iconMap[snackbar.type].svg"
              ></div>
              <div class="flex-1 min-w-0 pt-0.5">
                <p class="text-sm font-medium text-slate-900 leading-snug">
                  {{ snackbar.message }}
                </p>
              </div>
              <button
                type="button"
                @click="snackbarStore.removeSnackbar(snackbar.id)"
                class="flex-shrink-0 inline-flex rounded-lg p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none"
              >
                <span class="sr-only">Close</span>
                <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-move {
  transition: transform 0.3s ease;
}
</style>
