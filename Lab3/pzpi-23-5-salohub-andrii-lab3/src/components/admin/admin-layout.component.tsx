import { useAuthStore } from '@/store/auth.store';
import { Navigate } from '@tanstack/react-router';
import { Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';

interface Props {
  children: (role: string) => React.ReactNode;
}

export const AdminLayout = ({ children }: Props) => {
  const { user } = useAuthStore();
  const { t } = useTranslation();

  if (!user || user.role === 'user') {
    return <Navigate to='/' />;
  }

  return (
    <div className='container max-w-6xl mx-auto py-8 space-y-6'>
      <div className='flex items-center gap-3'>
        <Shield className='w-7 h-7 text-primary' />
        <div>
          <h1 className='text-2xl font-bold'>{t(StringKey.ADMIN_PANEL)}</h1>
          <p className='text-sm text-muted-foreground'>{user.email}</p>
        </div>
      </div>
      {children(user.role)}
    </div>
  );
};
