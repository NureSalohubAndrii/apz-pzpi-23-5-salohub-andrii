import { useParams } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck } from 'lucide-react';
import { useCarDetailsQuery } from '@/queries/cars.queries';
import CarInfoCards from '@/components/car-details/car-info-cards.component';
import ReportSection from '@/components/car-details/report-section.component';
import EventsSection from '@/components/car-details/events-section.component';

const CarDetailsPage = () => {
  const { t } = useTranslation();
  const { vin } = useParams({ from: '/cars/vin/$vin' });
  const { data, isLoading } = useCarDetailsQuery(vin);
  const car = data?.data;

  if (isLoading) {
    return <div className='text-center p-20'>...</div>;
  }
  if (!car) {
    return <div className='text-center p-20'>404</div>;
  }

  return (
    <div className='container max-w-4xl mx-auto py-10 space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-4xl font-bold'>
          {car.make} {car.model}
        </h1>
        {car.isVerified && (
          <Badge className='bg-blue-100 text-blue-700'>
            <ShieldCheck className='w-4 h-4 mr-1' />
            {t(StringKey.VERIFIED_VEHICLE)}
          </Badge>
        )}
      </div>

      <CarInfoCards car={car} />
      <ReportSection vin={vin} />
      <EventsSection carId={car.id} />
    </div>
  );
};

export default CarDetailsPage;
