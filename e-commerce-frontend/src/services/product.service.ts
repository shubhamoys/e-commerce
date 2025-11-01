import { productServiceApi } from '@/lib/axios';
import { ApiResponse, Product, ProductsResponse } from '@/types';

interface GetProductsParams {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export const productService = {
  async getProducts(params?: GetProductsParams): Promise<ApiResponse<ProductsResponse>> {
    const response = await productServiceApi.get('/products', { params });
    return response.data;
  },

  async getProduct(id: string): Promise<ApiResponse<{ product: Product }>> {
    const response = await productServiceApi.get(`/products/${id}`);
    return response.data;
  },
};
