import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { RequireAuth } from './components/RequireAuth';
import { PageLoader } from './components/ui/Loader';
import './index.css';

// Simple wrapper for lazy loading with Suspense
const lazyLoad = (
  importFunc: () => Promise<{ default: React.ComponentType }>,
  fallback: React.ReactNode = <PageLoader />
) => {
  const LazyComponent = lazy(importFunc);
  
  return (props: any) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Lazy load pages
const Login = lazyLoad(() => import('./pages/Login'));
const Register = lazyLoad(() => import('./pages/Register'));
const Dashboard = lazyLoad(() => import('./pages/Dashboard'));
const Transfer = lazyLoad(() => import('./pages/Transfer'));
const Transactions = lazyLoad(() => import('./pages/Transactions'));
const Profile = lazyLoad(() => import('./pages/Profile'));
const NotFound = lazyLoad(() => import('./pages/NotFound'));
const Unauthorized = lazyLoad(() => import('./pages/Unauthorized'));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Toaster position="top-right" />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Protected routes */}
              <Route
                element={
                  <RequireAuth>
                    <Outlet />
                  </RequireAuth>
                }
              >
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/transfer" element={<Transfer />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              
              {/* Admin routes - example of role-based access */}
              {/* 
              <Route
                path="/admin"
                element={
                  <RequireAuth requiredRole="ADMIN">
                    <AdminDashboard />
                  </RequireAuth>
                }
              />
              */}
              
              {/* 404 - Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#363636',
                color: '#fff',
                padding: '12px 16px',
                borderRadius: '8px',
              },
              success: {
                style: {
                  background: '#D1FAE5',
                  color: '#065F46',
                },
                iconTheme: {
                  primary: '#059669',
                  secondary: '#D1FAE5',
                },
              },
              error: {
                style: {
                  background: '#FEE2E2',
                  color: '#B91C1C',
                },
                iconTheme: {
                  primary: '#DC2626',
                  secondary: '#FEE2E2',
                },
              },
            }}
          />
        </AuthProvider>
      </Router>
      
      {/* React Query Devtools - only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom" buttonPosition="bottom-right" />
      )}
    </QueryClientProvider>
  );
}

export default App;
