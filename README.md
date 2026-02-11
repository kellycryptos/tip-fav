# TIP FAV - Farcaster Mini App

A production-ready Farcaster Mini App for on-chain tipping with ETH and ERC20 tokens on the Base network.

## Features

- ✅ Farcaster Frames integration for seamless tipping
- ✅ On-chain tipping with ETH and USDC support
- ✅ Gas-optimized smart contracts
- ✅ Premium UI/UX with dark theme and animations
- ✅ Farcaster-native experience
- ✅ Vercel deployment ready

## Farcaster Frames Integration

TIP FAV includes a comprehensive Farcaster Frames implementation that allows users to tip creators directly from Farcaster. The frames integration includes:

- Main tipping interface with preset amounts
- Creator profile views
- Tip confirmation flows
- Transaction processing via Base network
- Success and follow-up actions
- Dynamic Open Graph images

### Frame Routes

- `/frames` - Main tipping interface
- `/frames/confirm` - Tip confirmation
- `/frames/amount-options` - Tip amount selection
- `/frames/profile` - Creator profile view
- `/frames/tip/transaction` - Transaction processing
- `/frames/tip/result` - Post-transaction actions

## Getting Started

### Prerequisites

- Node.js 18+
- A deployed BaseTippingContract
- Farcaster developer access

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kellycryptos/tip-fav.git
   cd tip-fav
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Update the environment variables with your configuration

5. Run the development server:
   ```bash
   npm run dev
   ```

### Deploying the Smart Contract

Before using the Frames, you need to deploy the BaseTippingContract:

```bash
npm run deploy:sepolia  # For Base Sepolia testnet
# or
npm run deploy:mainnet  # For Base mainnet
```

Update the `NEXT_PUBLIC_TIPPING_CONTRACT_ADDRESS` environment variable with the deployed contract address.

## Contributing

Contributions are welcome! Please open an issue first to discuss what you would like to change.

## License

MIT
