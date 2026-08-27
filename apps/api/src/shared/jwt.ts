import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export interface JwtPayload {
  userId: string;
}

export const generateToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as any
  };
  return jwt.sign({ userId }, env.JWT_SECRET, options);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};

// Frontend (Vercel) and backend (DO) live on different domains in
// production, so the auth cookie must be sent cross-site — that requires
// SameSite=None, which browsers only honor when Secure is also set (hence
// both are tied to NODE_ENV rather than sameSite being a fixed 'lax').
// In dev, frontend and backend share the effective site (localhost), so
// 'lax' + non-secure keeps local HTTP development working without HTTPS.
export const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: (env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
  maxAge: 24 * 60 * 60 * 1000 // 1 day in ms
};
