# TIP FAV Deployment Guide

## Overview
TIP FAV is a Farcaster Mini App for on-chain tipping built on Base network. This guide covers deploying the smart contract and configuring the frontend.

## Prerequisites

1. **Node.js** (v18 or higher)
2. **pnpm** (recommended) or npm/yarn
3. **Base network account** with some ETH for gas fees
4. **Basescan API key** for contract verification (optional)

## Environment Setup

1. Copy the `.env.example` file to `.env.local`:

```bash
cp .env.example .env.local
```

2. Configure the environment variables:

```env
# Base Network Configuration
NEXT_PUBLIC_BASE_RPC_URL=https://developer-access-mainnet.base.org
NEXT_PUBLIC_TIPPING_CONTRACT_ADDRESS= # Will be filled after deployment

# Farcaster Configuration
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_FARCASTER_DEPLOYMENT_URL=https://your-domain.vercel.app

# WalletConnect Project ID (get from https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Private key for deployment (never commit this!)
PRIVATE_KEY=your_private_key_here

# Basescan API key for verification (optional)
BASESCAN_API_KEY=your_basescan_api_key
```

## Smart Contract Deployment

### 1. Compile the Contract

```bash
npm run compile
```

### 2. Deploy to Base Sepolia (Testnet)

```bash
npm run deploy:sepolia
```

### 3. Deploy to Base Mainnet

```bash
npm run deploy:mainnet
```

### 4. Verify the Contract (after deployment)

After deployment, copy the contract address and update your `.env.local` file:

```bash
NEXT_PUBLIC_TIPPING_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

Then verify on Basescan:

```bash
npx hardhat verify --network base 0xYourDeployedContractAddress
```

## Frontend Deployment

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Application

```bash
npm run build
```

### 3. Test Locally

```bash
npm run start
```

## Vercel Deployment

### 1. Push to GitHub Repository

Push your code to a GitHub repository.

### 2. Connect to Vercel

1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Set the build command to `npm run build`
4. Set the output directory to `.next`
5. Add your environment variables in the Vercel dashboard

### 3. Environment Variables for Vercel

Set these environment variables in your Vercel project settings:

- `NEXT_PUBLIC_BASE_URL` - Your Vercel deployment URL
- `NEXT_PUBLIC_FARCASTER_DEPLOYMENT_URL` - Your Vercel deployment URL
- `NEXT_PUBLIC_BASE_RPC_URL` - Base RPC URL
- `NEXT_PUBLIC_TIPPING_CONTRACT_ADDRESS` - Deployed contract address
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - WalletConnect project ID

## Farcaster Mini App Setup

### 1. Domain Verification

1. Ensure your domain is properly configured
2. Add DNS records as required by Farcaster

### 2. Mini App Registration

1. Visit the Farcaster developer portal
2. Register your mini app using the manifest at `/api/farcaster.json`

### 3. Testing

1. Use the Farcaster Warpcast app to test your mini app
2. Share the mini app URL to test the integration

## Troubleshooting

### Common Issues

1. **Contract Verification Failure**: Wait a few minutes and try again
2. **Build Errors**: Ensure all environment variables are set correctly
3. **Wallet Connection Issues**: Check network configuration in wagmi
4. **Frame Actions Not Working**: Verify the post URLs in frame responses

### Security Notes

- Never commit private keys to version control
- Use different contract addresses for testnet/mainnet
- Ensure contract is properly audited before mainnet deployment

## Contract Features

- **Gas Optimized**: Efficient storage patterns to minimize gas costs
- **ETH & ERC20 Support**: Accept both native ETH and ERC20 tokens
- **No Admin**: Ownerless design for enhanced security
- **Event Logging**: Comprehensive event emission for indexing
- **Safe Transfers**: Uses OpenZeppelin's SafeERC20 for secure transfers

## Support

For issues with deployment, check the logs and ensure all prerequisites are met.