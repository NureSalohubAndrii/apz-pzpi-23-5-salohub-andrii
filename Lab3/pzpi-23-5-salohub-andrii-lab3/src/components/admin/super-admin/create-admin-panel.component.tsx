import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserPlus, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { StringKey } from '@/consts/string-key.consts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

import { useCreateAdminMutation } from '@/queries/admin.queries';
import { ROLE_OPTIONS } from '@/consts/role.consts';
import type { AdminRole } from '@/types/admin.types';

const ADMIN_ROLE_OPTIONS = ROLE_OPTIONS.filter(r =>
  ['moderator', 'db_admin', 'super_admin'].includes(r.value)
);

export const CreateAdminPanel = () => {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    role: '' as AdminRole | '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: createAdmin, isPending } = useCreateAdminMutation();

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
          setForm({
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            confirmPassword: '',
            role: '',
          });
          setErrors({});
        },
      }
    );
  };

  const field = (key: keyof typeof form, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-xl font-bold tracking-tight'>{t(StringKey.CREATE_ADMIN_TITLE)}</h2>
        <p className='text-sm text-muted-foreground'>{t(StringKey.CREATE_ADMIN_DESCRIPTION)}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='text-md font-medium flex items-center gap-2'>
            <ShieldCheck className='w-4 h-4 text-primary' />
            {t(StringKey.CREATE_NEW_ADMIN)}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-5'>
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

          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className='w-full sm:w-auto flex items-center gap-2'
          >
            <UserPlus className='w-4 h-4' />
            {isPending ? t(StringKey.LOADING) : t(StringKey.CREATE_ADMIN)}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
