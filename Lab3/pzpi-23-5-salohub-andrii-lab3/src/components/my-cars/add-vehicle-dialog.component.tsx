import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { StringKey } from '@/consts/string-key.consts';
import AddCarPage from '@/pages/add-car.page';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKey } from '@/consts/query-key.consts';

const AddVehicleDialog = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return (
    <Dialog
      onOpenChange={open => {
        if (!open) {
          queryClient.invalidateQueries({ queryKey: [QueryKey.MY_CARS] });
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className='gap-2'>
          <Plus className='w-4 h-4' />
          {t(StringKey.ADD_VEHICLE)}
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{t(StringKey.ADD_VEHICLE)}</DialogTitle>
        </DialogHeader>
        <AddCarPage />
      </DialogContent>
    </Dialog>
  );
};

export default AddVehicleDialog;
