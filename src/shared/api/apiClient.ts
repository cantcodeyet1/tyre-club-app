import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

import {
  clearStoredTokens,
  getStoredRefreshToken,
  getStoredToken,
  setStoredTokens,
} from '../auth/tokenStorage';

import { endpoints } from './endpoints';

import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

type ApiErrorShape = {
  message?: string;
};

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const baseURL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';

export const isMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';

const axiosClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(async (config) => {
  const token = await getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

type RetryableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await getStoredRefreshToken();

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await axios.post<{
      accessToken: string;
      refreshToken: string;
    }>(`${baseURL}${endpoints.auth.refresh}`, { refreshToken });

    await setStoredTokens(
      response.data.accessToken,
      response.data.refreshToken,
    );

    return response.data.accessToken;
  } catch {
    await clearStoredTokens();

    return null;
  }
}

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorShape>) => {
    const originalRequest = error.config as RetryableConfig | undefined;
    const isAuthEndpoint =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register') ||
      originalRequest?.url?.includes('/auth/refresh');

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retried &&
      !isAuthEndpoint
    ) {
      originalRequest._retried = true;
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
      const newAccessToken = await refreshPromise;

      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosClient.request(originalRequest);
      }
    }

    const message =
      error.response?.data?.message ?? error.message ?? 'Something went wrong';
    throw new ApiError(message, error.response?.status);
  },
);

export async function apiRequest<TResponse, TBody = unknown>(
  config: AxiosRequestConfig<TBody>,
): Promise<TResponse> {
  const response = await axiosClient.request<TResponse>(config);

  return response.data;
}

export async function mockDelay<T>(payload: T, ms = 180): Promise<T> {
  await new Promise((resolve) => window.setTimeout(resolve, ms));

  return payload;
}
