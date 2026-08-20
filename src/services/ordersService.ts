import api from './axios';
import type { Order, CreateOrderPayload, OrderFilters, ApiResponse, OrderStatus } from '../types';

export const ordersService = {
  async getOrders(params: OrderFilters) {
    const response = await api.get<ApiResponse<Order[]>>('/orders', { params });
    return response.data;
  },

  async createOrder(payload: CreateOrderPayload) {
    const response = await api.post<ApiResponse<Order>>('/orders', payload);
    return response.data;
  },

  async trackOrder(trackingNumber: string) {
    const response = await api.get<ApiResponse<Order>>(`/orders/track/${trackingNumber}`);
    return response.data;
  },

  async updateStatus(id: number, status: OrderStatus) {
    const response = await api.patch<ApiResponse<Order>>(`/orders/${id}/status`, { status });
    return response.data;
  },

  async cancelOrder(id: number) {
    const response = await api.patch<ApiResponse<Order>>(`/orders/${id}/cancel`);
    return response.data;
  },

  async getOrderById(id: number) {
    const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data;
  },
};
