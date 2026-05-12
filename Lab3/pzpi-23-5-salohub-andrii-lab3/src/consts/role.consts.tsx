import type { AdminRole } from '@/types/admin.types';
import { StringKey } from './string-key.consts';

export const ROLE_TRANSLATION_KEY: Record<string, StringKey> = {
  super_admin: StringKey.ROLE_SUPER_ADMIN,
  db_admin: StringKey.ROLE_DB_ADMIN,
  moderator: StringKey.ROLE_MODERATOR,
  user: StringKey.ROLE_USER,
};

export const ROLE_OPTIONS: { value: AdminRole | 'user'; labelKey: StringKey }[] = [
  { value: 'moderator', labelKey: StringKey.ROLE_MODERATOR },
  { value: 'db_admin', labelKey: StringKey.ROLE_DB_ADMIN },
  { value: 'super_admin', labelKey: StringKey.ROLE_SUPER_ADMIN },
  { value: 'user', labelKey: StringKey.ROLE_USER },
];

export const ROLE_BADGE_VARIANTS: Record<string, 'default' | 'secondary' | 'outline'> = {
  super_admin: 'default',
  db_admin: 'secondary',
  moderator: 'outline',
};
