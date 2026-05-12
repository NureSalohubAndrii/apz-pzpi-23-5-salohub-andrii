export interface Car {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  engineType?: string;
  transmission?: 'manual' | 'automatic' | 'cvt' | 'dual-clutch';
  fuelType?: 'petrol' | 'diesel' | 'hybrid' | 'electric' | 'lpg' | 'hydrogen';
  currentMileage: number;
  mileageUnit: 'km' | 'mi';
  status: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  description?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface CarOwnership {
  startedAt: string;
  endedAt: string | null;
  isCurrent: boolean;
  startedMileage: number | null;
}

export interface CarWithOwnership extends Car {
  ownership: CarOwnership;
}

export type CheckType = 'basic' | 'extended' | 'premium';
export type EventType =
  | 'accident'
  | 'service'
  | 'inspection'
  | 'repair'
  | 'mileage_update'
  | 'sale'
  | 'mileage_tampering'
  | 'other';
export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface CarEvent {
  id: string;
  carId: string;
  eventType: EventType;
  severity?: Severity;
  description?: string;
  mileage?: number;
  location?: string;
  cost?: string;
  verifiedByIot: boolean;
  documentUrl?: string;
  reportedBy?: string;
  eventDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CarOwnershipRecord {
  startedAt: string;
  endedAt: string | null;
  isCurrent: boolean;
}

export interface Recommendation {
  severity: Severity;
  message: string;
}

export interface CarReport {
  reportType: CheckType;
  generatedAt: string;
  car: Car;
  events: CarEvent[];
  owners: CarOwnershipRecord[];
  recommendations: Recommendation[];
}

export interface CreateEventRequest {
  carId: string;
  eventType: EventType;
  severity?: Severity;
  description?: string;
  mileage?: number;
  location?: string;
  cost?: string;
  documentUrl?: string;
  eventDate: string;
}
