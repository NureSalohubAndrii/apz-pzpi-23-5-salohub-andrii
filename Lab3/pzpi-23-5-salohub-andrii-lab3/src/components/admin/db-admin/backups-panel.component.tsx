import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { HardDrive, Trash2, RotateCcw, Plus, Wrench } from 'lucide-react';
import {
  useBackupsQuery,
  useCreateBackupMutation,
  useDeleteBackupMutation,
  useRestoreBackupMutation,
  useDbAnalysisQuery,
  useOptimizeDbMutation,
} from '@/queries/admin.queries';
import { toast } from 'sonner';
import { useLocale } from '@/hooks/use-locale.hook';

export const BackupsPanel = () => {
  const { t } = useTranslation();
  const { formatDateTime } = useLocale();
  const { data: backupsData, isLoading } = useBackupsQuery();
  const { data: analysisData } = useDbAnalysisQuery();

  const createMutation = useCreateBackupMutation();
  const deleteMutation = useDeleteBackupMutation();
  const restoreMutation = useRestoreBackupMutation();
  const optimizeMutation = useOptimizeDbMutation();

  const backups = backupsData?.data ?? [];
  const analysis = analysisData?.data;

  const handleCreate = () => {
    createMutation.mutate(undefined, {
      onSuccess: () => toast.success(t(StringKey.BACKUP_CREATED_SUCCESS)),
    });
  };

  const handleDelete = (filename: string) => {
    deleteMutation.mutate(filename, {
      onSuccess: () => toast.success(t(StringKey.EVENT_DELETED)),
    });
  };

  const handleRestore = (filename: string) => {
    restoreMutation.mutate(filename, {
      onSuccess: () => toast.success(t(StringKey.DATABASE_RESTORED_SUCCESS)),
    });
  };

  const handleOptimize = () => {
    optimizeMutation.mutate(undefined, {
      onSuccess: () => toast.success(t(StringKey.DATABASE_OPTIMIZED_SUCCESS)),
    });
  };

  return (
    <div className='space-y-6'>
      <div className='flex gap-3 flex-wrap'>
        <Button onClick={handleCreate} disabled={createMutation.isPending}>
          <Plus className='w-4 h-4 mr-2' />
          {t(createMutation.isPending ? StringKey.CREATING : StringKey.CREATE_BACKUP)}
        </Button>
        <Button variant='outline' onClick={handleOptimize} disabled={optimizeMutation.isPending}>
          <Wrench className='w-4 h-4 mr-2' />
          {t(optimizeMutation.isPending ? StringKey.OPTIMIZING : StringKey.OPTIMIZE_DB)}
        </Button>
      </div>

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <HardDrive className='w-5 h-5' />
              {t(StringKey.DATABASE_ANALYSIS)}
              <Badge variant='secondary'>{analysis.totalSize}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              {analysis.stats.map(tableStat => (
                <div key={tableStat.tableName} className='flex items-center gap-3'>
                  <span className='text-sm w-40 shrink-0 font-mono'>{tableStat.tableName}</span>
                  <div className='flex-1 bg-gray-100 rounded-full h-2'>
                    <div
                      className='bg-primary h-2 rounded-full'
                      style={{ width: tableStat.percentage }}
                    />
                  </div>
                  <span className='text-xs text-muted-foreground w-20 text-right'>
                    {tableStat.formattedSize}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            {t(StringKey.AVAILABLE_BACKUPS)} ({backups.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='space-y-2'>
              {[...Array(3)].map((_, index) => (
                <div key={index} className='h-14 bg-gray-100 animate-pulse rounded-lg' />
              ))}
            </div>
          ) : backups.length === 0 ? (
            <p className='text-center text-muted-foreground py-8'>{t(StringKey.NO_EVENTS_YET)}</p>
          ) : (
            <div className='space-y-3'>
              {backups.map(backup => (
                <div
                  key={backup.filename}
                  className='flex items-center justify-between border rounded-lg px-4 py-3'
                >
                  <div className='space-y-0.5'>
                    <p className='text-sm font-mono font-medium'>{backup.filename}</p>
                    <p className='text-xs text-muted-foreground'>
                      {backup.size} · {formatDateTime(backup.createdAt)}
                    </p>
                  </div>
                  <div className='flex gap-2'>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size='sm' variant='outline'>
                          <RotateCcw className='w-4 h-4 mr-1' /> {t(StringKey.RESTORE)}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t(StringKey.RESTORE_DB_TITLE)}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t(StringKey.RESTORE_DB_DESCRIPTION)} (
                            <strong>{backup.filename}</strong>)
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t(StringKey.BACK)}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRestore(backup.filename)}
                            className='bg-destructive text-destructive-foreground'
                          >
                            {t(StringKey.RESTORE)}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size='sm'
                          variant='ghost'
                          className='text-red-500 hover:text-red-600 hover:bg-red-50'
                        >
                          <Trash2 className='w-4 h-4' />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t(StringKey.DELETE_BACKUP_TITLE)}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t(StringKey.DELETE_BACKUP_DESCRIPTION)} (
                            <strong>{backup.filename}</strong>)
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t(StringKey.BACK)}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(backup.filename)}
                            className='bg-destructive text-destructive-foreground'
                          >
                            {t(StringKey.DELETE)}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
