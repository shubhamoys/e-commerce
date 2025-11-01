import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Customer } from '@/types';

interface AuthState {
  customer: Customer | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (customer: Customer, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      customer: null,
      token: null,
      isAuthenticated: false,
      setAuth: (customer, token) => {
        localStorage.setItem('token', token);
        set({ customer, token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ customer: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        customer: state.customer,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
