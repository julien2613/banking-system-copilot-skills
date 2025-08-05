import { QueryClient, QueryClientProvider as ReactQueryProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export const QueryClientProvider = ({ children }: { children: ReactNode }) => (
  <ReactQueryProvider client={queryClient}>
    {children}
  </ReactQueryProvider>
);
