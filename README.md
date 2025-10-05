# TapPay - Base MiniApp

Send crypto as easy as sending a message—just tap their Telegram username.

## Features

- 🔍 **Telegram Username Lookup** - Find users by their Telegram handle with identity verification
- ⏱️ **Reversible Test Transfers** - 5-minute cancellation window for test transactions
- 💼 **Auto-Created Custodial Wallets** - Zero-setup receiving for new users
- 💰 **One-Tap Fiat Off-Ramp** - Convert crypto to local currency instantly
- 📊 **Transaction History** - Real-time feed with status tracking
- 🔔 **Frame Notifications** - Push notifications via Farcaster Frames

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base L2 via OnchainKit
- **Styling**: Tailwind CSS with custom design system
- **Identity**: Farcaster integration via MiniKit
- **TypeScript**: Full type safety

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Add your API keys:
- `NEXT_PUBLIC_ONCHAINKIT_API_KEY` - Coinbase OnchainKit API key
- `TELEGRAM_BOT_TOKEN` - Telegram Bot API token
- `UPSTASH_REDIS_REST_URL` - Upstash Redis URL
- `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis token

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Theme Support

TapPay supports multiple blockchain themes:
- **Finance (Default)**: Dark navy with gold accents
- **Celo**: Black with yellow accents
- **Solana**: Purple with magenta accents
- **Base**: Dark blue with Base blue
- **Coinbase**: Navy with Coinbase blue

Visit `/theme-preview` to see all themes.

## Architecture

### Data Model
- **User**: Telegram identity and wallet info
- **CustodialWallet**: Auto-created wallets for recipients
- **Transfer**: Transaction records with status tracking
- **FiatWithdrawal**: Off-ramp transaction records
- **MutualContact**: Social graph for trust signals

### Key Components
- `SendCryptoForm`: Main transfer interface
- `IdentityCard`: User verification display
- `TransactionFeed`: Transaction history
- `CountdownTimer`: Test transfer cancellation timer
- `StatusBadge`: Transaction status indicators

## API Integration

- **Base MiniKit SDK**: Wallet connection and transactions
- **Telegram Bot API**: User lookup and notifications
- **Base RPC**: On-chain operations
- **Coinbase Commerce**: Fiat on/off-ramp
- **Farcaster Frames**: Push notifications

## License

MIT
