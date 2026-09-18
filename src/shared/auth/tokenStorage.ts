import { Preferences } from '@capacitor/preferences';

const accessTokenKey = 'tyreclub.accessToken';
const refreshTokenKey = 'tyreclub.refreshToken';

const isNativePreferencesAvailable = () =>
  typeof window !== 'undefined' && typeof Preferences?.get === 'function';

export async function getStoredToken(): Promise<string | null> {
  if (isNativePreferencesAvailable()) {
    const result = await Preferences.get({ key: accessTokenKey });

    return result.value;
  }

  return window.localStorage.getItem(accessTokenKey);
}

export async function getStoredRefreshToken(): Promise<string | null> {
  if (isNativePreferencesAvailable()) {
    const result = await Preferences.get({ key: refreshTokenKey });

    return result.value;
  }

  return window.localStorage.getItem(refreshTokenKey);
}

export async function setStoredTokens(
  accessToken: string,
  refreshToken?: string,
): Promise<void> {
  if (isNativePreferencesAvailable()) {
    await Preferences.set({ key: accessTokenKey, value: accessToken });

    if (refreshToken) {
      await Preferences.set({ key: refreshTokenKey, value: refreshToken });
    }

    return;
  }

  window.localStorage.setItem(accessTokenKey, accessToken);

  if (refreshToken) {
    window.localStorage.setItem(refreshTokenKey, refreshToken);
  }
}

export async function clearStoredTokens(): Promise<void> {
  if (isNativePreferencesAvailable()) {
    await Preferences.remove({ key: accessTokenKey });
    await Preferences.remove({ key: refreshTokenKey });

    return;
  }

  window.localStorage.removeItem(accessTokenKey);
  window.localStorage.removeItem(refreshTokenKey);
}
