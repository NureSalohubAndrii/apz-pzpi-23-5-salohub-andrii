import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { Car, Search, Calendar } from 'lucide-react';
import type { FC } from 'react';

interface ProfileStatsProps {
  stats?: {
    totalCarsOwned: number;
    currentCarsOwned: number;
    totalChecksPerformed: number;
    memberSince: string;
  };
}

const ProfileStats: FC<ProfileStatsProps> = ({ stats }) => {
  const { t } = useTranslation();

  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
      {[
        { icon: Car, label: t(StringKey.TOTAL_OWNED), value: stats?.totalCarsOwned ?? 0 },
        { icon: Car, label: t(StringKey.ACTIVE_VEHICLES), value: stats?.currentCarsOwned ?? 0 },
        {
          icon: Search,
          label: t(StringKey.REPORTS_CHECKED),
          value: stats?.totalChecksPerformed ?? 0,
        },
        {
          icon: Calendar,
          label: 'Member since',
          value: stats?.memberSince ? new Date(stats.memberSince).toLocaleDateString() : '—',
        },
      ].map(({ icon: Icon, label, value }) => (
        <Card key={label}>
          <CardContent className='pt-6 flex flex-col items-center text-center gap-2'>
            <Icon className='w-5 h-5 text-muted-foreground' />
            <p className='text-2xl font-bold'>{value}</p>
            <p className='text-xs text-muted-foreground'>{label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProfileStats;
