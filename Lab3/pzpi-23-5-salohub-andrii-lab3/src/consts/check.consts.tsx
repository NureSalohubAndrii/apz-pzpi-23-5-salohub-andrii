import type { CheckType } from '@/types/cars.types';
import { StringKey } from './string-key.consts';

export const REC_COLORS: Record<string, string> = {
  low: 'bg-green-50 border-green-200 text-green-800',
  medium: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  high: 'bg-orange-50 border-orange-200 text-orange-800',
  critical: 'bg-red-50 border-red-200 text-red-800',
};

export const CHECK_TYPES: CheckType[] = ['basic', 'extended', 'premium'];

export const CHECK_TYPE_KEY: Record<CheckType, StringKey> = {
  basic: StringKey.REPORT_TYPE_BASIC,
  extended: StringKey.REPORT_TYPE_EXTENDED,
  premium: StringKey.REPORT_TYPE_PREMIUM,
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
