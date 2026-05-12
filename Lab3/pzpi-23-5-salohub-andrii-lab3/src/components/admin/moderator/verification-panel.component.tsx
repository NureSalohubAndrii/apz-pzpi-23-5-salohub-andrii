import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import {
  useCarsAwaitingVerificationQuery,
  useVerifyCarMutation,
  useVerificationStatsQuery,
} from '@/queries/admin.queries';
import { toast } from 'sonner';

const PRIORITY_BADGE: Record<string, 'default' | 'secondary' | 'destructive'> = {
  low: 'default',
  medium: 'secondary',
  high: 'destructive',
};

function VerifyDialog({ car }: { car: any }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const { mutate, isPending } = useVerifyCarMutation();

  const handleVerify = (isVerified: boolean) => {
    mutate(
      { carId: car.id, data: { isVerified, verificationNotes: notes } },
      {
        onSuccess: () => {
          toast.success(
            t(isVerified ? StringKey.CAR_VERIFIED_SUCCESS : StringKey.VERIFICATION_REVOKED)
          );
          setOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='sm' variant='outline'>
          {t(StringKey.REVIEW)}
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>
            {car.year} {car.make} {car.model}
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-4 text-sm'>
          <div className='space-y-1'>
            <p>
              <span className='text-muted-foreground'>VIN:</span>{' '}
              <span className='font-mono'>{car.vin}</span>
            </p>
            <p>
              <span className='text-muted-foreground'>{t(StringKey.RISK_SCORE_LABEL)}:</span>{' '}
              {car.riskScore}/100
            </p>
            <p>
              <span className='text-muted-foreground'>{t(StringKey.MILEAGE)}:</span>{' '}
              {car.currentMileage.toLocaleString()} km
            </p>
            {car.tamperingIncidents > 0 && (
              <p className='text-red-600 font-medium flex items-center gap-1'>
                <AlertTriangle className='w-4 h-4' />
                {car.tamperingIncidents} {t(StringKey.TAMPERING_INCIDENTS)}
              </p>
            )}
          </div>
          <div className='space-y-2'>
            <label className='font-medium'>{t(StringKey.NOTES)}</label>
            <Textarea value={notes} onChange={event => setNotes(event.target.value)} rows={3} />
          </div>
          <div className='flex gap-2'>
            <Button className='flex-1' onClick={() => handleVerify(true)} disabled={isPending}>
              <CheckCircle className='w-4 h-4 mr-1' /> {t(StringKey.VERIFY)}
            </Button>
            <Button
              variant='destructive'
              className='flex-1'
              onClick={() => handleVerify(false)}
              disabled={isPending}
            >
              <XCircle className='w-4 h-4 mr-1' /> {t(StringKey.REJECT)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const VerificationPanel = () => {
  const { t } = useTranslation();
  const { data: carsData, isLoading } = useCarsAwaitingVerificationQuery();
  const { data: statsData } = useVerificationStatsQuery();
  const cars = carsData?.data ?? [];
  const stats = statsData?.data;

  return (
    <div className='space-y-6'>
      {stats && (
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {[
            { label: StringKey.TOTAL_CARS, value: stats.totals.allCars },
            { label: StringKey.VERIFIED, value: stats.totals.verified },
            { label: StringKey.PENDING, value: stats.totals.pendingVerification },
            { label: StringKey.VERIFICATION_RATE, value: stats.rates.verificationRate },
          ].map(statItem => (
            <Card key={statItem.label}>
              <CardContent className='pt-6 text-center'>
                <p className='text-2xl font-bold'>{statItem.value}</p>
                <p className='text-xs text-muted-foreground'>{t(statItem.label)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            {t(StringKey.AWAITING_VERIFICATION)} ({cars.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='space-y-2'>
              {[...Array(4)].map((_, index) => (
                <div key={index} className='h-16 bg-gray-100 animate-pulse rounded-lg' />
              ))}
            </div>
          ) : cars.length === 0 ? (
            <p className='text-center text-muted-foreground py-8'>
              {t(StringKey.ALL_CARS_VERIFIED)}
            </p>
          ) : (
            <div className='space-y-3'>
              {cars.map(car => (
                <div
                  key={car.id}
                  className='flex items-center justify-between border rounded-lg px-4 py-3'
                >
                  <div className='space-y-0.5'>
                    <div className='flex items-center gap-2'>
                      <span className='font-medium'>
                        {car.year} {car.make} {car.model}
                      </span>
                      <Badge variant={PRIORITY_BADGE[car.priority]}>{car.priority}</Badge>
                    </div>
                    <p className='text-xs text-muted-foreground font-mono'>{car.vin}</p>
                  </div>
                  <VerifyDialog car={car} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
