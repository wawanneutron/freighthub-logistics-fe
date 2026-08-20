<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useOrderStore } from '../stores/orders';
import debounce from 'lodash/debounce';
import { formatDate } from '../utils/date';
import BaseInput from '../components/common/BaseInput.vue';
import BaseSelect from '../components/common/BaseSelect.vue';
import BaseButton from '../components/common/BaseButton.vue';
import StatusBadge from '../components/common/StatusBadge.vue';
import Pagination from '../components/common/Pagination.vue';
import BaseModal from '../components/common/BaseModal.vue';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import CreateOrderDialog from '../components/orders/CreateOrderDialog.vue';
import OrderDetailDialog from '../components/orders/OrderDetailDialog.vue';
import { useSnackbarStore } from '../stores/snackbar';

const orderStore = useOrderStore();
const snackbar = useSnackbarStore();
const { orders, loading, pagination, error, submitting } = storeToRefs(orderStore);

const filterStatus = ref('');
const searchSender = ref('');
const searchRecipient = ref('');
const currentPage = ref(1);
const showCreateDialog = ref(false);
const showDetailsDialog = ref(false);
const selectedOrderId = ref<number | null>(null);

const openDetails = (id: number) => {
  selectedOrderId.value = id;
  showDetailsDialog.value = true;
};

const statusOptions = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'IN_TRANSIT', label: 'In Transit' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELED', label: 'Canceled' },
];

const fetchOrders = () => {
  orderStore.fetchOrders({
    page: currentPage.value,
    limit: 10,
    status: filterStatus.value || undefined,
    sender: searchSender.value || undefined,
    recipient: searchRecipient.value || undefined,
  });
};

const debouncedFetch = debounce(() => {
  currentPage.value = 1;
  fetchOrders();
}, 500);

watch([filterStatus, searchSender, searchRecipient], () => {
  debouncedFetch();
});

const onPageChange = (page: number) => {
  currentPage.value = page;
  fetchOrders();
};

const resetFilters = () => {
  filterStatus.value = '';
  searchSender.value = '';
  searchRecipient.value = '';
  currentPage.value = 1;
  fetchOrders();
};

const showCancelModal = ref(false);
const orderToCancel = ref<number | null>(null);
const orderToCancelTrackingNumber = ref('');

const confirmCancel = (id: number, trackingNumber: string) => {
  orderToCancel.value = id;
  orderToCancelTrackingNumber.value = trackingNumber;
  showCancelModal.value = true;
};

const handleCancel = async () => {
  if (orderToCancel.value) {
    try {
      await orderStore.cancelOrder(orderToCancel.value);
      showCancelModal.value = false;
      orderToCancel.value = null;
    } catch (err) {
      console.error(err);
    }
  }
};

const handleStatusUpdate = async (id: number, e: Event) => {
  const newStatus = (e.target as HTMLSelectElement).value as any;
  if (!newStatus) return;
  try {
    await orderStore.updateStatus(id, newStatus);
  } catch (err) {
    fetchOrders();
  }
};

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

onMounted(() => {
  fetchOrders();
});
</script>

