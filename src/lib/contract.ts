// src/lib/contract.ts
import { createPublicClient, http, parseAbi, encodeFunctionData } from 'viem';
import { base } from 'viem/chains';

// ABI for our TippingContract
export const tippingContractABI = parseAbi([
  'event TipSent(address indexed tipper, address indexed creator, address indexed token, uint256 amount, string message, uint256 timestamp)',
  'event Withdrawal(address indexed creator, address indexed token, uint256 amount, uint256 timestamp)',
  'function tip(address creator, address token, uint256 amount, string memory message) payable',
  'function withdraw(address token, uint256 amount) payable',
  'function getTipsReceived(address creator) view returns (uint256)',
  'function getTipsSent(address tipper) view returns (uint256)',
  'function getCreatorTotalTips(address creator, address token) external view returns (uint256)',
  'function getRecentTips(address creator, uint256 limit) external view returns (tuple(address tipper, address creator, address token, uint256 amount, string message, uint256 timestamp)[] memory)',
  'function getTipCount(address creator) external view returns (uint256)',
  'function tipsReceived(address) view returns (uint256)',
  'function tipsSent(address) view returns (uint256)',
  'function creatorTokenTips(address, address) view returns (uint256)',
  'function ETH_ADDRESS() view returns (address)'
]);

// Contract address - will be set after deployment
export const TIPPING_CONTRACT_ADDRESS = import.meta.env.VITE_TIPPING_CONTRACT_ADDRESS as `0x${string}`;

// Initialize public client for read operations
export const publicClient = createPublicClient({
  chain: base,
  transport: http(import.meta.env.VITE_BASE_RPC_URL),
});

// Helper function to encode tip function call
export function encodeTipCall(creator: `0x${string}`, token: `0x${string}`, amount: bigint, message: string) {
  return encodeFunctionData({
    abi: tippingContractABI,
    functionName: 'tip',
    args: [creator, token, amount, message],
  });
}