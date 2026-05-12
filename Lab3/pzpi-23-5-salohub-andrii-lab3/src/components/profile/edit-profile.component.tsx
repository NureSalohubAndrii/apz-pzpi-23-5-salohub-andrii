import { useForm } from 'react-hook-form';
import { useEffect, type FC } from 'react';
import { useUpdateProfileMutation } from '@/queries/users.queries';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import type { UserProfile } from '@/types/user.types';

interface EditProfileFormProps {
  profile: UserProfile;
}

const EditProfileForm: FC<EditProfileFormProps> = ({ profile }) => {
  const { t } = useTranslation();
  const { mutate, isPending } = useUpdateProfileMutation();

  const { register, handleSubmit, reset } = useForm<{
    firstName: string;
    lastName: string;
  }>();

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName ?? '',
        lastName: profile.lastName ?? '',
      });
    }
  }, [profile, reset]);

  const onSubmit = (data: { firstName: string; lastName: string }) => {
    mutate(data, {
      onSuccess: () => toast.success(t(StringKey.PROFILE_UPDATED)),
      onError: () => toast.error(t(StringKey.PROFILE_UPDATE_FAILED)),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t(StringKey.EDIT_PROFILE)}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='firstName'>{t(StringKey.FIRST_NAME)}</Label>
              <Input id='firstName' {...register('firstName')} />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='lastName'>{t(StringKey.LAST_NAME)}</Label>
              <Input id='lastName' {...register('lastName')} />
            </div>
          </div>
          <Button type='submit' disabled={isPending}>
            {isPending ? t(StringKey.LOADING) : t(StringKey.SAVE_CHANGES)}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditProfileForm;
