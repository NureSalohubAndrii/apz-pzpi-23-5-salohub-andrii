import type { ApiResponse } from '@/types/auth.types';
import type { CarEvent, CreateEventRequest } from '@/types/cars.types';
import { apiRequest } from './client';

export const getCarEvents = (carId: string) =>
  apiRequest<ApiResponse<CarEvent[]>>(`/events/car/${carId}`, { method: 'GET' });

export const createEvent = (data: CreateEventRequest) =>
  apiRequest<ApiResponse<CarEvent>>('/events', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateEvent = (
  eventId: string,
  data: Partial<Pick<CreateEventRequest, 'description' | 'cost' | 'documentUrl' | 'severity'>>
) =>
  apiRequest<ApiResponse<CarEvent>>(`/events/${eventId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteEvent = (eventId: string) =>
  apiRequest<ApiResponse<void>>(`/events/${eventId}`, { method: 'DELETE' });
