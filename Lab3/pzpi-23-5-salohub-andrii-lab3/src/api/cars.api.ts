import type { ApiResponse } from '@/types/auth.types';
import { apiRequest } from './client';
import type { Car, CarReport } from '@/types/cars.types';

export const getCarByVIN = (vin: string) =>
  apiRequest<ApiResponse<Car>>(`/cars/vin/${vin}`, { method: 'GET' });

export const createCar = (data: Partial<Car>) =>
  apiRequest<ApiResponse<Car>>('/cars', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const getCarReport = (vin: string) =>
  apiRequest<ApiResponse<CarReport>>(`/reports/${vin}`, { method: 'GET' });
