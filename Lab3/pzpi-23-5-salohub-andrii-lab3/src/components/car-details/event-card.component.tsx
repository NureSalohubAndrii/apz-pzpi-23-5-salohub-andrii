import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, Gauge, MapPin, Pencil, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import type { CarEvent } from '@/types/cars.types';
import type { FC } from 'react';
import { useLocale } from '@/hooks/use-locale.hook';
import { EVENT_ICONS, EVENT_TYPE_KEY, SEVERITY_BADGE, SEVERITY_KEY } from '@/consts/event.consts';

interface EventCardProps {
  event: CarEvent;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

const EventCard: FC<EventCardProps> = ({ event, onEdit, onDelete, isDeleting }) => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const isOwner = event.reportedBy === user?.id;
  const { formatDateTime, formatNumber } = useLocale();

  return (
    <div className='border rounded-lg px-4 py-3 space-y-1'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          {EVENT_ICONS[event.eventType] ?? <CheckCircle className='w-4 h-4' />}
          <span className='font-medium text-sm'>
            {t(EVENT_TYPE_KEY[event.eventType] ?? StringKey.EVENT_TYPE_OTHER)}
          </span>
          {event.severity && (
            <Badge variant={SEVERITY_BADGE[event.severity]}>
              {t(SEVERITY_KEY[event.severity])}
            </Badge>
          )}
        </div>

        {isOwner && (
          <div className='flex items-center gap-1'>
            <Button size='icon' variant='ghost' className='h-7 w-7' onClick={onEdit}>
              <Pencil className='w-3 h-3' />
            </Button>
            <Button
              size='icon'
              variant='ghost'
              className='h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50'
              onClick={onDelete}
              disabled={isDeleting}
            >
              <Trash2 className='w-3 h-3' />
            </Button>
          </div>
        )}
      </div>

      {event.description && <p className='text-sm text-muted-foreground'>{event.description}</p>}

      <div className='flex items-center gap-4 text-xs text-muted-foreground flex-wrap'>
        <span className='flex items-center gap-1'>
          <Calendar className='w-3 h-3' />
          {formatDateTime(event.eventDate)}
        </span>
        {event.mileage && (
          <span className='flex items-center gap-1'>
            <Gauge className='w-3 h-3' />
            {formatNumber(event.mileage)} km
          </span>
        )}
        {event.location && (
          <span className='flex items-center gap-1'>
            <MapPin className='w-3 h-3' />
            {event.location}
          </span>
        )}
        {event.cost && <span>${Number(event.cost).toLocaleString()}</span>}
      </div>
    </div>
  );
};

export default EventCard;
