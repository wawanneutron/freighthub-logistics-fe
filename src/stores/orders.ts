import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Order, OrderFilters, Pagination, CreateOrderPayload, OrderStatus } from '../types';
import { ordersService } from '../services/ordersService';
import { getApiErrorMessage } from '../utils/get-api-error-message';
import { useSnackbarStore } from './snackbar';

export const useOrderStore = defineStore('orders', () => {
  const orders = ref<Order[]>([]);
  const trackedOrder = ref<Order | null>(null);
  const pagination = ref<Pagination | null>(null);
  
  const loading = ref(false);
  const submitting = ref(false);
  const error = ref<string | null>(null);

  function clearError() {
    error.value = null;
  }

  async function fetchOrders(filters: OrderFilters) {
    loading.value = true;
    error.value = null;
    try {
      const response = await ordersService.getOrders(filters);
      orders.value = response.data;
      pagination.value = response.pagination || null;
    } catch (err) {
      error.value = getApiErrorMessage(err);
    } finally {
      loading.value = false;
    }
  }

  async function createOrder(payload: CreateOrderPayload) {
    const snackbar = useSnackbarStore();
    submitting.value = true;
    error.value = null;
    try {
      const response = await ordersService.createOrder(payload);
      snackbar.showSnackbar({
        message: 'Order created successfully',
        type: 'success'
      });
      return response.data;
    } catch (err) {
      error.value = getApiErrorMessage(err);
      snackbar.showSnackbar({
        message: error.value,
        type: 'error'
      });
      throw err; 
    } finally {
      submitting.value = false;
    }
  }

  async function trackOrder(trackingNumber: string) {
    loading.value = true;
    error.value = null;
    trackedOrder.value = null;
    try {
      const response = await ordersService.trackOrder(trackingNumber);
      trackedOrder.value = response.data;
    } catch (err) {
      error.value = getApiErrorMessage(err);
    } finally {
      loading.value = false;
    }
  }

  async function updateStatus(id: number, status: OrderStatus) {
    const snackbar = useSnackbarStore();
    submitting.value = true;
    error.value = null;
    try {
      await ordersService.updateStatus(id, status);
      const orderIndex = orders.value.findIndex(o => o.id === id);
      if (orderIndex !== -1) {
        orders.value[orderIndex].status = status;
        orders.value[orderIndex].updatedAt = new Date().toISOString();
      }
      if (trackedOrder.value && trackedOrder.value.id === id) {
        trackedOrder.value.status = status;
        trackedOrder.value.updatedAt = new Date().toISOString();
      }
      snackbar.showSnackbar({
        message: 'Status updated successfully',
        type: 'success'
      });
    } catch (err) {
      error.value = getApiErrorMessage(err);
      snackbar.showSnackbar({
        message: error.value,
        type: 'error'
      });
      throw err;
    } finally {
      submitting.value = false;
    }
  }

  async function cancelOrder(id: number) {
    const snackbar = useSnackbarStore();
    submitting.value = true;
    error.value = null;
    try {
      await ordersService.cancelOrder(id);
      const orderIndex = orders.value.findIndex(o => o.id === id);
      if (orderIndex !== -1) {
        orders.value[orderIndex].status = 'CANCELED';
        orders.value[orderIndex].updatedAt = new Date().toISOString();
      }
      if (trackedOrder.value && trackedOrder.value.id === id) {
        trackedOrder.value.status = 'CANCELED';
        trackedOrder.value.updatedAt = new Date().toISOString();
      }
      snackbar.showSnackbar({
        message: 'Order canceled successfully',
        type: 'success'
      });
    } catch (err) {
      error.value = getApiErrorMessage(err);
      snackbar.showSnackbar({
        message: error.value,
        type: 'error'
      });
      throw err;
    } finally {
      submitting.value = false;
    }
  }

  async function fetchOrderById(id: number) {
    loading.value = true;
    error.value = null;
    try {
      const response = await ordersService.getOrderById(id);
      return response.data;
    } catch (err) {
      error.value = getApiErrorMessage(err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    orders,
    trackedOrder,
    pagination,
    loading,
    submitting,
    error,
    clearError,
    fetchOrders,
    createOrder,
    trackOrder,
    updateStatus,
    cancelOrder,
    fetchOrderById,
  };
});
