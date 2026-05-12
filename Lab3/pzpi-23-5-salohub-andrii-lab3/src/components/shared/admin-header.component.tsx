import { useAuthStore } from '@/store/auth.store';
import { LogOut, Shield } from 'lucide-react';
import LangSwitcher from './lang-switcher.component';
import { Button } from '../ui/button';
import { ROLE_TRANSLATION_KEY } from '@/consts/role.consts';
import { StringKey } from '@/consts/string-key.consts';
import { useTranslation } from 'react-i18next';

const AdminHeader = () => {
  const { t } = useTranslation();
  const { user, clearAuth } = useAuthStore();

  return (
    <header className='border-b bg-white'>
      <div className='container mx-auto px-4 h-16 flex items-center justify-between'>
        <div className='flex items-center gap-2 font-bold text-xl'>
          <Shield className='w-6 h-6 text-primary' />
          <span className='hidden sm:inline'>Admin Panel</span>
        </div>
        <div className='flex items-center gap-3'>
          <LangSwitcher />
          <span className='text-sm text-muted-foreground hidden md:inline'>
            {user?.email} ·{' '}
            <span className='font-medium text-primary'>
              {t(ROLE_TRANSLATION_KEY[user?.role!] || StringKey.ERROR)}
            </span>
          </span>
          <Button
            variant='ghost'
            size='icon'
            onClick={clearAuth}
            className='text-red-500 hover:text-red-600 hover:bg-red-50'
          >
            <LogOut className='w-5 h-5' />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
