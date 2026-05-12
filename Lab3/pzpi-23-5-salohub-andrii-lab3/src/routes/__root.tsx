import Header from '@/components/shared/header.component';
import { queryClient } from '@/lib/query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Toaster } from 'sonner';

const RootLayout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
      <Toaster position='bottom-right' richColors />
    </QueryClientProvider>
  );
};

export const Route = createRootRoute({ component: RootLayout });
