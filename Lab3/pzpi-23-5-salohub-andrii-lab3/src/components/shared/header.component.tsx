import { Link } from '@tanstack/react-router';
import { Car } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import LangSwitcher from './lang-switcher.component';
import { isAdmin } from '@/lib/roles';
import AdminHeader from './admin-header.component';
import UserHeader from './user-header.component';

const Header = () => {
  const { accessToken, user } = useAuthStore();

  if (!accessToken) {
    return (
      <header className='border-b bg-white'>
        <div className='container mx-auto px-4 h-16 flex items-center justify-between'>
          <Link to='/' className='font-bold text-xl flex items-center gap-2'>
            <Car className='w-6 h-6' />
            <span>CarHistory</span>
          </Link>
          <LangSwitcher />
        </div>
      </header>
    );
  }

  if (isAdmin(user?.role)) {
    return <AdminHeader />;
  }
  return <UserHeader />;
};

export default Header;
