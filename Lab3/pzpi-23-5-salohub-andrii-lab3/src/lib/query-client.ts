import { QueryCache, QueryClient } from '@tanstack/react-query';
import { ApiError } from '@/api/client';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: error => {
      if (error instanceof ApiError && error.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('loginType');
        window.location.replace('/login');
      }
    },
  }),
});
