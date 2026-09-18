import type { User } from '../../shared/types/domain';

export type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export type SignInRequest = {
  email: string;
  password: string;
};

export type SignUpRequest = {
  name: string;
  email: string;
  password: string;
};

export type ResetPasswordRequest = {
  token: string;
  password: string;
};

export type GoogleAuthRequest = {
  accessToken: string;
};
