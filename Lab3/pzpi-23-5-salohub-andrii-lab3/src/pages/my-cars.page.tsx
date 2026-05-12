import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { Car as CarIcon } from 'lucide-react';
import { useMyCarsQuery } from '@/queries/users.queries';
import AddVehicleDialog from '@/components/my-cars/add-vehicle-dialog.component';
import StatsLayout from '@/components/my-cars/stats-layout.component';
import CarItem from '@/components/my-cars/car-item.component';

const MyCarsPage = () => {
  const { t } = useTranslation();

  const { data: carsData, isLoading: carsLoading } = useMyCarsQuery();

  const cars = carsData?.data || [];

  return (
    <div className='container mx-auto py-10 space-y-8'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div className='space-y-1'>
          <h1 className='text-3xl font-bold tracking-tight'>{t(StringKey.MY_CARS)}</h1>
          <p className='text-muted-foreground'>{t(StringKey.MANAGE_VEHICLES_DESCRIPTION)}</p>
        </div>

        <AddVehicleDialog />
      </div>

      <StatsLayout />

      {carsLoading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[1, 2, 3].map(i => (
            <div key={i} className='h-48 bg-slate-100 animate-pulse rounded-xl' />
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {cars.map(car => (
            <CarItem car={car} key={car.id} />
          ))}

          {cars.length === 0 && (
            <div className='col-span-full py-20 text-center border-2 border-dashed rounded-xl flex flex-col items-center'>
              <CarIcon className='w-12 h-12 text-slate-300 mb-4' />
              <h3 className='text-lg font-semibold'>{t(StringKey.NO_CARS_YET)}</h3>
              <p className='text-slate-500 max-w-sm mb-6'>{t(StringKey.ADD_FIRST_CAR)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyCarsPage;
