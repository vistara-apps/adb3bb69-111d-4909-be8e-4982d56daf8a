import { db } from '@/lib/db';
import { telegramService } from './services/telegram';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export interface AuthUser {
  userId: string;
  telegramId: string;
  telegramUsername?: string;
  fullName: string;
  custodialWalletCreated: boolean;
}

/**
 * Authenticate user from Telegram Web App data
 */
export async function authenticateFromTelegramWebApp(initData: string): Promise<AuthUser | null> {
  try {
    // Parse Telegram Web App init data
    const params = new URLSearchParams(initData);
    const userData = params.get('user');

    if (!userData) {
      throw new Error('No user data in Telegram Web App init data');
    }

    const user = JSON.parse(userData);
    const telegramId = user.id.toString();
    const telegramUsername = user.username;
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();

    // Create or update user in database
    const dbUser = await db.createUser({
      telegramId,
      telegramUsername,
      fullName,
    });

    return {
      userId: dbUser.user_id,
      telegramId: dbUser.telegram_id,
      telegramUsername: dbUser.telegram_username,
      fullName: dbUser.full_name,
      custodialWalletCreated: dbUser.custodial_wallet_created,
    };
  } catch (error) {
    console.error('Error authenticating from Telegram Web App:', error);
    return null;
  }
}

/**
 * Authenticate user from Farcaster
 */
export async function authenticateFromFarcaster(fid: number): Promise<AuthUser | null> {
  try {
    // In a real implementation, you'd verify the Farcaster signature
    // and get user data from Farcaster APIs

    // For now, create a mock user based on FID
    const telegramId = `fc_${fid}`;
    const fullName = `Farcaster User ${fid}`;

    const dbUser = await db.createUser({
      telegramId,
      fullName,
    });

    return {
      userId: dbUser.user_id,
      telegramId: dbUser.telegram_id,
      fullName: dbUser.full_name,
      custodialWalletCreated: dbUser.custodial_wallet_created,
    };
  } catch (error) {
    console.error('Error authenticating from Farcaster:', error);
    return null;
  }
}

/**
 * Generate JWT token for authenticated user
 */
export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      userId: user.userId,
      telegramId: user.telegramId,
      telegramUsername: user.telegramUsername,
      fullName: user.fullName,
      custodialWalletCreated: user.custodialWalletCreated,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      userId: decoded.userId,
      telegramId: decoded.telegramId,
      telegramUsername: decoded.telegramUsername,
      fullName: decoded.fullName,
      custodialWalletCreated: decoded.custodialWalletCreated,
    };
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

/**
 * Get current user from request headers
 */
export function getCurrentUser(request: Request): AuthUser | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  return verifyToken(token);
}

