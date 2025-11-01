import { productServiceApi, customerServiceApi } from '@/lib/axios';
import { ApiResponse, Order, CustomerOrder } from '@/types';

interface CreateOrderData {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}

export const orderService = {
  async createOrder(data: CreateOrderData): Promise<ApiResponse<{ order: Order }>> {
    const response = await productServiceApi.post('/orders', data);
    return response.data;
  },

  async getOrder(id: string): Promise<ApiResponse<{ order: Order }>> {
    const response = await productServiceApi.get(`/orders/${id}`);
    return response.data;
  },

  async getOrderHistory(): Promise<ApiResponse<{ orders: CustomerOrder[] }>> {
    const response = await customerServiceApi.get('/customers/orders');
    return response.data;
  },
};
