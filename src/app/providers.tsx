import { App as CapacitorApp } from '@capacitor/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, type ReactNode } from 'react';
import { BrowserRouter, useNavigate } from 'react-router-dom';

import { AuthProvider } from '../features/auth/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 2,
    },
  },
});

function DeepLinkHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const remove = CapacitorApp.addListener('appUrlOpen', ({ url }) => {
      const parsed = new URL(url);
      const host = parsed.host;
      const segments = parsed.pathname.split('/').filter(Boolean);

      if (
        host === 'vehicle' &&
        segments[0] &&
        segments[1] === 'check' &&
        segments[2]
      ) {
        navigate(`/vehicles/${segments[0]}/checks/${segments[2]}`);
      } else if (host === 'vehicle' && segments[0]) {
        navigate(`/vehicles/${segments[0]}`);
      } else if (host === 'trip' && segments[0]) {
        navigate(`/trips/${segments[0]}`);
      } else if ((host === 'deal' || host === 'deals') && segments[0]) {
        navigate('/deals');
      } else if (host === 'branch' && segments[0]) {
        navigate('/tyre-club/branches');
      }
    });

    return () => {
      void remove.then((handler) => handler.remove());
    };
  }, [navigate]);

  return null;
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <DeepLinkHandler />
          {children}
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
