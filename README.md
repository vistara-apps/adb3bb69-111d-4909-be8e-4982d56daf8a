# TapPay - Base MiniApp

Send crypto as easy as sending a message—just tap their Telegram username.

## Features

- 🔍 **Telegram Username Lookup** - Find users by their Telegram handle with identity verification
- ⏱️ **Reversible Test Transfers** - 5-minute cancellation window for test transactions
- 💼 **Auto-Created Custodial Wallets** - Zero-setup receiving for new users
- 💰 **One-Tap Fiat Off-Ramp** - Convert crypto to local currency instantly
- 📊 **Transaction History** - Real-time feed with status tracking
- 🔔 **Frame Notifications** - Push notifications via Farcaster Frames
- 🔐 **Secure Authentication** - Telegram Web App and Farcaster integration
- 🛡️ **Rate Limiting** - DDoS protection and fair usage
- 📱 **Mobile-First Design** - Optimized for MiniApp experience

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with connection pooling
- **Blockchain**: Base L2 via OnchainKit & viem
- **Styling**: Tailwind CSS with custom design system
- **Identity**: Farcaster integration via MiniKit
- **Authentication**: JWT with Telegram Web App data
- **Caching**: Upstash Redis for rate limiting
- **TypeScript**: Full type safety with Zod validation
- **Logging**: Pino for structured logging

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Telegram Bot Token
- Coinbase OnchainKit API key
- Upstash Redis (for rate limiting)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tappay-base-miniapp
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Configure your environment variables in `.env.local`:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/tappay

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_BOT_USERNAME=@your_bot_username

# Base Blockchain
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
BASE_PRIVATE_KEY=your_base_wallet_private_key

# Coinbase Commerce (Fiat Off-ramp)
COINBASE_COMMERCE_API_KEY=your_coinbase_commerce_api_key
COINBASE_COMMERCE_WEBHOOK_SECRET=your_webhook_secret

# OnchainKit
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key

# Encryption
ENCRYPTION_KEY=your_32_character_encryption_key_here

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# App URL
NEXT_PUBLIC_APP_URL=https://your-app-domain.com
```

4. Set up the database:
```bash
# The app will automatically create tables on first run
# Or run manually:
npm run db:init
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses PostgreSQL with the following main tables:

- **users**: Telegram user profiles and wallet information
- **custodial_wallets**: Auto-created wallets for recipients
- **transfers**: Transaction records with status tracking
- **fiat_withdrawals**: Off-ramp transaction records
- **mutual_contacts**: Social graph for trust signals

## API Endpoints

### Authentication
- `POST /api/auth` - Authenticate user (Telegram/Farcaster)
- `GET /api/auth` - Verify authentication

### Users
- `POST /api/users` - Create/update user
- `GET /api/users` - Get user by ID or username

### Transfers
- `POST /api/transfers` - Create new transfer
- `GET /api/transfers` - Get user transfers
- `POST /api/transfers/[id]/cancel` - Cancel test transfer

### Wallets
- `POST /api/wallets` - Create custodial wallet
- `GET /api/wallets` - Get wallet balance

### Telegram Integration
- `GET /api/telegram/user` - Lookup user profile
- `POST /api/telegram/webhook` - Handle bot updates

### Farcaster Frames
- `POST /api/frames` - Handle frame interactions
- `GET /api/frames/image` - Generate frame images

### Fiat Withdrawals
- `POST /api/withdrawals` - Initiate fiat withdrawal

## Architecture

### Core Services

- **TelegramService**: Handles Telegram Bot API integration
- **BaseService**: Manages Base blockchain operations
- **WalletService**: Custodial wallet management
- **NotificationService**: Cross-platform notifications
- **Auth**: JWT-based authentication

### Key Components

- `SendCryptoForm`: Main transfer interface with username lookup
- `IdentityCard`: User verification display with mutual contacts
- `TransactionFeed`: Real-time transaction history
- `CountdownTimer`: Test transfer cancellation interface
- `FiatWithdrawal`: Off-ramp interface
- `StatusBadge`: Transaction status indicators

### Security Features

- **Rate Limiting**: Prevents abuse with Upstash Redis
- **Input Validation**: Zod schemas for all API inputs
- **Encryption**: Private keys encrypted at rest
- **Authentication**: JWT tokens with expiration
- **CORS**: Configured for MiniApp security

## Business Logic

### Transfer Flow
1. User searches for recipient by Telegram username
2. System verifies identity and shows trust signals
3. User initiates transfer (test or full amount)
4. For test transfers: 5-minute cancellation window
5. Funds transferred on Base network
6. Recipient notified via Farcaster Frame
7. Auto-wallet creation for first-time recipients

### Fee Structure
- 0.5% transfer fee (capped at $2 per transaction)
- Test transfers: Same fee structure
- Fiat withdrawals: Additional conversion fees

### Fiat Off-Ramp
- Integration with Coinbase Commerce
- Real-time conversion rates
- 1-3 business days settlement
- KYC verification required

## Deployment

### Environment Setup

1. **Database**: Set up PostgreSQL instance
2. **Redis**: Configure Upstash Redis for rate limiting
3. **Wallet**: Set up Base network wallet with USDC
4. **Telegram Bot**: Create and configure bot
5. **Farcaster**: Set up app registration

### Production Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables for Production

Ensure all environment variables are set in your deployment platform (Vercel, Railway, etc.).

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:init` - Initialize database tables

### Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Code Quality

- **ESLint**: Configured with Next.js and Prettier
- **TypeScript**: Strict type checking enabled
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks for quality checks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT

## Support

For support and questions:
- Create an issue on GitHub
- Join our Telegram community
- Check the documentation
