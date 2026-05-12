import type { ApiResponse } from '@/types/auth.types';
import type {
  Backup,
  DbAnalysis,
  CarAwaitingVerification,
  VerificationStats,
  RecentActivity,
  AdminUser,
  AdminRole,
} from '@/types/admin.types';
import { apiRequest } from './client';

export const blockUser = (userId: string, reason: string) =>
  apiRequest<ApiResponse<{ userId: string; status: string; reason: string }>>(
    `/admin/users/${userId}/block`,
    { method: 'PATCH', body: JSON.stringify({ reason }) }
  );

export const unblockUser = (userId: string) =>
  apiRequest<ApiResponse<{ userId: string; status: string }>>(`/admin/users/${userId}/unblock`, {
    method: 'PATCH',
  });

export const createBackup = () =>
  apiRequest<ApiResponse<Backup>>('/admin/db/backup', { method: 'POST' });

export const getBackups = () =>
  apiRequest<ApiResponse<Backup[]>>('/admin/db/backups', { method: 'GET' });

export const deleteBackup = (filename: string) =>
  apiRequest<ApiResponse<{ message: string }>>('/admin/db/backups', {
    method: 'DELETE',
    body: JSON.stringify({ filename }),
  });

export const restoreBackup = (filename: string) =>
  apiRequest<ApiResponse<{ message: string }>>('/admin/db/restore', {
    method: 'POST',
    body: JSON.stringify({ filename }),
  });

export const getDbAnalysis = () =>
  apiRequest<ApiResponse<DbAnalysis>>('/admin/db/analysis', { method: 'GET' });

export const optimizeDb = () =>
  apiRequest<ApiResponse<{ status: string; message: string }>>('/admin/db/optimize', {
    method: 'POST',
  });

export const getCarsAwaitingVerification = (limit = 50) =>
  apiRequest<ApiResponse<CarAwaitingVerification[]>>(
    `/admin/cars/awaiting-verification?limit=${limit}`,
    { method: 'GET' }
  );

export const verifyCar = (
  carId: string,
  data: { isVerified: boolean; verificationNotes?: string }
) =>
  apiRequest<ApiResponse<{ carId: string; isVerified: boolean; message: string }>>(
    `/admin/cars/${carId}/verify`,
    { method: 'PATCH', body: JSON.stringify(data) }
  );

export const getVerificationStats = () =>
  apiRequest<ApiResponse<VerificationStats>>('/admin/verification-stats', { method: 'GET' });

export const getRecentActivity = (limitMinutes = 60) =>
  apiRequest<ApiResponse<RecentActivity>>(`/admin/recent-activity?limitMinutes=${limitMinutes}`, {
    method: 'GET',
  });

export const getAdminUsers = () =>
  apiRequest<ApiResponse<AdminUser[]>>('/admin/users', { method: 'GET' });

export const setUserRole = (userId: string, role: AdminRole | 'user') =>
  apiRequest<ApiResponse<AdminUser>>(`/admin/users/${userId}/set-role`, {
    method: 'POST',
    body: JSON.stringify({ role }),
  });

export const searchUsers = (email: string) =>
  apiRequest<ApiResponse<AdminUser[]>>(`/admin/users/search?email=${email}`, {
    method: 'GET',
  });

export const deleteUser = (userId: string) =>
  apiRequest<ApiResponse<{ success: boolean }>>(`/admin/users/${userId}`, {
    method: 'DELETE',
  });

export const createAdminUser = (data: {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: AdminRole;
}) =>
  apiRequest<ApiResponse<AdminUser>>('/admin/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
