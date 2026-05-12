import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import type { LoginRequest } from '@/types/auth.types';
import { useLoginMutation } from '@/queries/auth.queries';
import { useAuthStore } from '@/store/auth.store';

export const LoginForm = () => {
  const { t } = useTranslation();
  const setAuth = useAuthStore(state => state.setAuth);
  const { mutate, isPending } = useLoginMutation();
  const { register, handleSubmit } = useForm<LoginRequest>();

  const onSubmit = (data: LoginRequest) => {
    mutate(data, {
      onSuccess: res => setAuth(res.data.token, res.data.user),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='email'>{t(StringKey.EMAIL_ADDRESS)}</Label>
        <Input
          id='email'
          type='email'
          placeholder={t(StringKey.EMAIL_PLACEHOLDER)}
          required
          {...register('email')}
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='password'>{t(StringKey.PASSWORD)}</Label>
        <Input id='password' type='password' required {...register('password')} />
      </div>
      <Button type='submit' className='w-full' disabled={isPending}>
        {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
        {t(StringKey.SIGN_IN)}
      </Button>
    </form>
  );
};
