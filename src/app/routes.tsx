import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { ProtectedRoute, PublicOnlyRoute } from '../shared/auth/routeGuards';
import { AppShell } from '../shared/components/layout/AppShell';
import { LoadingState } from '../shared/components/primitives/LoadingState';
import { useSettingsStore } from '../shared/stores/settingsStore';

const Splash = lazy(() => import('../features/auth/pages/Splash'));
const SignIn = lazy(() => import('../features/auth/pages/SignIn'));
const SignUp = lazy(() => import('../features/auth/pages/SignUp'));
const ForgotPassword = lazy(
  () => import('../features/auth/pages/ForgotPassword'),
);
const ResetPassword = lazy(
  () => import('../features/auth/pages/ResetPassword'),
);
const VerifyEmail = lazy(() => import('../features/auth/pages/VerifyEmail'));
const NotificationPermission = lazy(
  () => import('../features/auth/pages/NotificationPermission'),
);
const VehicleSetupWizard = lazy(
  () => import('../features/onboarding/pages/VehicleSetupWizard'),
);
const HomePage = lazy(() => import('../features/home/pages/HomePage'));
const VehicleListPage = lazy(
  () => import('../features/vehicles/pages/VehicleListPage'),
);
const VehicleDetailPage = lazy(
  () => import('../features/vehicles/pages/VehicleDetailPage'),
);
const CheckDetailPage = lazy(
  () => import('../features/vehicles/pages/CheckDetailPage'),
);
const AddVehiclePage = lazy(
  () => import('../features/vehicles/pages/AddVehiclePage'),
);
const EditVehiclePage = lazy(
  () => import('../features/vehicles/pages/EditVehiclePage'),
);
const HealthPage = lazy(() => import('../features/health/pages/HealthPage'));
const TripsPage = lazy(() => import('../features/trips/pages/TripsPage'));
const PlanTripPage = lazy(() => import('../features/trips/pages/PlanTripPage'));
const ActiveTripPage = lazy(
  () => import('../features/trips/pages/ActiveTripPage'),
);
const PastTripDetailsPage = lazy(
  () => import('../features/trips/pages/PastTripDetailsPage'),
);
const EditTripPage = lazy(() => import('../features/trips/pages/EditTripPage'));
const DealsHubPage = lazy(() => import('../features/deals/pages/DealsHubPage'));
const BuyOnCreditPage = lazy(
  () => import('../features/deals/pages/BuyOnCreditPage'),
);
const MazSchemePage = lazy(
  () => import('../features/deals/pages/MazSchemePage'),
);
const BuyTyresPage = lazy(() => import('../features/deals/pages/BuyTyresPage'));
const TyreClubHubPage = lazy(
  () => import('../features/deals/pages/TyreClubHubPage'),
);
const BranchesPage = lazy(() => import('../features/deals/pages/BranchesPage'));
const ProductsPage = lazy(() => import('../features/deals/pages/ProductsPage'));
const HelpPage = lazy(() => import('../features/deals/pages/HelpPage'));
const ProfilePage = lazy(() => import('../features/profile/pages/ProfilePage'));
const NotificationPreferencesPage = lazy(
  () => import('../features/profile/pages/NotificationPreferencesPage'),
);
const AppSettingsPage = lazy(
  () => import('../features/profile/pages/AppSettingsPage'),
);

function RouteFallback() {
  return <LoadingState label="Loading screen" />;
}

export function AppRoutes() {
  const landingScreen = useSettingsStore((state) => state.landingScreen);

  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/splash" element={<Splash />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route
              path="/notifications/permission"
              element={<NotificationPermission />}
            />
            <Route
              path="/onboarding/vehicle"
              element={<VehicleSetupWizard />}
            />
            <Route path="/home" element={<HomePage />} />
            <Route path="/vehicles" element={<VehicleListPage />} />
            <Route path="/vehicles/add" element={<AddVehiclePage />} />
            <Route
              path="/vehicles/:vehicleId"
              element={<VehicleDetailPage />}
            />
            <Route
              path="/vehicles/:vehicleId/edit"
              element={<EditVehiclePage />}
            />
            <Route
              path="/vehicles/:vehicleId/checks/:checkId"
              element={<CheckDetailPage />}
            />
            <Route path="/health" element={<HealthPage />} />
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/trips/plan" element={<PlanTripPage />} />
            <Route path="/trips/:tripId" element={<PastTripDetailsPage />} />
            <Route path="/trips/:tripId/active" element={<ActiveTripPage />} />
            <Route path="/trips/:tripId/edit" element={<EditTripPage />} />
            <Route path="/deals" element={<DealsHubPage />} />
            <Route path="/deals/credit" element={<BuyOnCreditPage />} />
            <Route path="/deals/maz" element={<MazSchemePage />} />
            <Route path="/deals/buy-tyres" element={<BuyTyresPage />} />
            <Route path="/tyre-club" element={<TyreClubHubPage />} />
            <Route path="/tyre-club/branches" element={<BranchesPage />} />
            <Route path="/tyre-club/products" element={<ProductsPage />} />
            <Route path="/tyre-club/help" element={<HelpPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route
              path="/profile/notifications"
              element={<NotificationPreferencesPage />}
            />
            <Route path="/profile/settings" element={<AppSettingsPage />} />
          </Route>
        </Route>
        <Route path="/" element={<Navigate replace to="/splash" />} />
        <Route path="*" element={<Navigate replace to={`/${landingScreen}`} />} />
      </Routes>
    </Suspense>
  );
}
