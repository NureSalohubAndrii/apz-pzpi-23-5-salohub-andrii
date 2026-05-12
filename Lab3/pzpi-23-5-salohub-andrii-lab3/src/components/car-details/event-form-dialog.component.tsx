import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useCreateEventMutation, useUpdateEventMutation } from '@/queries/cars.queries';
import type { CarEvent, CreateEventRequest, Severity } from '@/types/cars.types';
import type { FC } from 'react';
import { EVENT_TYPES, SEVERITIES } from '@/consts/event.consts';

interface EventFormDialogProps {
  carId: string;
  existing?: CarEvent;
  onClose: () => void;
}

const EventFormDialog: FC<EventFormDialogProps> = ({ carId, existing, onClose }) => {
  const { t } = useTranslation();
  const { register, handleSubmit, setValue, reset } = useForm<CreateEventRequest>({
    defaultValues: existing
      ? {
          carId,
          eventType: existing.eventType,
          severity: existing.severity,
          description: existing.description,
          mileage: existing.mileage,
          location: existing.location,
          cost: existing.cost,
          documentUrl: existing.documentUrl,
          eventDate: existing.eventDate.slice(0, 16),
        }
      : {
          carId,
          eventDate: new Date().toISOString().slice(0, 16),
        },
  });

  const createMutation = useCreateEventMutation(carId);
  const updateMutation = useUpdateEventMutation(carId);
  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data: CreateEventRequest) => {
    if (existing) {
      updateMutation.mutate(
        { id: existing.id, data },
        {
          onSuccess: () => {
            toast.success(t(StringKey.EVENT_UPDATED));
            onClose();
            reset();
          },
          onError: () => toast.error(t(StringKey.ERROR)),
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success(t(StringKey.EVENT_ADDED));
          onClose();
          reset();
        },
        onError: (e: any) => toast.error(e?.message ?? t(StringKey.ERROR)),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label>{t(StringKey.EVENT_TYPE)}</Label>
          <Select
            defaultValue={existing?.eventType}
            onValueChange={value => setValue('eventType', value as any)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EVENT_TYPES.map(eventType => (
                <SelectItem key={eventType.value} value={eventType.value}>
                  {t(eventType.key)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='space-y-2'>
          <Label>{t(StringKey.SEVERITY)}</Label>
          <Select
            defaultValue={existing?.severity}
            onValueChange={value => setValue('severity', value as Severity)}
          >
            <SelectTrigger>
              <SelectValue placeholder='Optional' />
            </SelectTrigger>
            <SelectContent>
              {SEVERITIES.map(severity => (
                <SelectItem key={severity.value} value={severity.value}>
                  {t(severity.key)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='space-y-2'>
        <Label>{t(StringKey.EVENT_DATE)}</Label>
        <Input type='datetime-local' {...register('eventDate', { required: true })} />
      </div>

      <div className='space-y-2'>
        <Label>{t(StringKey.DESCRIPTION_OPTIONAL)}</Label>
        <Textarea {...register('description')} rows={3} />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label>{t(StringKey.CURRENT_MILEAGE)}</Label>
          <Input type='number' min={0} {...register('mileage', { valueAsNumber: true })} />
        </div>
        <div className='space-y-2'>
          <Label>{t(StringKey.COST_USD)}</Label>
          <Input type='number' min={0} step='0.01' {...register('cost')} />
        </div>
      </div>

      <div className='space-y-2'>
        <Label>{t(StringKey.LOCATION)}</Label>
        <Input {...register('location')} />
      </div>

      <div className='space-y-2'>
        <Label>{t(StringKey.DOCUMENT_URL)}</Label>
        <Input type='url' {...register('documentUrl')} />
      </div>

      <Button type='submit' className='w-full' disabled={isPending}>
        {isPending ? '...' : existing ? t(StringKey.SAVE_CHANGES) : t(StringKey.ADD_EVENT)}
      </Button>
    </form>
  );
};

export default EventFormDialog;
