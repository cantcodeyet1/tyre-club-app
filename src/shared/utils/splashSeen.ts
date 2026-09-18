const SPLASH_SEEN_KEY = 'tyreclub.hasSeenSplash';

export function hasSeenSplash(): boolean {
  if (typeof window === 'undefined') {
    return true;
  }

  try {
    return window.sessionStorage.getItem(SPLASH_SEEN_KEY) === 'true';
  } catch {
    return true;
  }
}

export function markSplashSeen(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.sessionStorage.setItem(SPLASH_SEEN_KEY, 'true');
  } catch {
    // Ignore storage errors (private browsing, etc.) — worst case the
    // splash just shows again next time.
  }
}
