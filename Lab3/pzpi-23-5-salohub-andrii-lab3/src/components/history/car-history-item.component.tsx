import { StringKey } from '@/consts/string-key.consts';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Car, CalendarDays, Gauge, ArrowRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import type { FC } from 'react';
import type { CarWithOwnership } from '@/types/cars.types';
import { useTranslation } from 'react-i18next';
import { useLocale } from '@/hooks/use-locale.hook';

interface CarHistoryItemProps {
  car: CarWithOwnership;
}

const RISK_BADGE: Record<string, 'default' | 'secondary' | 'destructive'> = {
  low: 'default',
  medium: 'secondary',
  high: 'destructive',
};

const CarHistoryItem: FC<CarHistoryItemProps> = ({ car }) => {
  const { t } = useTranslation();
  const { formatDate, formatNumber } = useLocale();

  return (
    <Card>
      <CardContent className='pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div className='flex items-start gap-4'>
          <div className='p-2 bg-muted rounded-lg'>
            <Car className='w-5 h-5 text-muted-foreground' />
          </div>
          <div className='space-y-1'>
            <div className='flex items-center gap-2 flex-wrap'>
              <span className='font-semibold'>
                {car.year} {car.make} {car.model}
              </span>
              {car.ownership.isCurrent && <Badge variant='default'>{t(StringKey.CURRENT)}</Badge>}
              <Badge variant={RISK_BADGE[car.riskLevel]}>
                {t(StringKey.RISK_LEVEL)}: {car.riskLevel}
              </Badge>
            </div>
            <p className='text-xs text-muted-foreground font-mono uppercase'>{car.vin}</p>
            {car.color && <p className='text-xs text-muted-foreground'>{car.color}</p>}
          </div>
        </div>

        <div className='flex flex-col items-end gap-1 text-sm text-muted-foreground shrink-0'>
          <div className='flex items-center gap-1'>
            <CalendarDays className='w-4 h-4' />
            <span>
              {formatDate(car.ownership.startedAt)}
              <ArrowRight className='inline w-3 h-3 mx-1' />
              {car.ownership.endedAt ? formatDate(car.ownership.endedAt) : 'now'}
            </span>
          </div>
          {car.ownership.startedMileage != null && (
            <div className='flex items-center gap-1'>
              <Gauge className='w-4 h-4' />
              <span>
                {formatNumber(car.ownership.startedMileage)} {car.mileageUnit}
              </span>
            </div>
          )}
          <Link to='/check' search={{ vin: car.vin }} className='text-xs underline mt-1'>
            {t(StringKey.GET_FULL_REPORT)}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarHistoryItem;
