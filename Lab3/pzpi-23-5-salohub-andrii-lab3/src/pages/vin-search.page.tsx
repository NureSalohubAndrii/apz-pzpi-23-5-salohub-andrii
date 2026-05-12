import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useGetCarByVINMutation } from '@/queries/cars.queries';

const VINSearchPage = () => {
  const { t } = useTranslation();
  const [vin, setVin] = useState('');

  const { mutate, data, isPending } = useGetCarByVINMutation();
  const car = data?.data;

  return (
    <div className='container max-w-2xl mx-auto py-10 space-y-6'>
      <h1 className='text-3xl font-bold'>{t(StringKey.CHECK_VIN)}</h1>

      <div className='flex gap-2'>
        <Input
          placeholder={t(StringKey.VIN_CODE)}
          value={vin}
          onChange={e => setVin(e.target.value.toUpperCase())}
          className='uppercase font-mono'
          maxLength={17}
        />
        <Button onClick={() => mutate(vin)} disabled={isPending || vin.length < 5}>
          {isPending ? '...' : t(StringKey.SEARCH_HISTORY)}
        </Button>
      </div>

      {car && (
        <Link to='/cars/vin/$vin' params={{ vin: car.vin }}>
          <Card className='transition-colors cursor-pointer border-2'>
            <CardContent className='p-6 flex justify-between items-center'>
              <div className='space-y-1'>
                <div className='text-green-600 text-xs font-bold uppercase'>
                  {t(StringKey.VEHICLE_FOUND)}
                </div>
                <h3 className='text-xl font-bold'>
                  {car.make} {car.model} ({car.year})
                </h3>
                <p className='text-sm text-slate-500 font-mono'>{car.vin}</p>
                <div
                  className={`text-xs font-bold uppercase mt-2 px-2 py-1 inline-block rounded ${
                    car.riskLevel === 'low'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {t(StringKey.RISK_LEVEL)}: {car.riskLevel}
                </div>
              </div>
              <ChevronRight className='text-slate-400' />
            </CardContent>
          </Card>
        </Link>
      )}
    </div>
  );
};

export default VINSearchPage;
