import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useCarEventsQuery, useDeleteEventMutation } from '@/queries/cars.queries';
import EventFormDialog from './event-form-dialog.component';
import EventCard from './event-card.component';
import { toast } from 'sonner';
import type { CarEvent } from '@/types/cars.types';

interface EventsSectionProps {
  carId: string;
}

const EventsSection: FC<EventsSectionProps> = ({ carId }) => {
  const { t } = useTranslation();
  const { data, isLoading } = useCarEventsQuery(carId);
  const deleteMutation = useDeleteEventMutation(carId);
  const [editTarget, setEditTarget] = useState<CarEvent | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const events = data?.data ?? [];

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success(t(StringKey.EVENT_DELETED)),
      onError: () => toast.error(t(StringKey.FAILED_TO_DELETE)),
    });
  };

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>{t(StringKey.VEHICLE_EVENTS)}</CardTitle>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size='sm' variant='outline'>
              <Plus className='w-4 h-4 mr-1' />
              {t(StringKey.ADD_EVENT)}
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-lg'>
            <DialogHeader>
              <DialogTitle>{t(StringKey.ADD_EVENT)}</DialogTitle>
            </DialogHeader>
            <EventFormDialog carId={carId} onClose={() => setAddOpen(false)} />
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className='space-y-2'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='h-16 bg-gray-100 animate-pulse rounded-lg' />
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className='text-center text-muted-foreground py-8'>{t(StringKey.NO_EVENTS_YET)}</p>
        ) : (
          <div className='space-y-3'>
            {events.map(event => (
              <div key={event.id}>
                <EventCard
                  event={event}
                  onEdit={() => setEditTarget(event)}
                  onDelete={() => handleDelete(event.id)}
                  isDeleting={deleteMutation.isPending}
                />
                <Dialog
                  open={editTarget?.id === event.id}
                  onOpenChange={open => !open && setEditTarget(null)}
                >
                  <DialogContent className='max-w-lg'>
                    <DialogHeader>
                      <DialogTitle>{t(StringKey.EDIT_EVENT)}</DialogTitle>
                    </DialogHeader>
                    <EventFormDialog
                      carId={carId}
                      existing={event}
                      onClose={() => setEditTarget(null)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventsSection;
