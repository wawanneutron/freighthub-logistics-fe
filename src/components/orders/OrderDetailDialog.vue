<script setup lang="ts">
import { ref, watch } from 'vue';
import { useOrderStore } from '../../stores/orders';
import { useSnackbarStore } from '../../stores/snackbar';
import { formatDate } from '../../utils/date';
import BaseButton from '../common/BaseButton.vue';
import StatusBadge from '../common/StatusBadge.vue';
import LoadingSpinner from '../common/LoadingSpinner.vue';
import type { Order } from '../../types';

const props = defineProps<{
  modelValue: boolean;
  orderId: number | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const orderStore = useOrderStore();
const snackbar = useSnackbarStore();

const order = ref<Order | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const close = () => {
  emit('update:modelValue', false);
};

const fetchDetails = async () => {
  if (!props.orderId) return;
  loading.value = true;
  error.value = null;
  order.value = null;
  try {
    const data = await orderStore.fetchOrderById(props.orderId);
    order.value = data;
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch order details';
  } finally {
    loading.value = false;
  }
};

watch(() => props.modelValue, (isOpen) => {
  if (isOpen && props.orderId) {
    fetchDetails();
  }
});

const copyTracking = async (trackingNumber: string) => {
  try {
    await navigator.clipboard.writeText(trackingNumber);
    snackbar.showSnackbar({
      message: `Copied ${trackingNumber} to clipboard`,
      type: 'info',
      duration: 2000,
    });
  } catch {
    snackbar.showSnackbar({
      message: 'Failed to copy to clipboard',
      type: 'error',
    });
  }
};
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="modelValue" class="relative z-50" aria-labelledby="order-detail-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="close"></div>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <Transition
              enter-active-class="ease-out duration-200"
              enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to-class="opacity-100 translate-y-0 sm:scale-100"
              leave-active-class="ease-in duration-150"
              leave-from-class="opacity-100 translate-y-0 sm:scale-100"
              leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div v-if="modelValue" class="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all w-full max-w-lg">
                <!-- Header -->
                <div class="flex items-center justify-between px-4 py-4 sm:px-6 border-b border-slate-200">
                  <div>
                    <h2 id="order-detail-title" class="text-base font-semibold text-slate-900">Order Details</h2>
                    <p class="mt-0.5 text-xs sm:text-sm text-slate-500 font-normal">Detailed summary of shipment order.</p>
                  </div>
                  <button
                    @click="close"
                    class="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <!-- Content -->
                <div class="px-4 py-5 sm:p-6 min-h-[200px] flex flex-col justify-center">
                  <!-- Loading State -->
                  <div v-if="loading" class="py-8">
                    <LoadingSpinner text="Loading details..." />
                  </div>

                  <!-- Error State -->
                  <div v-else-if="error" class="bg-white rounded-lg border border-slate-200 p-3.5 flex gap-3 items-center">
                    <div class="w-1 h-5 bg-rose-500 rounded-full shrink-0"></div>
                    <p class="text-sm font-medium text-slate-700">{{ error }}</p>
                  </div>

                  <!-- Data State -->
                  <div v-else-if="order" class="space-y-4">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                      <div>
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tracking Number</span>
                        <div class="flex items-center gap-2 mt-0.5">
                          <span class="text-sm font-mono font-semibold text-slate-800">{{ order.trackingNumber }}</span>
                          <button 
                            @click="copyTracking(order.trackingNumber)"
                            class="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            title="Copy tracking number"
                          >
                            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002 2h2a2 2 0 002-2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div class="self-start sm:self-center">
                        <StatusBadge :status="order.status" />
                      </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div class="border border-slate-100 bg-white rounded-xl p-4 shadow-sm">
                        <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Sender Information</h3>
                        <p class="text-sm font-medium text-slate-800">{{ order.senderName }}</p>
                        <p class="text-xs text-slate-500 mt-1 font-mono">Origin: {{ order.origin }}</p>
                      </div>
                      
                      <div class="border border-slate-100 bg-white rounded-xl p-4 shadow-sm">
                        <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Recipient Information</h3>
                        <p class="text-sm font-medium text-slate-800">{{ order.recipientName }}</p>
                        <p class="text-xs text-slate-500 mt-1 font-mono">Destination: {{ order.destination }}</p>
                      </div>
                    </div>

                    <div class="border border-slate-100 bg-white rounded-xl p-4 shadow-sm divide-y divide-slate-100">
                      <div class="flex justify-between py-2 text-xs">
                        <span class="text-slate-500 font-medium">Created Date</span>
                        <span class="text-slate-800 font-medium">{{ formatDate(order.createdAt) }}</span>
                      </div>
                      <div class="flex justify-between py-2 text-xs">
                        <span class="text-slate-500 font-medium">Last Updated</span>
                        <span class="text-slate-800 font-medium">{{ formatDate(order.updatedAt) }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Footer -->
                <div class="flex items-center justify-end border-t border-slate-200 bg-slate-50 px-4 py-4 sm:px-6">
                  <BaseButton variant="ghost" type="button" @click="close">
                    Close
                  </BaseButton>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
