import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import sdk from '@farcaster/miniapp-sdk';
import { WalletConnect } from './components/WalletConnect';
import { TipForm } from './components/TipForm';
import { CreatorProfile } from './components/CreatorProfile';
import { Leaderboard } from './components/Leaderboard';
import { ToastProvider } from './components/Toast';
import { cn } from './lib/utils';

export default function App() {
    const [activeTab, setActiveTab] = useState<'tip' | 'profile' | 'leaderboard'>('tip');
    const [isSDKLoaded, setIsSDKLoaded] = useState(false);

    useEffect(() => {
        const init = async () => {
            if (typeof window !== 'undefined') {
                try {
                    console.log("Calling sdk.actions.ready()");
                    await sdk.actions.ready();
                    setIsSDKLoaded(true);
                } catch (err) {
                    console.error("Farcaster ready error:", err);
                }
            }
        };

        init();
    }, []);


    return (
        <ToastProvider>
            <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white font-sans">
                {/* Animated Background Elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{
                            x: [0, 100, 0],
                            y: [0, -100, 0],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            x: [0, -100, 0],
                            y: [0, 100, 0],
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
                    />
                </div>

                {/* Header */}
                <header className="border-b border-gray-800/50 backdrop-blur-sm sticky top-0 z-50">
                    <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center"
                            >
                                <span className="text-white font-bold text-lg">💜</span>
                            </motion.div>
                            <div>
                                <h1 className="text-xl font-bold">TIP FAV</h1>
                                <p className="text-sm text-gray-400">Farcaster Tipping App</p>
                            </div>
                        </motion.div>

                        <WalletConnect />
                    </div>
                </header>

                {/* Navigation */}
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex gap-1 bg-gray-800/50 p-1 rounded-xl w-fit mx-auto mb-8 backdrop-blur-sm">
                        {(['tip', 'profile', 'leaderboard'] as const).map((tab) => (
                            <motion.button
                                key={tab}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    'px-6 py-2 rounded-lg font-medium transition-all duration-200 relative',
                                    activeTab === tab
                                        ? 'text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white'
                                )}
                            >
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg z-0"
                                        initial={false}
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10">
                                    {tab === 'tip' ? 'Tip Creator' : tab === 'profile' ? 'View Profile' : 'Leaderboard'}
                                </span>
                            </motion.button>
                        ))}
                    </div>

                    {/* Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-2xl mx-auto"
                        >
                            {activeTab === 'tip' ? (
                                <TipForm
                                    creatorAddress="0x0000000000000000000000000000000000000000"
                                    creatorName="Creator"
                                    onTipSuccess={(amount, token) => {
                                        const event = new CustomEvent('show-toast', { detail: { message: `Successfully tipped ${amount} ${token}!`, type: 'success' } });
                                        window.dispatchEvent(event);
                                    }}
                                />
                            ) : activeTab === 'profile' ? (
                                <CreatorProfile fid={1} />
                            ) : (
                                <Leaderboard />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <footer className="border-t border-gray-800/50 mt-16 py-8">
                    <div className="max-w-4xl mx-auto px-4 text-center text-gray-500 text-sm">
                        <p>Built for the Farcaster community • On Base Network</p>
                        <div className="flex gap-4 justify-center mt-2">
                            <a href="#" className="hover:text-gray-300 transition-colors">GitHub</a>
                            <a href="#" className="hover:text-gray-300 transition-colors">Docs</a>
                            <a href="#" className="hover:text-gray-300 transition-colors">Twitter</a>
                        </div>
                    </div>
                </footer>
            </main>
        </ToastProvider>
    );
}
