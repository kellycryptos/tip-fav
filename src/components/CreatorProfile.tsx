'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatAddress, formatEth, getTimeAgo } from '@/lib/utils';

interface CreatorProfileProps {
  fid: number;
}

interface TipData {
  tipper: string;
  amount: string;
  message: string;
  timestamp: number;
}

export function CreatorProfile({ fid }: CreatorProfileProps) {
  const [tips, setTips] = useState<TipData[]>([]);
  const [totalTips, setTotalTips] = useState('0');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockTips: TipData[] = [
      {
        tipper: '0x1234...5678',
        amount: '0.01',
        message: 'Great content! Keep it up 🚀',
        timestamp: Date.now() - 3600000
      },
      {
        tipper: '0xabcd...ef01',
        amount: '0.005',
        message: 'Thanks for sharing this',
        timestamp: Date.now() - 7200000
      },
      {
        tipper: '0x5678...9012',
        amount: '0.02',
        message: 'This is amazing! 💜',
        timestamp: Date.now() - 10800000
      }
    ];

    setTimeout(() => {
      setTips(mockTips);
      setTotalTips('0.035');
      setIsLoading(false);
    }, 1000);
  }, [fid]);

  if (isLoading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-700 rounded-xl mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden">
      {/* Profile Header */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-2xl">
            👤
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Creator Name</h2>
            <p className="text-gray-400">@creator-handle</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-gray-500">FID: {fid}</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">
                {formatAddress('0x1234567890123456789012345678901234567890')}
              </span>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-700/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{formatEth(totalTips)} ETH</div>
            <div className="text-sm text-gray-400">Total Tips</div>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{tips.length}</div>
            <div className="text-sm text-gray-400">Tips Received</div>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">#{fid}</div>
            <div className="text-sm text-gray-400">Rank</div>
          </div>
        </div>
      </div>

      {/* Recent Tips */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">Recent Tips</h3>
        
        {tips.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">💜</div>
            <p className="text-gray-400">No tips yet</p>
            <p className="text-sm text-gray-500 mt-1">Be the first to tip this creator!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">👤</span>
                    </div>
                    <div>
                      <div className="font-medium text-white">{formatAddress(tip.tipper)}</div>
                      <div className="text-sm text-gray-400">{getTimeAgo(tip.timestamp)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-400">{formatEth(tip.amount)} ETH</div>
                    {tip.message && (
                      <div className="text-sm text-gray-300 mt-1 max-w-xs truncate">
                        "{tip.message}"
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}