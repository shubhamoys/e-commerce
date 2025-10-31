import axios from 'axios';
import { ConfigService } from '@nestjs/config';

export class ProductServiceClient {
  private readonly baseURL: string;

  constructor(configService: ConfigService) {
    this.baseURL = configService.get<string>('PRODUCT_SERVICE_URL')!;
  }

  async getProduct(productId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseURL}/products/${productId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Product not found');
      }
      throw new Error('Failed to fetch product from Product Service');
    }
  }
}
