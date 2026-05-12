import { clearAuth, setAuth } from '@/store/auth.store';
import type { LoginType } from '@/types/auth.types';

export const BASE_URL = import.meta.env.VITE_API_URL as string;

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, data: unknown) {
    super(`API Error: ${status}`);
    this.status = status;
    this.data = data;
  }
}

export const apiRequest = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const { headers, ...rest } = options;
  const token = localStorage.getItem('token');
  const loginType = localStorage.getItem('loginType');

  const makeRequest = (currentToken: string | null) =>
    fetch(`${BASE_URL}${path}`, {
      ...rest,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
        ...(headers as Record<string, string>),
      },
    });

  let response = await makeRequest(token);

  if (response.status === 401 && path !== '/auth/login' && path !== '/auth/refresh') {
    try {
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (refreshRes.ok) {
        const { accessToken } = await refreshRes.json();
        localStorage.setItem('token', accessToken);

        setAuth(accessToken, (loginType ?? 'user') as LoginType);

        response = await makeRequest(accessToken);
      } else {
        clearAuth();
        window.location.href = '/login';
      }
    } catch (err) {
      throw new ApiError(401, { message: 'Session expired' });
    }
  }

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, data);
  }

  return data as T;
};