<template>
  <div>
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Orders</h1>
        <p class="mt-1 text-sm text-slate-500">Manage and monitor all shipments.</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <BaseButton @click="showCreateDialog = true">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Create Order
        </BaseButton>
      </div>
    </div>

    <div v-if="error" class="mt-5 bg-white rounded-xl border border-slate-200 p-4 flex gap-3 items-center">
      <div class="w-1 h-5 bg-rose-500 rounded-full shrink-0"></div>
      <p class="text-sm font-medium text-slate-700">{{ error }}</p>
    </div>

    <div class="mt-6 bg-white rounded-xl border border-slate-200 p-4">
      <div class="flex flex-col md:flex-row gap-3 items-center">
        <div class="flex-1 w-full">
          <BaseInput v-model="searchSender" placeholder="Search by sender..." />
        </div>
        <div class="flex-1 w-full">
          <BaseInput v-model="searchRecipient" placeholder="Search by recipient..." />
        </div>
        <div class="w-full md:w-48 flex-shrink-0">
          <BaseSelect v-model="filterStatus" :options="statusOptions" placeholder="All statuses" />
        </div>
        <div class="flex-shrink-0 w-full md:w-auto">
          <BaseButton variant="ghost" size="sm" @click="resetFilters" class="w-full md:w-auto">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </BaseButton>
        </div>
      </div>
    </div>

    <div class="mt-6 bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div v-if="loading && orders.length === 0" class="py-16">
        <LoadingSpinner text="Loading orders..." />
      </div>

      <div v-else-if="orders.length === 0" class="py-16 text-center">
        <svg class="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <h3 class="mt-3 text-sm font-medium text-slate-900">No orders found</h3>
        <p class="mt-1 text-sm text-slate-500">Get started by creating a new order.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200">
          <thead>
            <tr class="bg-slate-50">
              <th scope="col" class="py-3 pl-4 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:pl-6">Tracking Number</th>
              <th scope="col" class="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Sender</th>
              <th scope="col" class="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Recipient</th>
              <th scope="col" class="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Route</th>
              <th scope="col" class="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
              <th scope="col" class="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Created</th>
              <th scope="col" class="relative py-3 pl-3 pr-4 sm:pr-6">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="order in orders"
              :key="order.id"
              class="hover:bg-slate-50/50 transition-colors"
            >
              <td class="whitespace-nowrap py-3.5 pl-4 pr-3 text-sm sm:pl-6">
                <button
                  @click="copyTracking(order.trackingNumber)"
                  class="inline-flex items-center gap-1.5 font-mono font-medium text-slate-900 hover:text-slate-600 group cursor-pointer transition-colors"
                  title="Click to copy"
                >
                  {{ order.trackingNumber }}
                  <svg class="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </td>
              <td class="whitespace-nowrap px-3 py-3.5 text-sm text-slate-600">{{ order.senderName }}</td>
              <td class="whitespace-nowrap px-3 py-3.5 text-sm text-slate-600">{{ order.recipientName }}</td>
              <td class="whitespace-nowrap px-3 py-3.5 text-sm text-slate-600">
                <span class="inline-flex items-center gap-1.5">
                  {{ order.origin }}
                  <svg class="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  {{ order.destination }}
                </span>
              </td>
              <td class="whitespace-nowrap px-3 py-3.5 text-sm">
                <StatusBadge :status="order.status" />
              </td>
              <td class="whitespace-nowrap px-3 py-3.5 text-sm text-slate-500">
                {{ formatDate(order.createdAt) }}
              </td>
              <td class="whitespace-nowrap py-3.5 pl-3 pr-4 text-right text-sm sm:pr-6">
                <div class="flex items-center justify-end gap-3">
                  <button
                    @click="openDetails(order.id)"
                    class="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                    title="View Details"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Details
                  </button>

                  <select
                    v-if="order.status !== 'DELIVERED' && order.status !== 'CANCELED'"
                    @change="(e) => handleStatusUpdate(order.id, e)"
                    :value="order.status"
                    :disabled="submitting"
                    class="text-xs rounded-lg border-slate-300 py-1.5 px-2 pr-7 focus:border-slate-500 focus:ring-1 focus:ring-slate-500 disabled:opacity-40 cursor-pointer"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_TRANSIT">In Transit</option>
                    <option value="DELIVERED">Delivered</option>
                  </select>

                  <button
                    v-if="order.status === 'PENDING'"
                    @click="confirmCancel(order.id, order.trackingNumber)"
                    :disabled="submitting"
                    class="inline-flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Pagination
      v-if="pagination && pagination.totalPages > 1"
      class="mt-4"
      :page="pagination.page"
      :total-pages="pagination.totalPages"
      :total="pagination.total"
      :limit="pagination.limit"
      @change="onPageChange"
    />

    <BaseModal
      v-model="showCancelModal"
      title="Cancel Order?"
      :message="`Are you sure you want to cancel order ${orderToCancelTrackingNumber}? This action cannot be undone.`"
      confirm-text="Cancel Order"
      cancel-text="Keep Order"
      :loading="submitting"
      @confirm="handleCancel"
    />
    
    <CreateOrderDialog
      v-model="showCreateDialog"
      @created="fetchOrders"
    />

    <OrderDetailDialog
      v-model="showDetailsDialog"
      :order-id="selectedOrderId"
    />
  </div>
</template>
