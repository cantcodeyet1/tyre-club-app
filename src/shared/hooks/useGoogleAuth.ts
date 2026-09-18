import { useCallback, useRef } from 'react';

type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
};

type GoogleTokenClient = {
  requestAccessToken: () => void;
};

type GoogleAccounts = {
  oauth2: {
    initTokenClient: (config: {
      client_id: string;
      scope: string;
      callback: (response: GoogleTokenResponse) => void;
      error_callback?: (error: { type?: string }) => void;
    }) => GoogleTokenClient;
  };
};

declare global {
  interface Window {
    google?: { accounts: GoogleAccounts };
  }
}

const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

let scriptLoadPromise: Promise<void> | null = null;

function loadGoogleScript(): Promise<void> {
  if (window.google?.accounts) {
    return Promise.resolve();
  }

  scriptLoadPromise ??= new Promise((resolve, reject) => {
    const existing = document.querySelector(
      `script[src="${GOOGLE_SCRIPT_SRC}"]`,
    );

    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () =>
        reject(new Error('Failed to load Google Sign-In')),
      );

      return;
    }

    const script = document.createElement('script');
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Sign-In'));
    document.head.appendChild(script);
  });

  return scriptLoadPromise;
}

export function useGoogleAuth() {
  const clientRef = useRef<GoogleTokenClient | null>(null);

  const requestGoogleAccessToken = useCallback(async (): Promise<string> => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      throw new Error('Google sign-in is not configured for this app yet.');
    }

    await loadGoogleScript();

    if (!window.google?.accounts) {
      throw new Error('Google sign-in failed to load. Please try again.');
    }

    return new Promise<string>((resolve, reject) => {
      clientRef.current ??= window.google!.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'openid email profile',
        callback: (response) => {
          if (response.error || !response.access_token) {
            reject(new Error('Google sign-in was cancelled or failed.'));

            return;
          }

          resolve(response.access_token);
        },
        error_callback: () => {
          reject(new Error('Google sign-in was cancelled or failed.'));
        },
      });

      clientRef.current.requestAccessToken();
    });
  }, []);

  return { requestGoogleAccessToken };
}
