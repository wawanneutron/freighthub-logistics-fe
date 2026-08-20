<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue: string | number;
  label?: string;
  type?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  id?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const inputId = computed(() => props.id || `input-${Math.random().toString(36).substring(2, 9)}`);
</script>

<template>
  <div class="w-full">
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-slate-700 mb-1.5">
      {{ label }} <span v-if="required" class="text-rose-500">*</span>
    </label>
    <input
      :id="inputId"
      :type="type || 'text'"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :placeholder="placeholder"
      :class="[
        'block w-full rounded-lg text-sm text-slate-900 placeholder-slate-400 transition-all duration-150',
        error 
          ? 'border-rose-300 ring-1 ring-inset ring-rose-300 focus:border-rose-500 focus:ring-rose-500' 
          : 'border-slate-300 focus:border-slate-500 focus:ring-1 focus:ring-slate-500'
      ]"
    />
    <p v-if="error" class="mt-1.5 text-sm text-rose-600">{{ error }}</p>
  </div>
</template>
