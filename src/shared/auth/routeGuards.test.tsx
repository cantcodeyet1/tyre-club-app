import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { AuthProvider } from '../../features/auth/authStore';

import { ProtectedRoute } from './routeGuards';

describe('ProtectedRoute', () => {
  it('redirects anonymous users to sign in', async () => {
    window.localStorage.clear();
    render(
      <MemoryRouter initialEntries={['/home']}>
        <AuthProvider>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<div>Home</div>} />
            </Route>
            <Route path="/sign-in" element={<div>Sign in screen</div>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByText(/sign in screen/i)).toBeInTheDocument();
  });
});
