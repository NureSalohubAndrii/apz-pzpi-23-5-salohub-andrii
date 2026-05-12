import type { FC } from 'react';

interface CarInfoRowProps {
  label: string;
  value: any;
}

const CarInfoRow: FC<CarInfoRowProps> = ({ label, value }) => {
  return (
    <div className='flex justify-between border-b pb-2'>
      <span className='text-slate-500'>{label}</span>
      <span className='font-semibold capitalize'>{value || '—'}</span>
    </div>
  );
};

export default CarInfoRow;
