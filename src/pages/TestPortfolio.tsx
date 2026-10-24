import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Portfolio from './Portfolio'
import InvestmentPortfolio, { SpotlightCard } from './InvestmentPortfolio'
import { Card } from '@mui/material'
import { ArrowRight, Menu, X, Wallet, PieChart, TrendingUp, LayoutDashboard, Settings } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export default function TestPortfolio() {
    const [activeView, setActiveView] = useState<'crypto' | 'investment'>('crypto')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const location = useLocation()

    // --- DESKTOP TILES (Hidden on Mobile) ---
    const CryptoToggleTile = (
        <div className="hidden sm:block h-full">
            <Card className="card-base cursor-pointer hover:bg-white/5 active:scale-95 transition-all h-full flex flex-col justify-center items-center gap-4 group relative overflow-hidden" onClick={() => setActiveView('investment')}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-center z-10">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <ArrowRight className="text-white group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">Investments</h3>
                    <p className="text-sm text-slate-400">View growth portfolio</p>
                </div>
            </Card>
        </div>
    )

    const InvestmentToggleTile = (
        <div className="hidden sm:block h-full">
            <SpotlightCard className="p-6 cursor-pointer hover:bg-white/5 active:scale-95 transition-all h-full flex flex-col justify-center items-center gap-4 group" onClick={() => setActiveView('crypto')}>
                <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <ArrowRight className="text-white group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">Crypto Vault</h3>
                    <p className="text-sm text-slate-400">Manage liquid assets</p>
                </div>
            </SpotlightCard>
        </div>
    )

    // --- MOBILE HEADER (App Bar) ---
    const MobileHeader = () => (
        <div className="sm:hidden fixed top-0 left-0 right-0 z-[90] h-20 px-4 flex items-end pb-3 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent backdrop-blur-sm pointer-events-auto">
            <div className="w-full flex items-center justify-between">

                {/* 1. View Switcher (Segmented Control) */}
                <div className="bg-white/5 p-1 rounded-xl flex items-center border border-white/5 backdrop-blur-md">
                    <button
                        onClick={() => setActiveView('crypto')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeView === 'crypto'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Crypto
                    </button>
                    <button
                        onClick={() => setActiveView('investment')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeView === 'investment'
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Invest
                    </button>
                </div>

                {/* 2. Profile Button (Triggers Menu) */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMobileMenuOpen(true)}
                    className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 border border-white/20 shadow-lg flex items-center justify-center text-white font-bold text-[10px]"
                >
                    JS
                </motion.button>
            </div>

            {/* Mobile Menu Overlay (Same as before) */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110]"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-[280px] bg-[#0f1230] border-l border-white/10 z-[120] p-6 shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-bold text-white tracking-widest font-metal">MENU</h2>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl mb-8 border border-white/5">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                    JS
                                </div>
                                <div>
                                    <div className="text-white font-bold text-sm">John Smith</div>
                                    <div className="text-xs text-green-400">Pro Member</div>
                                </div>
                            </div>

                            <nav className="space-y-2">
                                {[
                                    { to: '/app/overview', icon: <LayoutDashboard size={20} />, label: 'Overview' },
                                    { to: '/app/wallets', icon: <Wallet size={20} />, label: 'Wallets' },
                                    { to: '/app/test-portfolio', icon: <PieChart size={20} />, label: 'Portfolio' },
                                    { to: '/app/investment', icon: <TrendingUp size={20} />, label: 'Invest' },
                                    { to: '/settings', icon: <Settings size={20} />, label: 'Settings' },
                                ].map(item => (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${location.pathname === item.to
                                            ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                                            : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        {item.icon}
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                ))}
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )

    return (
        <div className="h-screen w-full overflow-hidden bg-[#0a0a0a] relative">
            <MobileHeader />

            <AnimatePresence mode="wait">
                {activeView === 'crypto' ? (
                    <motion.div
                        key="crypto-view"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        // Mobile: Top margin 20 (80px) to clear header, height reduced to fit
                        // Desktop (sm): No margin, full height
                        className="w-full h-[calc(100%-5rem)] mt-20 sm:mt-0 sm:h-full overflow-hidden"
                    >
                        <div className="h-full">
                            <Portfolio extraTile={CryptoToggleTile} />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="investment-view"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-[calc(100%-5rem)] mt-20 sm:mt-0 sm:h-full overflow-hidden" // Same fix here
                    >
                        <div className="h-full">
                            <InvestmentPortfolio extraTile={InvestmentToggleTile} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
