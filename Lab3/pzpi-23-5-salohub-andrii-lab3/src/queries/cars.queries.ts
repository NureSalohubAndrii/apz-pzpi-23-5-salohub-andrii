import { getCarByVIN } from '@/api/cars.api';
import { createEvent, deleteEvent, getCarEvents, updateEvent } from '@/api/events.api';
import { getCarReport } from '@/api/reports.api';
import { QueryKey } from '@/consts/query-key.consts';
import type { CheckType, CreateEventRequest } from '@/types/cars.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useCarDetailsQuery = (vin: string) =>
  useQuery({
    queryKey: [QueryKey.CAR, vin],
    queryFn: () => getCarByVIN(vin),
    enabled: !!vin,
  });

export const useGetCarByVINMutation = () =>
  useMutation({
    mutationFn: (vinCode: string) => getCarByVIN(vinCode),
  });

export const useCarReportQuery = (vin: string, type: CheckType) =>
  useQuery({
    queryKey: [QueryKey.REPORT, vin, type],
    queryFn: () => getCarReport(vin, type),
    enabled: !!vin,
  });

export const useCarEventsQuery = (carId: string) =>
  useQuery({
    queryKey: [QueryKey.EVENTS, carId],
    queryFn: () => getCarEvents(carId),
    enabled: !!carId,
  });

export const useCreateEventMutation = (carId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEventRequest) => createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.EVENTS, carId] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.CAR] });
    },
  });
};

export const useUpdateEventMutation = (carId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateEventRequest> }) =>
      updateEvent(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKey.EVENTS, carId] }),
  });
};

export const useDeleteEventMutation = (carId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEvent(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKey.EVENTS, carId] }),
  });
};
