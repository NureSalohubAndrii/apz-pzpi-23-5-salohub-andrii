import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CarInfoRow from '@/components/cars/car-info-row.component';
import type { Car } from '@/types/cars.types';
import type { FC } from 'react';
import { useLocale } from '@/hooks/use-locale.hook';

interface CarInfoCardsProps {
  car: Car;
}

const CarInfoCards: FC<CarInfoCardsProps> = ({ car }) => {
  const { t } = useTranslation();
  const { formatNumber } = useLocale();

  return (
    <div className='grid md:grid-cols-2 gap-6'>
      <Card>
        <CardHeader>
          <CardTitle>{t(StringKey.TECHNICAL_SPECS)}</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <CarInfoRow label={t(StringKey.YEAR)} value={car.year} />
          <CarInfoRow label={t(StringKey.ENGINE_TYPE)} value={car.engineType} />
          <CarInfoRow label={t(StringKey.TRANSMISSION)} value={car.transmission} />
          <CarInfoRow label={t(StringKey.FUEL_TYPE)} value={car.fuelType} />
          <CarInfoRow label={t(StringKey.COLOR)} value={car.color} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t(StringKey.CONDITION_SAFETY)}</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <CarInfoRow
            label={t(StringKey.CURRENT_MILEAGE)}
            value={`${formatNumber(car.currentMileage)} ${car.mileageUnit}`}
          />
          <CarInfoRow label={t(StringKey.RISK_SCORE)} value={`${car.riskScore}/100`} />
          <CarInfoRow label={t(StringKey.RISK_LEVEL)} value={car.riskLevel} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CarInfoCards;
