import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import type { RegisterRequest } from '@/types/auth.types';
import { useAuthStore } from '@/store/auth.store';
import { useRegisterMutation } from '@/queries/auth.queries';

export const RegisterForm = () => {
  const { t } = useTranslation();
  const setPendingUserId = useAuthStore(state => state.setPendingUserId);
  const { mutate, isPending } = useRegisterMutation();
  const { register, handleSubmit } = useForm<RegisterRequest>();

  const onSubmit = (data: RegisterRequest) => {
    mutate(data, {
      onSuccess: res => setPendingUserId(res.data.userId),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='firstName'>{t(StringKey.FIRST_NAME)}</Label>
          <Input id='firstName' {...register('firstName')} />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='lastName'>{t(StringKey.LAST_NAME)}</Label>
          <Input id='lastName' {...register('lastName')} />
        </div>
      </div>
      <div className='space-y-2'>
        <Label htmlFor='reg-email'>{t(StringKey.EMAIL_ADDRESS)}</Label>
        <Input id='reg-email' type='email' required {...register('email')} />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='reg-password'>{t(StringKey.PASSWORD)}</Label>
        <Input id='reg-password' type='password' required {...register('password')} />
      </div>
      <Button type='submit' className='w-full' disabled={isPending}>
        {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
        {t(StringKey.SIGN_UP)}
      </Button>
    </form>
  );
};
