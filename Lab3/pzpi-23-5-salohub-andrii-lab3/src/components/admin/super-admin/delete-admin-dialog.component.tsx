import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { StringKey } from '@/consts/string-key.consts';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface DeleteAdminDialogProps {
  adminEmail: string;
  onConfirm: () => void;
  disabled?: boolean;
}

const DeleteAdminDialog: FC<DeleteAdminDialogProps> = ({ adminEmail, onConfirm, disabled }) => {
  const { t } = useTranslation();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50'
          disabled={disabled}
        >
          <Trash2 className='w-4 h-4' />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t(StringKey.DELETE_USER_PERMANENTLY)}</AlertDialogTitle>
          <AlertDialogDescription>
            {t(StringKey.DELETE_USER_DESCRIPTION)} ({adminEmail})
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t(StringKey.BACK)}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className='bg-red-600 hover:bg-red-700'>
            {t(StringKey.DELETE)}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAdminDialog;
