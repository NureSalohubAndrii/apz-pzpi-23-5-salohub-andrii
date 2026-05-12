import { useMyCarHistoryQuery } from '@/queries/users.queries';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { Car } from 'lucide-react';
import HistorySkeleton from '@/components/history/history-skeleton.component';
import CarHistoryItem from '@/components/history/car-history-item.component';

const HistoryPage = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useMyCarHistoryQuery();
  const cars = data?.data ?? [];

  if (isLoading) {
    return <HistorySkeleton />;
  }

  return (
    <div className='container max-w-4xl mx-auto py-10 space-y-6'>
      <div className='space-y-1'>
        <h1 className='text-2xl font-bold'>{t(StringKey.CHECK_HISTORY)}</h1>
        <p className='text-muted-foreground text-sm'>{t(StringKey.MANAGE_VEHICLES_DESCRIPTION)}</p>
      </div>

      {cars.length === 0 ? (
        <div className='text-center py-20 space-y-3'>
          <Car className='w-12 h-12 mx-auto text-muted-foreground' />
          <p className='text-muted-foreground'>{t(StringKey.NO_CARS_YET)}</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {cars.map(car => (
            <CarHistoryItem key={`${car.id}-${car.ownership.startedAt}`} car={car} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
