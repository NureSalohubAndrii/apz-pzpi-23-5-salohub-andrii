export type AdminRole = 'super_admin' | 'db_admin' | 'moderator';

export interface AdminUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  isBlocked: boolean;
  emailVerified: boolean;
  createdAt: string;
}

export interface Backup {
  filename: string;
  size: string;
  createdAt: string;
}

export interface DbTableStat {
  tableName: string;
  rawBytes: number;
  formattedSize: string;
  percentage: string;
}

export interface DbAnalysis {
  stats: DbTableStat[];
  totalSize: string;
}

export interface CarAwaitingVerification {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  riskScore: number;
  currentMileage: number;
  status: string;
  createdAt: string;
  currentOwner: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  } | null;
  tamperingIncidents: number;
  priority: 'high' | 'medium' | 'low';
}

export interface VerificationStats {
  totals: {
    allCars: number;
    verified: number;
    pendingVerification: number;
    rejected: number;
  };
  rates: {
    verificationRate: string;
    pendingRate: string;
  };
  recentActivity: {
    carVin: string;
    carInfo: string;
    action: string;
    date: string;
  }[];
}

export interface RecentActivity {
  timeWindow: string;
  summary: {
    newUsers: number;
    checksPerformed: number;
    eventsReported: number;
    totalActivity: number;
  };
  details: {
    recentChecks: any[];
    recentEvents: any[];
    newUsers: any[];
  };
}
