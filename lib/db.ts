import { Pool } from 'pg';

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Database tables
export const createTables = async () => {
  const client = await pool.connect();

  try {
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        telegram_id TEXT UNIQUE NOT NULL,
        telegram_username TEXT UNIQUE,
        profile_pic_url TEXT,
        full_name TEXT NOT NULL,
        wallet_address TEXT,
        custodial_wallet_created BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);
      CREATE INDEX IF NOT EXISTS idx_users_telegram_username ON users(telegram_username);
    `);

    // Custodial wallets table
    await client.query(`
      CREATE TABLE IF NOT EXISTS custodial_wallets (
        wallet_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
        base_address TEXT UNIQUE NOT NULL,
        encrypted_private_key TEXT NOT NULL,
        balance DECIMAL(36,18) DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_custodial_wallets_user_id ON custodial_wallets(user_id);
      CREATE INDEX IF NOT EXISTS idx_custodial_wallets_address ON custodial_wallets(base_address);
    `);

    // Transfers table
    await client.query(`
      CREATE TABLE IF NOT EXISTS transfers (
        transfer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sender_id UUID REFERENCES users(user_id),
        recipient_id UUID REFERENCES users(user_id),
        recipient_telegram_username TEXT NOT NULL,
        amount DECIMAL(36,18) NOT NULL,
        currency TEXT NOT NULL DEFAULT 'USDC',
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled', 'failed')),
        is_test_transfer BOOLEAN DEFAULT FALSE,
        cancellable_until TIMESTAMP WITH TIME ZONE,
        transaction_hash TEXT,
        fee_amount DECIMAL(36,18) NOT NULL DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        completed_at TIMESTAMP WITH TIME ZONE
      );

      CREATE INDEX IF NOT EXISTS idx_transfers_sender_id ON transfers(sender_id);
      CREATE INDEX IF NOT EXISTS idx_transfers_recipient_id ON transfers(recipient_id);
      CREATE INDEX IF NOT EXISTS idx_transfers_status ON transfers(status);
      CREATE INDEX IF NOT EXISTS idx_transfers_created_at ON transfers(created_at DESC);
    `);

    // Fiat withdrawals table
    await client.query(`
      CREATE TABLE IF NOT EXISTS fiat_withdrawals (
        withdrawal_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
        crypto_amount DECIMAL(36,18) NOT NULL,
        crypto_currency TEXT NOT NULL,
        fiat_amount DECIMAL(36,18) NOT NULL,
        fiat_currency TEXT NOT NULL DEFAULT 'USD',
        bank_account_id TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
        estimated_arrival TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_fiat_withdrawals_user_id ON fiat_withdrawals(user_id);
      CREATE INDEX IF NOT EXISTS idx_fiat_withdrawals_status ON fiat_withdrawals(status);
    `);

    // Mutual contacts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS mutual_contacts (
        user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
        contact_telegram_id TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        PRIMARY KEY (user_id, contact_telegram_id)
      );

      CREATE INDEX IF NOT EXISTS idx_mutual_contacts_user_id ON mutual_contacts(user_id);
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Query helpers
export const db = {
  // Users
  async getUserByTelegramId(telegramId: string) {
    const result = await pool.query(
      'SELECT * FROM users WHERE telegram_id = $1',
      [telegramId]
    );
    return result.rows[0];
  },

  async getUserByTelegramUsername(username: string) {
    const result = await pool.query(
      'SELECT * FROM users WHERE telegram_username = $1',
      [username]
    );
    return result.rows[0];
  },

  async createUser(userData: {
    telegramId: string;
    telegramUsername?: string;
    profilePicUrl?: string;
    fullName: string;
  }) {
    const result = await pool.query(
      `INSERT INTO users (telegram_id, telegram_username, profile_pic_url, full_name)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (telegram_id) DO UPDATE SET
         telegram_username = EXCLUDED.telegram_username,
         profile_pic_url = EXCLUDED.profile_pic_url,
         full_name = EXCLUDED.full_name,
         last_active_at = NOW()
       RETURNING *`,
      [userData.telegramId, userData.telegramUsername, userData.profilePicUrl, userData.fullName]
    );
    return result.rows[0];
  },

  // Custodial Wallets
  async getCustodialWallet(userId: string) {
    const result = await pool.query(
      'SELECT * FROM custodial_wallets WHERE user_id = $1',
      [userId]
    );
    return result.rows[0];
  },

  async createCustodialWallet(walletData: {
    userId: string;
    baseAddress: string;
    encryptedPrivateKey: string;
  }) {
    const result = await pool.query(
      `INSERT INTO custodial_wallets (user_id, base_address, encrypted_private_key)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [walletData.userId, walletData.baseAddress, walletData.encryptedPrivateKey]
    );
    return result.rows[0];
  },

  async updateWalletBalance(walletId: string, balance: number) {
    await pool.query(
      'UPDATE custodial_wallets SET balance = $1 WHERE wallet_id = $2',
      [balance, walletId]
    );
  },

  // Transfers
  async createTransfer(transferData: {
    senderId?: string;
    recipientId?: string;
    recipientTelegramUsername: string;
    amount: number;
    currency: string;
    isTestTransfer: boolean;
    feeAmount: number;
  }) {
    const cancellableUntil = transferData.isTestTransfer
      ? new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now
      : null;

    const result = await pool.query(
      `INSERT INTO transfers (
        sender_id, recipient_id, recipient_telegram_username,
        amount, currency, is_test_transfer, cancellable_until, fee_amount
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        transferData.senderId,
        transferData.recipientId,
        transferData.recipientTelegramUsername,
        transferData.amount,
        transferData.currency,
        transferData.isTestTransfer,
        cancellableUntil,
        transferData.feeAmount,
      ]
    );
    return result.rows[0];
  },

  async getTransfer(transferId: string) {
    const result = await pool.query(
      'SELECT * FROM transfers WHERE transfer_id = $1',
      [transferId]
    );
    return result.rows[0];
  },

  async updateTransferStatus(transferId: string, status: string, transactionHash?: string) {
    const completedAt = status === 'completed' || status === 'cancelled' ? new Date() : null;
    await pool.query(
      'UPDATE transfers SET status = $1, transaction_hash = $2, completed_at = $3 WHERE transfer_id = $4',
      [status, transactionHash, completedAt, transferId]
    );
  },

  async getUserTransfers(userId: string, limit = 50, offset = 0) {
    const result = await pool.query(
      `SELECT * FROM transfers
       WHERE sender_id = $1 OR recipient_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows;
  },

  async cancelTransfer(transferId: string) {
    const result = await pool.query(
      `UPDATE transfers
       SET status = 'cancelled', completed_at = NOW()
       WHERE transfer_id = $1 AND status = 'pending' AND cancellable_until > NOW()
       RETURNING *`,
      [transferId]
    );
    return result.rows[0];
  },

  // Fiat Withdrawals
  async createFiatWithdrawal(withdrawalData: {
    userId: string;
    cryptoAmount: number;
    cryptoCurrency: string;
    fiatAmount: number;
    fiatCurrency: string;
    bankAccountId: string;
    estimatedArrival: Date;
  }) {
    const result = await pool.query(
      `INSERT INTO fiat_withdrawals (
        user_id, crypto_amount, crypto_currency,
        fiat_amount, fiat_currency, bank_account_id, estimated_arrival
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        withdrawalData.userId,
        withdrawalData.cryptoAmount,
        withdrawalData.cryptoCurrency,
        withdrawalData.fiatAmount,
        withdrawalData.fiatCurrency,
        withdrawalData.bankAccountId,
        withdrawalData.estimatedArrival,
      ]
    );
    return result.rows[0];
  },

  async updateFiatWithdrawalStatus(withdrawalId: string, status: string) {
    await pool.query(
      'UPDATE fiat_withdrawals SET status = $1 WHERE withdrawal_id = $2',
      [status, withdrawalId]
    );
  },

  // Mutual Contacts
  async getMutualContacts(userId: string) {
    const result = await pool.query(
      'SELECT * FROM mutual_contacts WHERE user_id = $1',
      [userId]
    );
    return result.rows;
  },

  async addMutualContact(userId: string, contactTelegramId: string) {
    await pool.query(
      `INSERT INTO mutual_contacts (user_id, contact_telegram_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, contact_telegram_id) DO NOTHING`,
      [userId, contactTelegramId]
    );
  },
};

export default pool;

