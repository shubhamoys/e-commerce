// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Cart Types
export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: string;
  customerId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  cart: Cart;
  totalAmount: number;
  itemCount: number;
}

// Order Types
export enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  totalAmount: number;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

// Customer Types
export interface Customer {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
}

export interface AuthResponse {
  customer: Customer;
  token: string;
}

// Customer Order (Order History)
export interface CustomerOrder {
  id: string;
  customerId: string;
  orderId: string;
  totalAmount: number;
  orderDate: string;
  createdAt: string;
  updatedAt: string;
}
