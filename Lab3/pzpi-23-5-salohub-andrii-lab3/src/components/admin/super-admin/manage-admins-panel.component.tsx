import { useTranslation } from 'react-i18next';
import { Shield, UserCog, Calendar, UserPlus, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { StringKey } from '@/consts/string-key.consts';
import { useAuthStore } from '@/store/auth.store';
import { useLocale } from '@/hooks/use-locale.hook';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  useAdminUsersQuery,
  useCreateAdminMutation,
  useDeleteUserMutation,
  useSetUserRoleMutation,
} from '@/queries/admin.queries';
import type { AdminRole } from '@/types/admin.types';
import DeleteAdminDialog from './delete-admin-dialog.component';
import { ROLE_BADGE_VARIANTS, ROLE_OPTIONS, ROLE_TRANSLATION_KEY } from '@/consts/role.consts';
import { useState } from 'react';

const ADMIN_ROLE_OPTIONS = ROLE_OPTIONS.filter(r => ['moderator', 'db_admin'].includes(r.value));

const initialForm = {
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  confirmPassword: '',
  role: '' as AdminRole | '',
};

export const ManageAdminsPanel = () => {
  const { t } = useTranslation();
  const { user: currentUser } = useAuthStore();
  const { formatDateTime } = useLocale();

  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data, isLoading } = useAdminUsersQuery();
  const { mutate: updateRole, isPending: isUpdating } = useSetUserRoleMutation();
  const { mutate: removeUser, isPending: isDeleting } = useDeleteUserMutation();
  const { mutate: createAdmin, isPending: isCreating } = useCreateAdminMutation();

  const admins = (data?.data ?? []).filter(user => user.role !== 'user');

  const field = (key: keyof typeof form, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.email) next.email = t(StringKey.EMAIL_ADDRESS);
    if (!form.firstName) next.firstName = t(StringKey.FIRST_NAME);
    if (!form.lastName) next.lastName = t(StringKey.LAST_NAME);
    if (!form.role) next.role = t(StringKey.ADMIN_ROLE);
    if (form.password.length < 8) next.password = t(StringKey.PASSWORD_MIN_LENGTH);
    if (form.password !== form.confirmPassword)
      next.confirmPassword = t(StringKey.PASSWORDS_DO_NOT_MATCH);
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    createAdmin(
      {
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        password: form.password,
        role: form.role as AdminRole,
      },
      {
        onSuccess: () => {
          setForm(initialForm);
          setErrors({});
        },
      }
    );
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-xl font-bold tracking-tight'>{t(StringKey.ADMIN_USERS_TITLE)}</h2>
          <p className='text-sm text-muted-foreground'>{t(StringKey.ADMIN_USERS_DESCRIPTION)}</p>
        </div>
      </div>

      {/* Create Admin Card */}
      <Card>
        <CardHeader>
          <CardTitle className='text-md font-medium flex items-center gap-2'>
            <ShieldCheck className='w-4 h-4 text-primary' />
            {t(StringKey.CREATE_NEW_ADMIN)}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <Label htmlFor='firstName'>{t(StringKey.FIRST_NAME)}</Label>
              <Input
                id='firstName'
                value={form.firstName}
                onChange={e => field('firstName', e.target.value)}
                placeholder='John'
              />
              {errors.firstName && <p className='text-xs text-destructive'>{errors.firstName}</p>}
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='lastName'>{t(StringKey.LAST_NAME)}</Label>
              <Input
                id='lastName'
                value={form.lastName}
                onChange={e => field('lastName', e.target.value)}
                placeholder='Doe'
              />
              {errors.lastName && <p className='text-xs text-destructive'>{errors.lastName}</p>}
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <Label htmlFor='email'>{t(StringKey.EMAIL_ADDRESS)}</Label>
              <Input
                id='email'
                type='email'
                value={form.email}
                onChange={e => field('email', e.target.value)}
                placeholder={t(StringKey.EMAIL_PLACEHOLDER)}
              />
              {errors.email && <p className='text-xs text-destructive'>{errors.email}</p>}
            </div>
            <div className='space-y-1.5'>
              <Label>{t(StringKey.ADMIN_ROLE)}</Label>
              <Select value={form.role} onValueChange={v => field('role', v)}>
                <SelectTrigger>
                  <SelectValue placeholder={t(StringKey.ASSIGN_ROLE)} />
                </SelectTrigger>
                <SelectContent>
                  {ADMIN_ROLE_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {t(opt.labelKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && <p className='text-xs text-destructive'>{errors.role}</p>}
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <Label htmlFor='password'>{t(StringKey.PASSWORD)}</Label>
              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => field('password', e.target.value)}
                  className='pr-10'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(p => !p)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                >
                  {showPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                </button>
              </div>
              {errors.password && <p className='text-xs text-destructive'>{errors.password}</p>}
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='confirmPassword'>{t(StringKey.CONFIRM_PASSWORD)}</Label>
              <div className='relative'>
                <Input
                  id='confirmPassword'
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={e => field('confirmPassword', e.target.value)}
                  className='pr-10'
                />
                <button
                  type='button'
                  onClick={() => setShowConfirm(p => !p)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                >
                  {showConfirm ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className='text-xs text-destructive'>{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <Button onClick={handleSubmit} disabled={isCreating} className='flex items-center gap-2'>
            <UserPlus className='w-4 h-4' />
            {isCreating ? t(StringKey.LOADING) : t(StringKey.CREATE_ADMIN)}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Admins Card */}
      <Card>
        <CardHeader>
          <CardTitle className='text-md font-medium'>
            {t(StringKey.CURRENT_ADMINS)} ({admins.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='space-y-3'>
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className='h-20 bg-muted animate-pulse rounded-xl' />
              ))}
            </div>
          ) : admins.length === 0 ? (
            <div className='text-center py-12 border-2 border-dashed rounded-xl'>
              <p className='text-muted-foreground'>{t(StringKey.NO_ADMINS_YET)}</p>
            </div>
          ) : (
            <div className='grid gap-4'>
              {admins.map(admin => {
                const isSelf = admin.id === currentUser?.id;

                return (
                  <div
                    key={admin.id}
                    className='flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl gap-4 hover:bg-accent/5 transition-colors'
                  >
                    <div className='flex items-start gap-3'>
                      <div className='mt-1 p-2 bg-primary/10 rounded-lg'>
                        <Shield className='w-5 h-5 text-primary' />
                      </div>
                      <div className='space-y-1'>
                        <div className='flex items-center gap-2 flex-wrap'>
                          <span className='font-semibold text-sm'>{admin.email}</span>
                          {isSelf && (
                            <Badge variant='outline' className='text-[10px] uppercase'>
                              {t(StringKey.CURRENT)}
                            </Badge>
                          )}
                          <Badge variant={ROLE_BADGE_VARIANTS[admin.role] ?? 'outline'}>
                            {t(ROLE_TRANSLATION_KEY[admin.role] || StringKey.ERROR)}
                          </Badge>
                        </div>
                        <div className='flex items-center gap-3 text-xs text-muted-foreground'>
                          <span className='flex items-center gap-1'>
                            <UserCog className='w-3 h-3' />
                            {admin.firstName} {admin.lastName}
                          </span>
                          <span className='flex items-center gap-1'>
                            <Calendar className='w-3 h-3' />
                            {formatDateTime(admin.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center gap-2 ml-auto sm:ml-0'>
                      <Select
                        disabled={isSelf || isUpdating}
                        defaultValue={admin.role}
                        onValueChange={newRole =>
                          updateRole({ userId: admin.id, role: newRole as AdminRole })
                        }
                      >
                        <SelectTrigger className='w-40 h-9'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLE_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {t(option.labelKey)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <DeleteAdminDialog
                        adminEmail={admin.email}
                        onConfirm={() => removeUser(admin.id)}
                        disabled={isSelf || isDeleting}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
