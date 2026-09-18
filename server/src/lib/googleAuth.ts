import { env } from '../env.js';

export type GoogleProfile = {
  googleId: string;
  email: string;
  name: string;
  avatarUrl?: string;
};

type GoogleUserInfoResponse = {
  sub?: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
};

/**
 * Verifies a Google OAuth2 access token by asking Google's own userinfo
 * endpoint who it belongs to. A forged/expired token simply fails this
 * fetch, so this doubles as verification without needing a JWT library.
 */
export async function verifyGoogleAccessToken(
  accessToken: string,
): Promise<GoogleProfile> {
  if (!env.googleClientId) {
    throw new Error(
      'Google sign-in is not configured on the server (missing GOOGLE_CLIENT_ID)',
    );
  }

  const response = await fetch(
    'https://www.googleapis.com/oauth2/v3/userinfo',
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  if (!response.ok) {
    throw new Error('Invalid Google credential');
  }

  const payload = (await response.json()) as GoogleUserInfoResponse;

  if (!payload.sub || !payload.email) {
    throw new Error('Invalid Google credential');
  }

  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name ?? payload.email.split('@')[0],
    avatarUrl: payload.picture,
  };
}
