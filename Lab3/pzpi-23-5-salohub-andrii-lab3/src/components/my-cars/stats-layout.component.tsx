import { useTranslation } from 'react-i18next';
import StatsCard from './stats-card.component';
import { useMyStatsQuery } from '@/queries/users.queries';
import { StringKey } from '@/consts/string-key.consts';
import { CarIcon, Gauge, ShieldAlert } from 'lucide-react';

const StatsLayout = () => {
  const { t } = useTranslation();

  const { data: statsData } = useMyStatsQuery();
  const stats = statsData?.data;

  return (
    <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
      <StatsCard
        title={t(StringKey.TOTAL_OWNED)}
        value={stats?.totalCarsOwned || 0}
        icon={<CarIcon className='w-4 h-4 text-blue-500' />}
      />
      <StatsCard
        title={t(StringKey.ACTIVE_VEHICLES)}
        value={stats?.currentCarsOwned || 0}
        icon={<Gauge className='w-4 h-4 text-green-500' />}
      />
      <StatsCard
        title={t(StringKey.REPORTS_CHECKED)}
        value={stats?.totalChecksPerformed || 0}
        icon={<ShieldAlert className='w-4 h-4 text-orange-500' />}
      />
    </div>
  );
};

export default StatsLayout;
