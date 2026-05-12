import { create } from 'zustand';
import { queryClient } from '@/lib/query-client';
import type { User } from '@/types/auth.types';

interface AuthState {
  pendingUserId: string | null;
  setPendingUserId: (id: string) => void;

  user: User | null;
  accessToken: string | null;

  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  pendingUserId: localStorage.getItem('pendingUserId'),
  accessToken: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),

  setPendingUserId: id => {
    localStorage.setItem('pendingUserId', id);
    set({ pendingUserId: id });
  },

  setAuth: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.removeItem('pendingUserId');

    set({
      accessToken: token,
      user,
      pendingUserId: null,
    });
  },

  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('pendingUserId');

    set({
      accessToken: null,
      user: null,
      pendingUserId: null,
    });

    queryClient.clear();
  },
}));

export const { setAuth, clearAuth } = useAuthStore.getState();
