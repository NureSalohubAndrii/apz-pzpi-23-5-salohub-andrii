import type { UserRole } from '@/types/auth.types';

export const isAdmin = (role?: UserRole) =>
  ['moderator', 'db_admin', 'super_admin'].includes(role ?? '');

export const isSuperAdmin = (role?: UserRole) => role === 'super_admin';
export const isDbAdmin = (role?: UserRole) => role === 'db_admin';
export const isModerator = (role?: UserRole) => role === 'moderator';
