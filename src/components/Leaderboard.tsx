'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatEth, shortenUsername } from '@/lib/utils';
import { TrophyIcon, FireIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface LeaderboardEntry {
  fid: number;
  username: string;
  displayName: string;
  avatarUrl: string;
  totalTips: string;
  tipCount: number;
  rank: number;
}

interface LeaderboardProps {
  timeFrame?: '24h' | '7d' | '30d' | 'all';
}

const TIME_FRAMES = [
  { id: '24h', label: '24 Hours' },
  { id: '7d', label: '7 Days' },
  { id: '30d', label: '30 Days' },
  { id: 'all', label: 'All Time' }
] as const;

export function Leaderboard({ timeFrame = '7d' }: LeaderboardProps) {
  const [activeTimeFrame, setActiveTimeFrame] = useState(timeFrame);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockLeaderboard: LeaderboardEntry[] = [
      {
        fid: 1,
        username: 'first_creator',
        displayName: 'First Creator',
        avatarUrl: '',
        totalTips: '2.5',
        tipCount: 42,
        rank: 1
      },
      {
        fid: 2,
        username: 'popular_creator',
        displayName: 'Popular Creator',
        avatarUrl: '',
        totalTips: '1.8',
        tipCount: 38,
        rank: 2
      },
      {
        fid: 3,
        username: 'content_master',
        displayName: 'Content Master',
        avatarUrl: '',
        totalTips: '1.2',
        tipCount: 29,
        rank: 3
      },
      {
        fid: 4,
        username: 'rising_star',
        displayName: 'Rising Star',
        avatarUrl: '',
        totalTips: '0.9',
        tipCount: 21,
        rank: 4
      },
      {
        fid: 5,
        username: 'new_creator',
        displayName: 'New Creator',
        avatarUrl: '',
        totalTips: '0.6',
        tipCount: 15,
        rank: 5
      }
    ];

    setTimeout(() => {
      setLeaderboard(mockLeaderboard);
      setIsLoading(false);
    }, 800);
  }, [activeTimeFrame]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <TrophyIcon className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <TrophyIcon className="w-6 h-6 text-gray-300" />;
    if (rank === 3) return <TrophyIcon className="w-6 h-6 text-amber-600" />;
    return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
  };

  const getRankGradient = (rank: number) => {
    if (rank === 1) return 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
    if (rank === 2) return 'from-gray-400/20 to-gray-500/20 border-gray-400/30';
    if (rank === 3) return 'from-amber-600/20 to-orange-500/20 border-amber-600/30';
    return 'from-gray-700/20 to-gray-800/20 border-gray-700/30';
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FireIcon className="w-6 h-6 text-orange-500" />
            Creator Leaderboard
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <CalendarIcon className="w-4 h-4" />
            {TIME_FRAMES.find(tf => tf.id === activeTimeFrame)?.label}
          </div>
        </div>

        {/* Time Frame Selector */}
        <div className="flex gap-2">
          {TIME_FRAMES.map((tf) => (
            <button
              key={tf.id}
              onClick={() => setActiveTimeFrame(tf.id as any)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTimeFrame === tf.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="p-6">
        {leaderboard.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔥</div>
            <p className="text-gray-400">No creators found</p>
            <p className="text-sm text-gray-500 mt-1">Start tipping to see the leaderboard!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((creator, index) => (
              <motion.div
                key={creator.fid}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-r ${getRankGradient(creator.rank)} border rounded-xl p-4 transition-all hover:scale-[1.02]`}
              >
                <div className="flex items-center justify-between">
                  {/* Rank and Creator Info */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12">
                      {getRankIcon(creator.rank)}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                        {creator.displayName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-white">
                          {shortenUsername(creator.displayName, 18)}
                        </div>
                        <div className="text-sm text-gray-400">
                          @{shortenUsername(creator.username, 15)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <div className="font-bold text-green-400 text-lg">
                      {formatEth(creator.totalTips)} ETH
                    </div>
                    <div className="text-sm text-gray-400">
                      {creator.tipCount} tips
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* View All Button */}
        {leaderboard.length > 0 && (
          <div className="mt-6 text-center">
            <button className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
              View Full Leaderboard →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}