import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { createCar } from '@/api/cars.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';

const AddCarPage = () => {
  const { t } = useTranslation();
  const { register, handleSubmit, setValue, reset } = useForm();

  const { mutate, isPending } = useMutation({
    mutationFn: createCar,
    onSuccess: () => {
      toast.success('Success', { description: t(StringKey.SUCCESS_ADD_CAR) });
      reset();
    },
  });

  return (
    <div className='container max-w-3xl mx-auto py-10'>
      <form onSubmit={handleSubmit(data => mutate(data))} className='space-y-8'>
        <section className='space-y-4'>
          <h2 className='text-lg font-semibold border-b pb-2'>
            {t(StringKey.VEHICLE_IDENTIFICATION)}
          </h2>
          <div className='space-y-2'>
            <Label>{t(StringKey.VIN_CODE)}</Label>
            <Input {...register('vin')} className='uppercase font-mono' />
          </div>
        </section>

        <section className='space-y-4'>
          <h2 className='text-lg font-semibold border-b pb-2'>{t(StringKey.BASIC_INFO)}</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label>{t(StringKey.MAKE)}</Label>
              <Input {...register('make')} />
            </div>
            <div className='space-y-2'>
              <Label>{t(StringKey.MODEL)}</Label>
              <Input {...register('model')} />
            </div>
            <div className='space-y-2'>
              <Label>{t(StringKey.YEAR)}</Label>
              <Input
                {...register('year')}
                type='number'
                min={1900}
                max={new Date().getFullYear()}
              />
            </div>
            <div className='space-y-2'>
              <Label>{t(StringKey.COLOR)}</Label>
              <Input {...register('color')} />
            </div>
          </div>
        </section>

        <section className='space-y-4'>
          <h2 className='text-lg font-semibold border-b pb-2'>{t(StringKey.TECHNICAL_SPECS)}</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label>{t(StringKey.ENGINE_TYPE)}</Label>
              <Input {...register('engineType')} />
            </div>
            <div className='space-y-2'>
              <Label>{t(StringKey.TRANSMISSION)}</Label>
              <Select onValueChange={v => setValue('transmission', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['manual', 'automatic', 'cvt', 'dual-clutch'].map(opt => (
                    <SelectItem key={opt} value={opt}>
                      {opt.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2'>
              <Label>{t(StringKey.FUEL_TYPE)}</Label>
              <Select onValueChange={v => setValue('fuelType', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['petrol', 'diesel', 'hybrid', 'electric'].map(opt => (
                    <SelectItem key={opt} value={opt}>
                      {opt.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2'>
              <Label>{t(StringKey.MILEAGE_UNIT)}</Label>
              <Select onValueChange={v => setValue('mileageUnit', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='km'>KM</SelectItem>
                  <SelectItem value='mi'>MI</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2 md:col-span-2'>
              <Label>{t(StringKey.CURRENT_MILEAGE)}</Label>
              <Input {...register('mileage')} type='number' min={0} />
            </div>
          </div>
        </section>

        <section className='space-y-4'>
          <h2 className='text-lg font-semibold border-b pb-2'>{t(StringKey.CONDITION_SAFETY)}</h2>
          <div className='space-y-2'>
            <Label>{t(StringKey.DESCRIPTION_OPTIONAL)}</Label>
            <Textarea {...register('description')} rows={4} />
          </div>
        </section>

        <Button type='submit' className='w-full' disabled={isPending}>
          {isPending ? '...' : t(StringKey.ADD_VEHICLE)}
        </Button>
      </form>
    </div>
  );
};

export default AddCarPage;
