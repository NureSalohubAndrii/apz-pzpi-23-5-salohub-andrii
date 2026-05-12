import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import type { UserProfile } from '@/types/user.types';

interface ProfileInfoProps {
  profile?: UserProfile;
}

const ProfileInfo: FC<ProfileInfoProps> = ({ profile }) => {
  const { t } = useTranslation();

  const infoItems = [
    {
      label: t(StringKey.EMAIL_ADDRESS),
      value: profile?.email,
      className: 'font-medium',
    },
    {
      label: t(StringKey.ROLE),
      value: profile?.role,
      className: 'font-medium capitalize',
    },
    {
      label: t(StringKey.EMAIL_VERIFIED),
      value: profile?.emailVerified ? t(StringKey.YES) : t(StringKey.NO),
      className: profile?.emailVerified ? 'text-green-600 font-medium' : 'text-red-500 font-medium',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <User className='w-5 h-5' />
          {t(StringKey.PROFILE)}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        {infoItems.map((item, index) => (
          <div key={item.label}>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>{item.label}</span>
              <span className={item.className}>{item.value}</span>
            </div>
            {index < infoItems.length - 1 && <Separator className='mt-3' />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProfileInfo;
