import { Router } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../db';
import { oauth2Client, authenticateToken, AuthenticatedRequest } from '../utils/oauth';

const router = Router();

// Get public OAuth client config (client_id is safe to share)
router.get('/config', (req, res) => {
  res.json({
    clientId: process.env.GOOGLE_CLIENT_ID || '',
  });
});

// Exchange OAuth authorization code for Google API tokens
router.post('/google-callback', async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Auth code is required' });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    
    if (!tokens.id_token) {
      return res.status(400).json({ error: 'No ID token received from Google' });
    }

    // Verify ID token to extract email and google user ID
    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ error: 'Invalid ID token payload' });
    }

    const { sub: googleId, email, name } = payload;
    const tokenExpiry = tokens.expiry_date ? new Date(tokens.expiry_date) : null;

    // Check if user exists, create if not
    let user = await prisma.user.findUnique({
      where: { googleId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId,
          email,
          name,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          tokenExpiry,
        },
      });
    } else {
      user = await prisma.user.update({
        where: { googleId },
        data: {
          email,
          name,
          accessToken: tokens.access_token,
          ...(tokens.refresh_token && { refreshToken: tokens.refresh_token }),
          tokenExpiry,
        },
      });
    }

    // Sign session JWT
    const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    res.json({
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    console.error('OAuth Callback Error:', error);
    res.status(500).json({ error: 'Authentication failed', details: error.message });
  }
});

// Verify JWT session and return current user details
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        name: true,
        googleId: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch profile', details: error.message });
  }
});

export default router;
