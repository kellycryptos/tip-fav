export interface Tip {
  id: string;
  tipper: `0x${string}`;
  creator: `0x${string}`;
  token: `0x${string}` | 'ETH';
  amount: string;
  message?: string;
  timestamp: number;
  transactionHash: `0x${string}`;
}

export interface CreatorProfile {
  fid: number;
  username: string;
  displayName: string;
  avatarUrl: string;
  walletAddress: `0x${string}`;
  totalTipsReceived: string;
  tipCount: number;
  recentTippers: Array<{
    fid: number;
    username: string;
    amount: string;
    timestamp: number;
  }>;
}

export interface LeaderboardEntry {
  fid: number;
  username: string;
  displayName: string;
  avatarUrl: string;
  totalTips: string;
  tipCount: number;
  rank: number;
}

export type TimeFrame = '24h' | '7d' | '30d' | 'all';

export interface FrameActionData {
  fid: number;
  username: string;
  displayName: string;
  avatarUrl: string;
  message: string;
  tipAmount: string;
  token: 'ETH' | `0x${string}`;
}