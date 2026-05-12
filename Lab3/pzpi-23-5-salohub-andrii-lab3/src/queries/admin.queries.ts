import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  blockUser,
  unblockUser,
  createBackup,
  getBackups,
  deleteBackup,
  restoreBackup,
  getDbAnalysis,
  optimizeDb,
  getCarsAwaitingVerification,
  verifyCar,
  getVerificationStats,
  getRecentActivity,
  getAdminUsers,
  setUserRole,
  deleteUser,
  createAdminUser,
} from '@/api/admin.api';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { StringKey } from '@/consts/string-key.consts';
import type { AdminRole } from '@/types/admin.types';

export const useBlockUserMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      blockUser(userId, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });
};

export const useUnblockUserMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => unblockUser(userId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });
};

export const useBackupsQuery = () => useQuery({ queryKey: ['backups'], queryFn: getBackups });

export const useCreateBackupMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createBackup,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['backups'] }),
  });
};

export const useDeleteBackupMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (filename: string) => deleteBackup(filename),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['backups'] }),
  });
};

export const useRestoreBackupMutation = () =>
  useMutation({ mutationFn: (filename: string) => restoreBackup(filename) });

export const useDbAnalysisQuery = () =>
  useQuery({ queryKey: ['db-analysis'], queryFn: getDbAnalysis });

export const useOptimizeDbMutation = () => useMutation({ mutationFn: optimizeDb });

export const useCarsAwaitingVerificationQuery = (limit?: number) =>
  useQuery({
    queryKey: ['cars-awaiting-verification', limit],
    queryFn: () => getCarsAwaitingVerification(limit),
  });

export const useVerifyCarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      carId,
      data,
    }: {
      carId: string;
      data: { isVerified: boolean; verificationNotes?: string };
    }) => verifyCar(carId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars-awaiting-verification'] });
      queryClient.invalidateQueries({ queryKey: ['verification-stats'] });
    },
  });
};

export const useVerificationStatsQuery = () =>
  useQuery({ queryKey: ['verification-stats'], queryFn: getVerificationStats });

export const useRecentActivityQuery = (limitMinutes?: number) =>
  useQuery({
    queryKey: ['recent-activity', limitMinutes],
    queryFn: () => getRecentActivity(limitMinutes),
    refetchInterval: 30_000,
  });

export const useAdminUsersQuery = () =>
  useQuery({
    queryKey: ['admin-users'],
    queryFn: getAdminUsers,
  });

export const useSetUserRoleMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: AdminRole | 'user' }) =>
      setUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(t(StringKey.ROLE_UPDATED_SUCCESS));
    },
    onError: () => toast.error(t(StringKey.ERROR)),
  });
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(t(StringKey.USER_DELETED_SUCCESS));
    },
    onError: () => toast.error(t(StringKey.ERROR)),
  });
};

export const useCreateAdminMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (data: {
      email: string;
      firstName: string;
      lastName: string;
      password: string;
      role: AdminRole;
    }) => createAdminUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(t(StringKey.ADMIN_CREATED_SUCCESS));
    },
    onError: () => toast.error(t(StringKey.ERROR)),
  });
};
