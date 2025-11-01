import { customerServiceApi } from '@/lib/axios';
import { ApiResponse, AuthResponse, LoginCredentials, RegisterData } from '@/types';

export const authService = {
  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await customerServiceApi.post('/auth/register', data);
    return response.data;
  },

  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await customerServiceApi.post('/auth/login', credentials);
    return response.data;
  },
};
