import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertTriangle } from 'lucide-react';
import { useCarReportQuery } from '@/queries/cars.queries';
import type { CarEvent, CheckType } from '@/types/cars.types';
import { useLocale } from '@/hooks/use-locale.hook';
import { CHECK_TYPE_KEY, CHECK_TYPES, EVENT_TYPE_KEY, REC_COLORS } from '@/consts/check.consts';

interface ReportSectionProps {
  vin: string;
}

const ReportSection: FC<ReportSectionProps> = ({ vin }) => {
  const { formatDate } = useLocale();
  const { t } = useTranslation();
  const [type, setType] = useState<CheckType>('basic');
  const [enabled, setEnabled] = useState(false);
  const { data, isLoading } = useCarReportQuery(vin, type);
  const report = data?.data;

  if (!enabled) {
    return (
      <div className='space-y-3'>
        <div className='flex gap-2'>
          {CHECK_TYPES.map(checkType => (
            <Button
              key={checkType}
              variant={type === checkType ? 'default' : 'outline'}
              size='sm'
              onClick={() => setType(checkType)}
            >
              {t(CHECK_TYPE_KEY[checkType])}
            </Button>
          ))}
        </div>
        <Button className='w-full h-14 text-base font-bold' onClick={() => setEnabled(true)}>
          <FileText className='mr-2 w-5 h-5' />
          {t(StringKey.GET_REPORT)} ({t(CHECK_TYPE_KEY[type])})
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return <div className='h-32 animate-pulse bg-gray-100 rounded-xl' />;
  }
  if (!report) {
    return null;
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle className='flex items-center gap-2'>
          <FileText className='w-5 h-5' />
          {t(StringKey.REPORT)}
          <Badge variant='secondary'>{t(CHECK_TYPE_KEY[report.reportType])}</Badge>
        </CardTitle>
        <span className='text-xs text-muted-foreground'>{formatDate(report.generatedAt)}</span>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          {report.recommendations.map((rec, i) => (
            <div
              key={i}
              className={`border rounded-lg px-4 py-3 text-sm font-medium ${REC_COLORS[rec.severity]}`}
            >
              [{t(`SEVERITY_${rec.severity.toUpperCase()}` as StringKey)}] {rec.message}
            </div>
          ))}
        </div>

        {report.owners.length > 0 && (
          <div className='space-y-2'>
            <p className='text-sm font-semibold'>{t(StringKey.OWNERSHIP_HISTORY)}</p>
            {report.owners.map((owner, i) => (
              <div
                key={i}
                className='text-sm flex justify-between text-muted-foreground border rounded px-3 py-2'
              >
                <span>
                  {formatDate(owner.startedAt)} →{' '}
                  {owner.endedAt ? formatDate(owner.endedAt) : 'now'}
                </span>
                {owner.isCurrent && <Badge variant='default'>{t(StringKey.CURRENT)}</Badge>}
              </div>
            ))}
          </div>
        )}

        {report.events.length > 0 && (
          <div className='space-y-2'>
            <p className='text-sm font-semibold'>{t(StringKey.CRITICAL_EVENTS)}</p>
            {report.events.map((e: CarEvent) => (
              <div key={e.id} className='text-sm border rounded px-3 py-2 flex items-start gap-2'>
                <AlertTriangle className='w-4 h-4 text-red-500 shrink-0 mt-0.5' />
                <div>
                  <span className='font-medium'>
                    {t(EVENT_TYPE_KEY[e.eventType] ?? StringKey.EVENT_TYPE_OTHER)}
                  </span>
                  {e.description && <p className='text-muted-foreground'>{e.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportSection;
