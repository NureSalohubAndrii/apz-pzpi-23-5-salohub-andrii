import type { ApiResponse } from '@/types/auth.types';
import { apiRequest } from './client';
import type { Car, CarWithOwnership } from '@/types/cars.types';
import type { UserProfile } from '@/types/user.types';

export const getMyCars = () => apiRequest<ApiResponse<Car[]>>('/users/my-cars', { method: 'GET' });

export const getMyStats = () =>
  apiRequest<
    ApiResponse<{
      totalCarsOwned: number;
      currentCarsOwned: number;
      totalChecksPerformed: number;
      memberSince: string;
    }>
  >('/users/stats', { method: 'GET' });

export const getProfile = () =>
  apiRequest<ApiResponse<UserProfile>>('/users/profile', { method: 'GET' });

export const updateProfile = (data: { firstName?: string; lastName?: string }) =>
  apiRequest<ApiResponse<UserProfile>>('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const getMyCarHistory = () =>
  apiRequest<ApiResponse<CarWithOwnership[]>>('/users/my-cars/history', { method: 'GET' });
