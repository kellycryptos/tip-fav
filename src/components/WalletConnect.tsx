'use client';

import { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';

import { formatAddress } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, isPending: isConnecting, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const [showDisconnect, setShowDisconnect] = useState(false);

  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();

  if (isConnected && address) {
    if (chain?.id !== 8453) {
      return (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => switchChain({ chainId: 8453 })}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <ExclamationTriangleIcon className="w-4 h-4" />
          Switch to Base
        </motion.button>
      );
    }

    return (
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowDisconnect(!showDisconnect)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          {formatAddress(address)}
        </motion.button>

        {showDisconnect && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg p-2 z-50 w-48"
          >
            <button
              onClick={() => {
                disconnect();
                setShowDisconnect(false);
              }}
              className="text-red-400 hover:text-red-300 text-sm font-medium w-full text-left px-2 py-1 rounded hover:bg-gray-700"
            >
              Disconnect Wallet
            </button>
          </motion.div>
        )}
      </div>
    );
  }

  const hasInjectedWallet = connectors.some(c => c.type === 'injected');

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        const injectedConnector = connectors.find(c => c.type === 'injected');
        if (injectedConnector) {
          connect({ connector: injectedConnector });
        }
      }}
      disabled={isConnecting || !hasInjectedWallet}
      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
    >
      {isConnecting ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Connecting...
        </>
      ) : !hasInjectedWallet ? (
        'Install Wallet'
      ) : (
        'Connect Wallet'
      )}
    </motion.button>
  );
}