import { apiRequest, isMockApi, mockDelay } from '../../shared/api/apiClient';
import { endpoints } from '../../shared/api/endpoints';
import { getStoredRefreshToken } from '../../shared/auth/tokenStorage';
import { mockUser } from '../../shared/mockData';

import type {
  AuthResponse,
  GoogleAuthRequest,
  ResetPasswordRequest,
  SignInRequest,
  SignUpRequest,
} from './types';

const mockAuthResponse: AuthResponse = {
  user: mockUser,
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
};

export async function signIn(payload: SignInRequest): Promise<AuthResponse> {
  if (isMockApi) {
    return mockDelay({
      ...mockAuthResponse,
      user: { ...mockUser, email: payload.email },
    });
  }

  return apiRequest<AuthResponse, SignInRequest>({
    method: 'POST',
    url: endpoints.auth.login,
    data: payload,
  });
}

export async function signUp(payload: SignUpRequest): Promise<AuthResponse> {
  if (isMockApi) {
    return mockDelay({
      ...mockAuthResponse,
      user: { ...mockUser, email: payload.email, name: payload.name },
    });
  }

  return apiRequest<AuthResponse, SignUpRequest>({
    method: 'POST',
    url: endpoints.auth.register,
    data: payload,
  });
}

export async function signInWithGoogle(
  payload: GoogleAuthRequest,
): Promise<AuthResponse> {
  if (isMockApi) {
    return mockDelay(mockAuthResponse);
  }

  return apiRequest<AuthResponse, GoogleAuthRequest>({
    method: 'POST',
    url: endpoints.auth.google,
    data: payload,
  });
}

export async function forgotPassword(email: string): Promise<{ ok: true }> {
  if (isMockApi) {
    return mockDelay({ ok: true });
  }

  return apiRequest<{ ok: true }, { email: string }>({
    method: 'POST',
    url: endpoints.auth.forgotPassword,
    data: { email },
  });
}

export async function resetPassword(
  payload: ResetPasswordRequest,
): Promise<{ ok: true }> {
  if (isMockApi) {
    return mockDelay({ ok: true });
  }

  return apiRequest<{ ok: true }, ResetPasswordRequest>({
    method: 'POST',
    url: endpoints.auth.resetPassword,
    data: payload,
  });
}

export async function verifyEmail(token: string): Promise<{ ok: true }> {
  if (isMockApi) {
    return mockDelay({ ok: true });
  }

  return apiRequest<{ ok: true }, { token: string }>({
    method: 'POST',
    url: endpoints.auth.verifyEmail,
    data: { token },
  });
}

export async function getCurrentUser() {
  if (isMockApi) {
    return mockDelay(mockUser);
  }

  return apiRequest<typeof mockUser>({ method: 'GET', url: endpoints.auth.me });
}

export async function updateProfile(payload: {
  name?: string;
  phone?: string;
}) {
  if (isMockApi) {
    return mockDelay({ ...mockUser, ...payload });
  }

  return apiRequest<typeof mockUser, typeof payload>({
    method: 'PATCH',
    url: endpoints.auth.updateMe,
    data: payload,
  });
}

export async function logoutRequest(): Promise<{ ok: true }> {
  if (isMockApi) {
    return mockDelay({ ok: true });
  }

  const refreshToken = await getStoredRefreshToken();

  return apiRequest<{ ok: true }, { refreshToken?: string }>({
    method: 'POST',
    url: endpoints.auth.logout,
    data: refreshToken ? { refreshToken } : undefined,
  });
}
