import { StringKey } from '@/consts/string-key.consts';
import { useAuthStore } from '@/store/auth.store';
import { Link } from '@tanstack/react-router';
import { Car, LayoutDashboard, Search, History, User, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LangSwitcher from './lang-switcher.component';
import { Button } from '../ui/button';

const UserHeader = () => {
  const { t } = useTranslation();
  const { user, clearAuth } = useAuthStore();

  return (
    <header className='border-b bg-white'>
      <div className='container mx-auto px-4 h-16 flex items-center justify-between'>
        <Link to='/' className='font-bold text-xl flex items-center gap-2'>
          <Car className='w-6 h-6' />
          <span className='hidden sm:inline'>CarHistory</span>
        </Link>
        <nav className='flex items-center gap-4 lg:gap-6'>
          <Link to='/' className='flex items-center gap-2 text-sm font-medium transition-colors'>
            <LayoutDashboard className='w-4 h-4' />
            <span className='hidden lg:inline'>{t(StringKey.DASHBOARD)}</span>
          </Link>
          <Link to='/' className='flex items-center gap-2 text-sm font-medium transition-colors'>
            <Car className='w-4 h-4' />
            <span className='hidden lg:inline'>{t(StringKey.MY_CARS)}</span>
          </Link>
          <Link
            to='/check'
            className='flex items-center gap-2 text-sm font-medium transition-colors'
          >
            <Search className='w-4 h-4' />
            <span className='hidden lg:inline'>{t(StringKey.CHECK_VIN)}</span>
          </Link>
          <Link
            to='/history'
            className='flex items-center gap-2 text-sm font-medium transition-colors'
          >
            <History className='w-4 h-4' />
            <span className='hidden lg:inline'>{t(StringKey.CHECK_HISTORY)}</span>
          </Link>
        </nav>
        <div className='flex items-center gap-2 sm:gap-3'>
          <LangSwitcher />
          <Link
            to='/profile'
            className='flex items-center gap-2 hover:bg-slate-100 p-2 rounded-lg transition-colors'
          >
            <User className='w-5 h-5' />
            <span className='hidden md:inline text-sm font-medium'>
              {user?.firstName || 'User'}
            </span>
          </Link>
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

export default UserHeader;
