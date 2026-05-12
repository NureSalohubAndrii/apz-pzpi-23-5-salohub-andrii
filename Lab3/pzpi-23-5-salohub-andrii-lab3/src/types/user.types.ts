export type UserRole = 'user' | 'moderator' | 'db_admin' | 'super_admin';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  isBlocked: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  totalCarsOwned: number;
  currentCarsOwned: number;
  totalChecksPerformed: number;
  memberSince: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
}
