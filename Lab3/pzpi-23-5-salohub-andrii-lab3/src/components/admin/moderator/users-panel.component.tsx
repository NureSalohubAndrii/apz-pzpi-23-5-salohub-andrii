import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { UserX, UserCheck } from 'lucide-react';
import {
  useBlockUserMutation,
  useUnblockUserMutation,
  useRecentActivityQuery,
} from '@/queries/admin.queries';
import { toast } from 'sonner';
import { useLocale } from '@/hooks/use-locale.hook';

function BlockDialog({ userId, onDone }: { userId: string; onDone: () => void }) {
  const { t } = useTranslation();
  const [reason, setReason] = useState('');
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useBlockUserMutation();

  const handleBlock = () => {
    mutate(
      { userId, reason },
      {
        onSuccess: () => {
          toast.success(t(StringKey.USER_BLOCKED_SUCCESS));
          setOpen(false);
          onDone();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='sm' variant='destructive'>
          <UserX className='w-4 h-4 mr-1' /> {t(StringKey.BLOCK)}
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-sm'>
        <DialogHeader>
          <DialogTitle>{t(StringKey.BLOCK_USER)}</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <Textarea
            placeholder={t(StringKey.BLOCK_REASON_PLACEHOLDER)}
            value={reason}
            onChange={event => setReason(event.target.value)}
            rows={3}
          />
          <Button className='w-full' onClick={handleBlock} disabled={isPending || !reason.trim()}>
            {t(StringKey.CONFIRM_BLOCK)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const UsersPanel = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useRecentActivityQuery();
  const { mutate: unblock } = useUnblockUserMutation();
  const { formatDateTime } = useLocale();
  const users = data?.data?.details?.newUsers ?? [];

  const handleUnblock = (userId: string) => {
    unblock(userId, {
      onSuccess: () => toast.success(t(StringKey.USER_UNBLOCKED_SUCCESS)),
    });
  };

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>{t(StringKey.RECENT_USERS)}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='space-y-2'>
              {[...Array(3)].map((_, index) => (
                <div key={index} className='h-14 bg-gray-100 animate-pulse rounded-lg' />
              ))}
            </div>
          ) : users.length === 0 ? (
            <p className='text-center text-muted-foreground py-8'>{t(StringKey.NO_RECENT_USERS)}</p>
          ) : (
            <div className='space-y-3'>
              {users.map((user: any) => (
                <div
                  key={user.id}
                  className='flex items-center justify-between border rounded-lg px-4 py-3'
                >
                  <div className='space-y-0.5'>
                    <div className='flex items-center gap-2'>
                      <span className='font-medium text-sm'>{user.email}</span>
                      <Badge variant={user.isBlocked ? 'destructive' : 'default'}>
                        {t(user.isBlocked ? StringKey.BLOCKED : StringKey.ACTIVE)}
                      </Badge>
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      {user.firstName} {user.lastName} · {t(StringKey.JOINED)}{' '}
                      {formatDateTime(user.createdAt)}
                    </p>
                  </div>
                  <div className='flex gap-2'>
                    {user.isBlocked ? (
                      <Button size='sm' variant='outline' onClick={() => handleUnblock(user.id)}>
                        <UserCheck className='w-4 h-4 mr-1' /> {t(StringKey.UNBLOCK)}
                      </Button>
                    ) : (
                      <BlockDialog userId={user.id} onDone={() => {}} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
