import { App as CapacitorApp } from '@capacitor/app';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { BottomNav } from './BottomNav';
import { Header } from './Header';
import { MobileFrame } from './MobileFrame';

import type { PluginListenerHandle } from '@capacitor/core';

export function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const showBottomNav = [
    '/home',
    '/vehicles',
    '/health',
    '/trips',
    '/deals',
  ].includes(location.pathname);

  // The SPA doesn't reload the document on navigation, so the browser
  // never resets scroll position on its own — without this, going back
  // from a long page (e.g. MAZ scheme) lands you mid-scroll on Deals.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    let handle: PluginListenerHandle | undefined;

    void CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      if (location.pathname === '/home') {
        void CapacitorApp.exitApp();

        return;
      }

      if (canGoBack) {
        navigate(-1);
      } else {
        navigate('/home');
      }
    }).then((listener) => {
      handle = listener;
    });

    return () => {
      void handle?.remove();
    };
  }, [location.pathname, navigate]);

  return (
    <MobileFrame>
      <div className="relative min-h-screen bg-background">
        <Header />
        <Outlet />
        {showBottomNav ? <BottomNav /> : null}
      </div>
    </MobileFrame>
  );
}
