import { createFileRoute } from '@tanstack/react-router';
import { useAuthStore } from '@/store/auth.store';
import AuthPage from '@/pages/auth.page';
import MyCarsPage from '@/pages/my-cars.page';
import { isAdmin } from '@/lib/roles';
import AdminPage from '@/pages/admin.page';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const { accessToken, user } = useAuthStore();

  if (!accessToken) return <AuthPage />;
  if (isAdmin(user?.role)) return <AdminPage />;
  return <MyCarsPage />;
}
