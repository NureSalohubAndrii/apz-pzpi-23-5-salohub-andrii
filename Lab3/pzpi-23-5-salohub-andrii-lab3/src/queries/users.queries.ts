import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProfile, updateProfile, getMyCars, getMyStats, getMyCarHistory } from '@/api/users.api';
import { QueryKey } from '@/consts/query-key.consts';

export const useProfileQuery = () =>
  useQuery({
    queryKey: [QueryKey.PROFILE],
    queryFn: getProfile,
  });

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.PROFILE] });
    },
  });
};

export const useMyCarsQuery = () =>
  useQuery({
    queryKey: [QueryKey.MY_CARS],
    queryFn: getMyCars,
  });

export const useMyStatsQuery = () =>
  useQuery({
    queryKey: [QueryKey.MY_STATS],
    queryFn: getMyStats,
  });

export const useMyCarHistoryQuery = () =>
  useQuery({
    queryKey: [QueryKey.MY_CARS_HISTORY],
    queryFn: getMyCarHistory,
  });
