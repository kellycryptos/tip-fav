'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWaitForTransactionReceipt, useWriteContract, useEstimateGas } from 'wagmi';
import { parseEther, formatEther, encodeFunctionData } from 'viem';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatEth } from '@/lib/utils';
import { CheckCircleIcon, ExclamationTriangleIcon, ArrowPathIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { tippingContractABI, TIPPING_CONTRACT_ADDRESS } from '@/lib/contract';

interface TipFormProps {
  creatorAddress: `0x${string}`;
  creatorName: string;
  onTipSuccess?: (amount: string, token: string) => void;
}

const TIP_PRESETS = [
  { amount: '0.001', label: 'Small Tip' },
  { amount: '0.005', label: 'Medium Tip' },
  { amount: '0.01', label: 'Large Tip' },
];

export function TipForm({ creatorAddress, creatorName, onTipSuccess }: TipFormProps) {
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Derive arguments for contract write
  const txArgs = (amount && !isNaN(parseFloat(amount))) ? [
    creatorAddress,
    '0x0000000000000000000000000000000000000000', // ETH token address placeholder
    parseEther(amount),
    message
  ] : undefined;

  // Gas Estimation using useEstimateGas
  const { data: gasEstimate, isFetching: isEstimatingGas, error: gasError } = useEstimateGas({
    to: TIPPING_CONTRACT_ADDRESS,
    data: txArgs ? encodeFunctionData({
      abi: tippingContractABI,
      functionName: 'tip',
      args: txArgs
    }) : undefined,
    value: amount ? parseEther(amount) : undefined,
    query: {
      enabled: isConnected && !!amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0,
    }
  });

  const { writeContract, data: hash, isPending: isWritePending, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const isPending = isWritePending || isConfirming;

  const handleSubmit = async () => {
    if (!isConnected || !amount) return;

    // Validate amount
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      console.error('Invalid amount');
      return;
    }

    // Validate creator address
    if (!creatorAddress || creatorAddress === '0x0000000000000000000000000000000000000000') {
      console.error('Invalid creator address');
      return;
    }

    try {
      writeContract({
        address: TIPPING_CONTRACT_ADDRESS,
        abi: tippingContractABI,
        functionName: 'tip',
        args: [creatorAddress, '0x0000000000000000000000000000000000000000', parseEther(amount), message],
        value: parseEther(amount)
      });
    } catch (err) {
      console.error('Tip failed:', err);
    }
  };

  useEffect(() => {
    if (isSuccess && onTipSuccess) {
      onTipSuccess(amount, 'ETH');
    }
  }, [isSuccess, onTipSuccess, amount]);


  const selectPreset = (presetAmount: string) => {
    setAmount(presetAmount);
    setIsCustomAmount(false);
  };

  const handleCustomAmount = () => {
    setIsCustomAmount(true);
    setAmount('');
  };

  // Handle success animation
  if (isSuccess || showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircleIcon className="w-8 h-8 text-white" />
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-2">Tip Sent Successfully!</h3>
        <p className="text-green-200 mb-4">
          You tipped {formatEth(amount)} ETH to {creatorName}
        </p>
        {message && (
          <p className="text-green-300 text-sm italic">"{message}"</p>
        )}
        <button
          onClick={() => {
            setShowSuccess(false);
            setAmount('');
            setMessage('');
          }}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Send Another Tip
        </button>
      </motion.div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">Tip {creatorName}</h3>

      {!TIPPING_CONTRACT_ADDRESS && (
        <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-500 mb-2">
            <ExclamationTriangleIcon className="w-5 h-5" />
            <span className="font-bold text-sm">Configuration Required</span>
          </div>
          <p className="text-yellow-200/80 text-xs leading-relaxed">
            The Tippping Contract Address is not configured. Please add <code className="bg-yellow-500/20 px-1 rounded text-yellow-400">VITE_TIPPING_CONTRACT_ADDRESS</code> to your Vercel environment variables and redeploy.
          </p>
        </div>
      )}

      {/* Tip Presets */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {TIP_PRESETS.map((preset) => (
          <motion.button
            key={preset.amount}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => selectPreset(preset.amount)}
            className={cn(
              'py-3 px-2 rounded-lg font-medium transition-all',
              amount === preset.amount
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white'
            )}
          >
            <div className="text-sm">{formatEth(preset.amount)} ETH</div>
            <div className="text-xs opacity-75">{preset.label}</div>
          </motion.button>
        ))}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleCustomAmount}
          className={cn(
            'py-3 px-2 rounded-lg font-medium transition-all',
            isCustomAmount
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white'
          )}
        >
          <div className="text-sm">Custom</div>
          <div className="text-xs opacity-75">Amount</div>
        </motion.button>
      </div>

      {/* Custom Amount Input */}
      {isCustomAmount && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4"
        >
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Custom Amount (ETH)
          </label>
          <input
            type="number"
            step="0.000000000000000001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.001"
            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </motion.div>
      )}

      {/* Message Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Message (Optional)
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Thanks for the great content!"
          maxLength={280}
          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[80px] resize-none"
        />
        <div className="text-xs text-gray-400 text-right mt-1">
          {message.length}/280
        </div>
      </div>

      {/* Gas Estimation & Fees */}
      {amount && isConnected && (
        <div className="mb-4 text-xs text-gray-400 flex items-center justify-between px-1">
          <div className="flex items-center gap-1">
            <BanknotesIcon className="w-3 h-3" />
            <span>Estimated Gas:</span>
          </div>
          <span>
            {isEstimatingGas ? 'Calculating...' : gasEstimate ? `~${formatEth(formatEther(gasEstimate))} ETH` : 'Unknown'}
          </span>
        </div>
      )}

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: isConnected && amount && !isPending ? 1.02 : 1 }}
        whileTap={{ scale: isConnected && amount && !isPending ? 0.98 : 1 }}
        onClick={handleSubmit}
        disabled={!isConnected || !amount || isPending || (!!gasError)}
        className={cn(
          'w-full py-4 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2',
          isConnected && amount && !isPending && !gasError
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl'
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
        )}
      >
        {isPending ? (
          <>
            <ArrowPathIcon className="w-5 h-5 animate-spin" />
            {isConfirming ? 'Confirming...' : 'Processing...'}
          </>
        ) : (
          `Tip ${amount ? formatEth(amount) + ' ETH' : ''}`
        )}
      </motion.button>

      {/* Error Message */}
      <AnimatePresence>
        {(writeError || gasError) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2"
          >
            <ExclamationTriangleIcon className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span className="text-red-300 text-sm">
              {writeError?.message || gasError?.message || 'Transaction failed. Please try again.'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transaction Status */}
      <AnimatePresence>
        {hash && !isSuccess && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <ArrowPathIcon className="w-4 h-4 text-blue-400 animate-spin" />
              <span className="text-blue-300 text-sm">
                Transaction sent...
                <a
                  href={`https://basescan.org/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline ml-1"
                >
                  View on BaseScan
                </a>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}