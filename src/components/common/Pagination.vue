<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}>();

const emit = defineEmits<{
  (e: 'change', page: number): void;
}>();

const isFirstPage = computed(() => props.page <= 1);
const isLastPage = computed(() => props.page >= props.totalPages);

const startItem = computed(() => (props.page - 1) * props.limit + 1);
const endItem = computed(() => Math.min(props.page * props.limit, props.total));

function previousPage() {
  if (!isFirstPage.value) emit('change', props.page - 1);
}

function nextPage() {
  if (!isLastPage.value) emit('change', props.page + 1);
}
</script>

<template>
  <div class="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-3 sm:px-5">
    <div class="flex flex-1 justify-between sm:hidden">
      <button
        @click="previousPage"
        :disabled="isFirstPage"
        class="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>
      <button
        @click="nextPage"
        :disabled="isLastPage"
        class="ml-3 inline-flex items-center rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <p class="text-sm text-slate-600">
        Showing
        <span class="font-semibold text-slate-900">{{ total === 0 ? 0 : startItem }}</span>
        to
        <span class="font-semibold text-slate-900">{{ endItem }}</span>
        of
        <span class="font-semibold text-slate-900">{{ total }}</span>
        results
      </p>
      <nav class="inline-flex items-center gap-1.5" aria-label="Pagination">
        <button
          @click="previousPage"
          :disabled="isFirstPage"
          class="inline-flex items-center justify-center rounded-lg w-9 h-9 text-slate-500 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <span class="sr-only">Previous</span>
          <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <span class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg">
          {{ page }} / {{ totalPages || 1 }}
        </span>

        <button
          @click="nextPage"
          :disabled="isLastPage"
          class="inline-flex items-center justify-center rounded-lg w-9 h-9 text-slate-500 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <span class="sr-only">Next</span>
          <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
          </svg>
        </button>
      </nav>
    </div>
  </div>
</template>
