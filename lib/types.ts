export interface User {
  userId: string;
  telegramId: string;
  telegramUsername: string;
  profilePicUrl?: string;
  fullName: string;
  walletAddress?: string;
  custodialWalletCreated: boolean;
  createdAt: Date;
  lastActiveAt: Date;
}

export interface CustodialWallet {
  walletId: string;
  userId: string;
  baseAddress: string;
  encryptedPrivateKey: string;
  balance: number;
  createdAt: Date;
}

export interface Transfer {
  transferId: string;
  senderId: string;
  recipientId: string;
  recipientTelegramUsername: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'cancelled' | 'failed';
  isTestTransfer: boolean;
  cancellableUntil?: Date;
  transactionHash?: string;
  feeAmount: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface FiatWithdrawal {
  withdrawalId: string;
  userId: string;
  cryptoAmount: number;
  cryptoCurrency: string;
  fiatAmount: number;
  fiatCurrency: string;
  bankAccountId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  estimatedArrival: Date;
  createdAt: Date;
}

export interface MutualContact {
  userId: string;
  contactTelegramId: string;
  createdAt: Date;
}
