export const SUPPORTED_CURRENCIES = ['USDC', 'ETH', 'DAI'] as const;

export const TRANSFER_LIMITS = {
  min: 1,
  max: 10000,
  testMin: 1,
  testMax: 5,
} as const;

export const TEST_TRANSFER_WINDOW = 5 * 60 * 1000; // 5 minutes in milliseconds

export const FEE_CONFIG = {
  percentage: 0.005, // 0.5%
  maxFee: 2,
} as const;

export const TELEGRAM_BOT_API = 'https://api.telegram.org/bot';

export const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org';
