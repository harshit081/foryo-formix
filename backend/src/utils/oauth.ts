import { OAuth2Client } from 'google-auth-library';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../db';

export const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'postmessage'
);

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token missing' });

  jwt.verify(token, process.env.JWT_SECRET!, (err: any, decoded: any) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.userId = decoded.userId;
    next();
  });
};

export const getGoogleOAuthClient = async (userId: string): Promise<OAuth2Client> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'postmessage'
  );

  client.setCredentials({
    access_token: user.accessToken || undefined,
    refresh_token: user.refreshToken || undefined,
    expiry_date: user.tokenExpiry ? user.tokenExpiry.getTime() : undefined,
  });

  // Force token refresh if it's expired or about to expire in 5 minutes
  const isExpired = !user.tokenExpiry || (user.tokenExpiry.getTime() - Date.now() < 5 * 60 * 1000);

  if (isExpired && user.refreshToken) {
    try {
      const { credentials } = await client.refreshAccessToken();
      await prisma.user.update({
        where: { id: userId },
        data: {
          accessToken: credentials.access_token,
          tokenExpiry: credentials.expiry_date ? new Date(credentials.expiry_date) : null,
        },
      });
      client.setCredentials(credentials);
    } catch (error) {
      console.error('Error refreshing Google OAuth access token:', error);
    }
  }

  return client;
};
