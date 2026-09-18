import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AuthProvider, useAuth } from './authStore';

function AuthHarness() {
  const { isAuthenticated, login, user } = useAuth();

  return (
    <div>
      <p>{isAuthenticated ? user?.email : 'signed out'}</p>
      <button
        type="button"
        onClick={() =>
          login({ email: 'test@tyreclub.co.zw', password: 'password' })
        }
      >
        Sign in
      </button>
    </div>
  );
}

describe('Auth flow', () => {
  it('stores signed-in user state', async () => {
    render(
      <AuthProvider>
        <AuthHarness />
      </AuthProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText('test@tyreclub.co.zw')).toBeInTheDocument();
  });
});
