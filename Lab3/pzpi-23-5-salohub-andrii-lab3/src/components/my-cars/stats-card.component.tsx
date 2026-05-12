import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

const StatsCard: FC<StatsCardProps> = ({ title, value, icon }) => {
  return (
    <Card className='shadow-sm'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
