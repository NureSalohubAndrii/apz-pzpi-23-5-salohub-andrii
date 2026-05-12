import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Car } from '@/types/cars.types';
import { Link } from '@tanstack/react-router';
import type { FC } from 'react';
import { Badge } from '../ui/badge';
import { Calendar, ChevronRight, Gauge } from 'lucide-react';
import { StringKey } from '@/consts/string-key.consts';
import { useTranslation } from 'react-i18next';

interface CarItemProps {
  car: Car;
}

const CarItem: FC<CarItemProps> = ({ car }) => {
  const { t } = useTranslation();

  return (
    <Link to='/cars/vin/$vin' params={{ vin: car.vin }}>
      <Card className='hover:shadow-md transition-all cursor-pointer group border-2'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-lg font-bold'>
            {car.make} {car.model}
          </CardTitle>
          <Badge
            variant={car.riskLevel === 'low' ? 'default' : 'destructive'}
            className='capitalize'
          >
            {car.riskLevel}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className='text-sm font-mono text-muted-foreground mb-4'>{car.vin}</div>

          <div className='space-y-2'>
            <div className='flex items-center text-sm text-slate-600'>
              <Calendar className='w-4 h-4 mr-2' />
              {car.year}
            </div>
            <div className='flex items-center text-sm text-slate-600'>
              <Gauge className='w-4 h-4 mr-2' />
              {car.currentMileage} {car.mileageUnit}
            </div>
          </div>

          <div className='mt-4 pt-4 border-t flex justify-between items-center transition-colors font-bold text-xs uppercase tracking-wider'>
            {t(StringKey.GET_FULL_REPORT)}
            <ChevronRight className='w-4 h-4' />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CarItem;
