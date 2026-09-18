import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../../features/auth/authStore';
import { LoadingState } from '../components/primitives/LoadingState';
import { useSettingsStore } from '../stores/settingsStore';
import { hasSeenSplash } from '../utils/splashSeen';

const splashGatedPaths = ['/sign-in', '/sign-up'];

export function ProtectedRoute() {
  const { isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return <LoadingState label="Restoring session" />;
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/sign-in" />;
  }

  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { isAuthenticated, isInitializing } = useAuth();
  const landingScreen = useSettingsStore((state) => state.landingScreen);
  const location = useLocation();

  if (isInitializing) {
    return <LoadingState label="Restoring session" />;
  }

  if (isAuthenticated) {
    return <Navigate replace to={`/${landingScreen}`} />;
  }

  if (splashGatedPaths.includes(location.pathname) && !hasSeenSplash()) {
    return <Navigate replace to="/splash" />;
  }

  return <Outlet />;
}
