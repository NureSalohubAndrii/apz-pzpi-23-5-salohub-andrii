import type { Severity } from '@/types/cars.types';
import { StringKey } from './string-key.consts';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export const SEVERITY_BADGE: Record<Severity, 'default' | 'secondary' | 'destructive' | 'outline'> =
  {
    low: 'outline',
    medium: 'secondary',
    high: 'destructive',
    critical: 'destructive',
  };

export const SEVERITY_KEY: Record<Severity, StringKey> = {
  low: StringKey.SEVERITY_LOW,
  medium: StringKey.SEVERITY_MEDIUM,
  high: StringKey.SEVERITY_HIGH,
  critical: StringKey.SEVERITY_CRITICAL,
};

export const EVENT_TYPE_KEY: Record<string, StringKey> = {
  accident: StringKey.EVENT_TYPE_ACCIDENT,
  mileage_tampering: StringKey.EVENT_TYPE_MILEAGE_TAMPERING,
  service: StringKey.EVENT_TYPE_SERVICE,
  inspection: StringKey.EVENT_TYPE_INSPECTION,
  repair: StringKey.EVENT_TYPE_REPAIR,
  mileage_update: StringKey.EVENT_TYPE_MILEAGE_UPDATE,
  sale: StringKey.EVENT_TYPE_SALE,
  other: StringKey.EVENT_TYPE_OTHER,
};

export const EVENT_ICONS: Record<string, React.ReactNode> = {
  accident: <AlertTriangle className='w-4 h-4 text-red-500' />,
  mileage_tampering: <AlertTriangle className='w-4 h-4 text-orange-500' />,
  service: <CheckCircle className='w-4 h-4 text-green-500' />,
  inspection: <CheckCircle className='w-4 h-4 text-blue-500' />,
};

export const EVENT_TYPES = [
  { value: 'accident', key: StringKey.EVENT_TYPE_ACCIDENT },
  { value: 'service', key: StringKey.EVENT_TYPE_SERVICE },
  { value: 'inspection', key: StringKey.EVENT_TYPE_INSPECTION },
  { value: 'repair', key: StringKey.EVENT_TYPE_REPAIR },
  { value: 'mileage_update', key: StringKey.EVENT_TYPE_MILEAGE_UPDATE },
  { value: 'sale', key: StringKey.EVENT_TYPE_SALE },
  { value: 'other', key: StringKey.EVENT_TYPE_OTHER },
];

export const SEVERITIES: { value: Severity; key: StringKey }[] = [
  { value: 'low', key: StringKey.SEVERITY_LOW },
  { value: 'medium', key: StringKey.SEVERITY_MEDIUM },
  { value: 'high', key: StringKey.SEVERITY_HIGH },
  { value: 'critical', key: StringKey.SEVERITY_CRITICAL },
];
