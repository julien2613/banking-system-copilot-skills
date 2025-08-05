import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader } from './ui/Loader';

interface RequireAuthProps {
  children: ReactNode;
  requiredRole?: 'USER' | 'ADMIN';
  redirectTo?: string;
}

export const RequireAuth = ({
  children,
  requiredRole = 'USER',
  redirectTo = '/login',
}: RequireAuthProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login page with the current location to redirect back after login
      navigate(redirectTo, { 
        state: { from: location },
        replace: true 
      });
    } else if (!isLoading && isAuthenticated && user?.role !== requiredRole) {
      // Redirect to unauthorized page if user doesn't have the required role
      navigate('/unauthorized', { replace: true });
    }
  }, [isAuthenticated, isLoading, user, requiredRole, navigate, location, redirectTo]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!isAuthenticated || (user?.role !== requiredRole && requiredRole === 'ADMIN')) {
    return null;
  }

  return <>{children}</>;
};
