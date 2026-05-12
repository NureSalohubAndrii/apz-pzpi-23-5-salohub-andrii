import type { ApiResponse } from '@/types/auth.types';
import type { CarReport, CheckType } from '@/types/cars.types';
import { apiRequest } from './client';

export const getCarReport = (vin: string, type: CheckType = 'basic') =>
  apiRequest<ApiResponse<CarReport>>(`/reports/${vin}?type=${type}`, { method: 'GET' });
