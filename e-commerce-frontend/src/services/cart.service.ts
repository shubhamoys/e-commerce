import { customerServiceApi } from '@/lib/axios';
import { ApiResponse, CartResponse } from '@/types';

interface AddToCartData {
  productId: string;
  quantity: number;
}

interface UpdateCartItemData {
  quantity: number;
}

export const cartService = {
  async getCart(): Promise<ApiResponse<CartResponse>> {
    const response = await customerServiceApi.get('/cart');
    return response.data;
  },

  async addToCart(data: AddToCartData): Promise<ApiResponse<CartResponse>> {
    const response = await customerServiceApi.post('/cart/items', data);
    return response.data;
  },

  async updateCartItem(itemId: string, data: UpdateCartItemData): Promise<ApiResponse<CartResponse>> {
    const response = await customerServiceApi.put(`/cart/items/${itemId}`, data);
    return response.data;
  },

  async removeCartItem(itemId: string): Promise<ApiResponse<CartResponse>> {
    const response = await customerServiceApi.delete(`/cart/items/${itemId}`);
    return response.data;
  },

  async clearCart(): Promise<ApiResponse<{ message: string }>> {
    const response = await customerServiceApi.delete('/cart');
    return response.data;
  },
};
