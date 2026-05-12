import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Users, Search, Zap } from 'lucide-react';
import { useRecentActivityQuery } from '@/queries/admin.queries';
import { useLocale } from '@/hooks/use-locale.hook';

const TIME_OPTIONS = [15, 30, 60, 120, 360];

export const LogsPanel = () => {
  const { t } = useTranslation();
  const [limitMinutes, setLimitMinutes] = useState(60);
  const { data, isLoading } = useRecentActivityQuery(limitMinutes);
  const { formatDateTime } = useLocale();
  const activity = data?.data;

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-2 flex-wrap'>
        <span className='text-sm text-muted-foreground'>{t(StringKey.TIME_WINDOW)}:</span>
        {TIME_OPTIONS.map(minute => (
          <Button
            key={minute}
            size='sm'
            variant={limitMinutes === minute ? 'default' : 'outline'}
            onClick={() => setLimitMinutes(minute)}
          >
            {minute >= 60 ? `${minute / 60}h` : `${minute}m`}
          </Button>
        ))}
      </div>

      {activity && (
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {[
            { icon: Users, label: StringKey.NEW_USERS, value: activity.summary.newUsers },
            { icon: Search, label: StringKey.VIN_CHECKS, value: activity.summary.checksPerformed },
            { icon: Zap, label: StringKey.EVENTS, value: activity.summary.eventsReported },
            {
              icon: Activity,
              label: StringKey.TOTAL_ACTIVITY,
              value: activity.summary.totalActivity,
            },
          ].map(item => (
            <Card key={item.label}>
              <CardContent className='pt-6 flex flex-col items-center text-center gap-1'>
                <item.icon className='w-5 h-5 text-muted-foreground' />
                <p className='text-2xl font-bold'>{item.value}</p>
                <p className='text-xs text-muted-foreground'>{t(item.label)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t(StringKey.RECENT_VIN_CHECKS)}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='space-y-2'>
              {[...Array(4)].map((_, index) => (
                <div key={index} className='h-12 bg-gray-100 animate-pulse rounded' />
              ))}
            </div>
          ) : (activity?.details.recentChecks ?? []).length === 0 ? (
            <p className='text-center text-muted-foreground py-6'>
              {t(StringKey.NO_CHECKS_IN_PERIOD)}
            </p>
          ) : (
            <div className='space-y-2'>
              {(activity?.details.recentChecks ?? []).map((check: any, index: number) => (
                <div
                  key={index}
                  className='flex justify-between text-sm border-b pb-2 last:border-0'
                >
                  <div>
                    <span className='font-mono font-medium'>{check.vin}</span>
                    <Badge variant='outline' className='ml-2 text-xs'>
                      {check.checkType}
                    </Badge>
                    {check.user && (
                      <span className='text-muted-foreground ml-2'>{check.user.email}</span>
                    )}
                  </div>
                  <span className='text-xs text-muted-foreground shrink-0'>
                    {formatDateTime(check.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t(StringKey.RECENT_CAR_EVENTS)}</CardTitle>
        </CardHeader>
        <CardContent>
          {(activity?.details.recentEvents ?? []).length === 0 ? (
            <p className='text-center text-muted-foreground py-6'>
              {t(StringKey.NO_EVENTS_IN_PERIOD)}
            </p>
          ) : (
            <div className='space-y-2'>
              {(activity?.details.recentEvents ?? []).map((event: any, index: number) => (
                <div
                  key={index}
                  className='flex justify-between text-sm border-b pb-2 last:border-0'
                >
                  <div>
                    <Badge
                      variant={
                        event.severity === 'critical' || event.severity === 'high'
                          ? 'destructive'
                          : 'secondary'
                      }
                      className='mr-2'
                    >
                      {event.eventType}
                    </Badge>
                    {event.car && (
                      <span className='text-muted-foreground'>
                        {event.car.vin} · {event.car.make} {event.car.model}
                      </span>
                    )}
                  </div>
                  <span className='text-xs text-muted-foreground shrink-0'>
                    {formatDateTime(event.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
