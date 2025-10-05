import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

// Request logging middleware helper
export function logRequest(request: Request, userId?: string) {
  const url = new URL(request.url);
  logger.info({
    method: request.method,
    url: url.pathname,
    userAgent: request.headers.get('user-agent'),
    userId,
    ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
  }, 'Request received');
}

// Error logging helper
export function logError(error: Error, context?: Record<string, any>) {
  logger.error({
    error: error.message,
    stack: error.stack,
    ...context,
  }, 'Error occurred');
}

// Transfer logging helper
export function logTransfer(
  transferId: string,
  action: 'created' | 'completed' | 'cancelled' | 'failed',
  details: Record<string, any>
) {
  logger.info({
    transferId,
    action,
    ...details,
  }, `Transfer ${action}`);
}

// Authentication logging helper
export function logAuth(
  userId: string,
  action: 'login' | 'logout' | 'failed_login',
  method: 'telegram' | 'farcaster',
  details?: Record<string, any>
) {
  logger.info({
    userId,
    action,
    method,
    ...details,
  }, `Auth ${action} via ${method}`);
}

// Wallet operation logging helper
export function logWallet(
  walletId: string,
  action: 'created' | 'funded' | 'withdrawn',
  details: Record<string, any>
) {
  logger.info({
    walletId,
    action,
    ...details,
  }, `Wallet ${action}`);
}

export default logger;

