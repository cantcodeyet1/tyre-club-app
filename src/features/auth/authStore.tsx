import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  clearStoredTokens,
  getStoredToken,
  setStoredTokens,
} from '../../shared/auth/tokenStorage';

import {
  getCurrentUser,
  logoutRequest,
  signIn,
  signInWithGoogle,
  signUp,
  updateProfile,
} from './api';

import type { GoogleAuthRequest, SignInRequest, SignUpRequest } from './types';
import type { User } from '../../shared/types/domain';

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (payload: SignInRequest) => Promise<void>;
  loginWithGoogle: (payload: GoogleAuthRequest) => Promise<void>;
  register: (payload: SignUpRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (payload: { name?: string; phone?: string }) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      try {
        const token = await getStoredToken();

        if (token) {
          const restoredUser = await getCurrentUser();

          if (isMounted) {
            setUser(restoredUser);
          }
        }
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    }

    void restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (payload: SignInRequest) => {
    const response = await signIn(payload);
    await setStoredTokens(response.accessToken, response.refreshToken);
    setUser(response.user);
  }, []);

  const register = useCallback(async (payload: SignUpRequest) => {
    const response = await signUp(payload);
    await setStoredTokens(response.accessToken, response.refreshToken);
    setUser(response.user);
  }, []);

  const loginWithGoogle = useCallback(async (payload: GoogleAuthRequest) => {
    const response = await signInWithGoogle(payload);
    await setStoredTokens(response.accessToken, response.refreshToken);
    setUser(response.user);
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    await clearStoredTokens();
    setUser(null);
  }, []);

  const updateUser = useCallback(
    async (payload: { name?: string; phone?: string }) => {
      const updated = await updateProfile(payload);
      setUser(updated);
    },
    [],
  );

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(user),
      isInitializing,
      login,
      loginWithGoogle,
      logout,
      register,
      updateUser,
      user,
    }),
    [isInitializing, login, loginWithGoogle, logout, register, updateUser, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
