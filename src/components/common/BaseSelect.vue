<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue: string;
  options: { value: string; label: string }[];
  label?: string;
  error?: string;
  required?: boolean;
  id?: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const selectId = computed(() => props.id || `select-${Math.random().toString(36).substring(2, 9)}`);
</script>

<template>
  <div class="w-full">
    <label v-if="label" :for="selectId" class="block text-sm font-medium text-slate-700 mb-1.5">
      {{ label }} <span v-if="required" class="text-rose-500">*</span>
    </label>
    <select
      :id="selectId"
      :value="modelValue"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      :class="[
        'block w-full rounded-lg text-sm text-slate-900 transition-all duration-150 cursor-pointer',
        error 
          ? 'border-rose-300 ring-1 ring-inset ring-rose-300 focus:border-rose-500 focus:ring-rose-500' 
          : 'border-slate-300 focus:border-slate-500 focus:ring-1 focus:ring-slate-500'
      ]"
    >
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <p v-if="error" class="mt-1.5 text-sm text-rose-600">{{ error }}</p>
  </div>
</template>
