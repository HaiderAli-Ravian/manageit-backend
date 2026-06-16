import { Response } from 'express';
import { CookieOptions } from 'express';

function cookieOptions(maxAge?: number): CookieOptions {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
    ...(maxAge !== undefined && { maxAge }),
  };
}

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
): void {
  res.cookie('access_token', accessToken, cookieOptions(15 * 60 * 1000));
  res.cookie(
    'refresh_token',
    refreshToken,
    cookieOptions(7 * 24 * 60 * 60 * 1000),
  );
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie('access_token', cookieOptions());
  res.clearCookie('refresh_token', cookieOptions());
}
