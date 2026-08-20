<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useOrderStore } from '../stores/orders';
import { useSnackbarStore } from '../stores/snackbar';
import { formatDate } from '../utils/date';
import BaseInput from '../components/common/BaseInput.vue';
import BaseButton from '../components/common/BaseButton.vue';
import StatusBadge from '../components/common/StatusBadge.vue';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';

const orderStore = useOrderStore();
const snackbar = useSnackbarStore();
const { trackedOrder, loading, error } = storeToRefs(orderStore);

const searchInput = ref('');
const searchAttempted = ref(false);

onUnmounted(() => {
  orderStore.trackedOrder = null;
  orderStore.error = null;
});

const submitSearch = async () => {
  const query = searchInput.value.trim();
  if (!query) return;
  
  searchAttempted.value = true;
  await orderStore.trackOrder(query);

  if (trackedOrder.value) {
    snackbar.showSnackbar({
      message: `Shipment details loaded successfully`,
      type: 'success',
      duration: 3000
    });
  } else if (error.value) {
    snackbar.showSnackbar({
      message: error.value,
      type: 'error',
      duration: 3000
    });
  } else {
    snackbar.showSnackbar({
      message: 'No shipment found matching that tracking number',
      type: 'error',
      duration: 3000
    });
  }
};
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-slate-900">Track Shipment</h1>
      <p class="mt-1 text-sm text-slate-500">Monitor your shipment status in real-time.</p>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 p-6 mb-8">
      <form @submit.prevent="submitSearch" class="flex flex-col sm:flex-row gap-3 items-end">
        <div class="flex-1 w-full">
          <BaseInput
            v-model="searchInput"
            label="Tracking Number"
            placeholder="e.g. TRK-123456789"
          />
        </div>
        <div class="w-full sm:w-auto">
          <BaseButton type="submit" :loading="loading" :disabled="!searchInput.trim()" class="w-full sm:w-auto">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Track
          </BaseButton>
        </div>
      </form>
    </div>

    <!-- States Container -->
    <div v-if="loading" class="bg-white rounded-xl border border-slate-200 p-16">
      <LoadingSpinner text="Searching..." />
    </div>

    <div v-else-if="error" class="bg-white rounded-xl border border-slate-200 p-4 flex gap-3 items-center">
      <div class="w-1 h-5 bg-rose-500 rounded-full shrink-0"></div>
      <p class="text-sm font-medium text-slate-700">{{ error }}</p>
    </div>

    <div v-else-if="trackedOrder" class="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div class="px-6 py-5 flex items-center justify-between border-b border-slate-100">
        <div>
          <h2 class="text-base font-semibold text-slate-900">Shipment Details</h2>
          <p class="text-sm text-slate-500 font-mono mt-0.5">{{ trackedOrder.trackingNumber }}</p>
        </div>
        <StatusBadge :status="trackedOrder.status" />
      </div>

      <dl class="divide-y divide-slate-100">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-1 px-6 py-4">
          <dt class="text-sm font-medium text-slate-500">Sender</dt>
          <dd class="text-sm text-slate-900 sm:col-span-2">{{ trackedOrder.senderName }}</dd>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-1 px-6 py-4">
          <dt class="text-sm font-medium text-slate-500">Recipient</dt>
          <dd class="text-sm text-slate-900 sm:col-span-2">{{ trackedOrder.recipientName }}</dd>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-1 px-6 py-4">
          <dt class="text-sm font-medium text-slate-500">Origin</dt>
          <dd class="text-sm text-slate-900 sm:col-span-2">{{ trackedOrder.origin }}</dd>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-1 px-6 py-4">
          <dt class="text-sm font-medium text-slate-500">Destination</dt>
          <dd class="text-sm text-slate-900 sm:col-span-2">{{ trackedOrder.destination }}</dd>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-1 px-6 py-4">
          <dt class="text-sm font-medium text-slate-500">Created At</dt>
          <dd class="text-sm text-slate-900 sm:col-span-2">{{ formatDate(trackedOrder.createdAt) }}</dd>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-1 px-6 py-4">
          <dt class="text-sm font-medium text-slate-500">Last Updated</dt>
          <dd class="text-sm text-slate-900 sm:col-span-2">{{ formatDate(trackedOrder.updatedAt) }}</dd>
        </div>
      </dl>
    </div>
    
    <!-- Initial State (Before search) -->
    <div v-else-if="!searchAttempted" class="border border-dashed border-slate-200 bg-slate-50/40 rounded-xl p-8 text-center">
      <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Awaiting Shipment ID</p>
      <p class="text-sm text-slate-500 mt-1">Enter a tracking number above to see the real-time status of your shipment.</p>
    </div>
    
    <!-- No Results State (Search failed) -->
    <div v-else class="bg-white rounded-xl border border-slate-200 p-6 text-center">
      <p class="text-sm text-slate-600 font-medium">No shipment found matching that tracking number. Please verify and try again.</p>
    </div>
  </div>
</template>
