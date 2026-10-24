import { useMemo, useEffect, useState, useCallback, useRef } from 'react'
import { Card, CardContent, Typography, Chip, Avatar, Divider, useTheme, useMediaQuery } from '@mui/material'
import InvestmentChart from '../components/InvestmentChart/InvestmentChart'
import TokenCard from '../components/TokenCard/TokenCard'
import { RollingNumber } from '../components/RollingNumber'
import { mockEthernet } from '../data/ethernet.js'
import { cryptoStore, type CryptoSymbol } from '../state/cryptoStore'
import { cryptoMeta } from '../state/cryptoMeta'
import { prices } from '../state/prices'
import { transactionsStore, type Transaction } from '../state/transactions'
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion'
import { useUIStore } from '../state/uiStore'
import { speedometerWoosh, thanosReverse, containerStagger, fadeInUp } from '../utils/animations'
import PortfolioCrypto from './portfolio-crypto'
import CryptoPortfolio from '../components/CryptoPortfolio/CryptoPortfolio'



import { Link } from 'react-router-dom'
import { Wallet, ArrowRight } from 'lucide-react'

function PortfolioOriginal({ extraTile }: { extraTile?: React.ReactNode }) {
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
    const [balances, setBalances] = useState(cryptoStore.getAll())
    const [expandedAsset, setExpandedAsset] = useState<string | null>(null)
    const [introAsset, setIntroAsset] = useState<string | null>(null) // For speedometer effect

    // 1. Global UI Store
    const { setHoveredAsset, hoveredAsset, showCinematicIntro } = useUIStore()

    // 2. Mobile & Hover Logic Setup
    const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'))

    // 3. Smart Hover Handler
    // 3. Smart Hover Handler (Sticky: Instant On, Delayed Off)
    const handleHover = useCallback((symbol: string | null) => {
        if (isMobile) return

        if (hoverTimer.current) {
            clearTimeout(hoverTimer.current)
            hoverTimer.current = null
        }

        if (symbol) {
            // Case A: Moving to a new coin (Instant)
            setHoveredAsset(symbol)
        } else {
            // Case B: Moving to empty space (Delayed Clear to prevent jitter)
            hoverTimer.current = setTimeout(() => {
                setHoveredAsset(null)
            }, 200) // 200ms grace period
        }
    }, [isMobile, setHoveredAsset])

    // Cleanup timer
    useEffect(() => {
        return () => {
            if (hoverTimer.current) clearTimeout(hoverTimer.current)
        }
    }, [])

    // Subscribe to transaction updates
    useEffect(() => {
        setRecentTransactions(transactionsStore.getRecent(5))

        const unsubscribe = transactionsStore.subscribe((transactions) => {
            setRecentTransactions(transactions.slice(0, 5))
        })

        return unsubscribe
    }, [])

    // Subscribe to crypto balance updates
    useEffect(() => {
        setBalances(cryptoStore.getAll())

        const unsubscribe = cryptoStore.subscribeToBalances((newBalances) => {
            setBalances(newBalances)
        })

        return unsubscribe
    }, [])

    const portfolio = [
        { symbol: 'BTC', name: 'Bitcoin', logo: '', qty: balances.BTC },
        { symbol: 'ETH', name: 'Ethereum', logo: '', qty: balances.ETH },
        { symbol: 'USDT', name: 'Tether', logo: '', qty: balances.USDT },
        { symbol: 'SOL', name: 'Solana', logo: '', qty: balances.SOL },
        { symbol: 'BAT', name: 'Basic Attention Token', logo: '', qty: balances.BAT },
        { symbol: 'SEPOLIA_ETH', name: 'Sepolia ETH', logo: '', qty: balances.SEPOLIA_ETH },
    ] as const

    const assets = portfolio.map(p => {
        const data = prices.get(p.symbol as CryptoSymbol)
        const usd = data.price
        const valueUsd = Math.max(0, p.qty * usd)

        return {
            symbol: p.symbol,
            name: cryptoMeta[p.symbol as CryptoSymbol]?.name || p.name,
            logo: cryptoMeta[p.symbol as CryptoSymbol]?.icon || p.logo,
            qty: p.qty,
            valueUsd,
            percentOfTreasury: 0,
            change24hPercent: data.change24h,
            price: usd,
        }
    })

    const totalTreasuryValue = assets.reduce((acc, a) => acc + a.valueUsd, 0)
    const tokenAllocations = assets
        .filter(a => a.valueUsd > 0)
        .map(a => ({ symbol: a.symbol, percent: totalTreasuryValue ? +(a.valueUsd / totalTreasuryValue * 100).toFixed(2) : 0, color: cryptoMeta[a.symbol as CryptoSymbol]?.color || '#60a5fa' }))

    // Calculate active wallets (cryptocurrencies with balance > 0)
    const activeWallets = Object.values(balances).filter(balance => balance > 0).length

    const totalChange = useMemo(() => {
        // Generate extreme volatility for total portfolio change
        const baseVolatility = 0.3 // High base volatility
        const cryptoVolatility = 0.15 // Additional crypto-specific volatility
        const randomFactor = Math.random() - 0.5
        const volatility = baseVolatility + cryptoVolatility
        const dailyChange = randomFactor * volatility * 12 // 12x multiplier for extreme swings

        // Add occasional extreme spikes (crypto-style)
        const spikeChance = Math.random()
        let spikeMultiplier = 1
        if (spikeChance > 0.95) {
            spikeMultiplier = 4 // 400% spike
        } else if (spikeChance < 0.05) {
            spikeMultiplier = 0.2 // 80% crash
        }

        return (dailyChange * spikeMultiplier) * 100 // Convert to percentage
    }, [])

    // --- Cinematic: Speedometer Sweep Effect ---
    useEffect(() => {
        if (!showCinematicIntro || tokenAllocations.length === 0) return

        const symbols = tokenAllocations.map(t => t.symbol)
        const totalSteps = symbols.length // Single, elegant pass
        let interval: ReturnType<typeof setInterval>

        // Delay start to match chart entrance (0.8s)
        const startTimer = setTimeout(() => {
            let index = 0
            // Sweep: Gentle, elegant presentation (250ms per item)
            interval = setInterval(() => {
                setIntroAsset(symbols[index])
                index++

                if (index >= totalSteps) {
                    clearInterval(interval)
                    setTimeout(() => setIntroAsset(null), 300) // Smooth exit
                }
            }, 250)
        }, 800)

        return () => {
            clearTimeout(startTimer)
            if (interval) clearInterval(interval)
        }
    }, [showCinematicIntro, tokenAllocations.length])

    return (
        <motion.div
            className="space-y-6 text-coolgray dark:text-slate-300 h-full overflow-y-auto snap-y snap-mandatory pb-8 no-scrollbar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            {/* --- HEADER --- */}
            <motion.section
                className="snap-start scroll-mt-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Crypto Vault</h1>
                        <p className="text-slate-400 font-medium">Real-time overview of your liquid assets and blockchain transactions.</p>
                    </div>
                    <Link
                        to="/app/wallets"
                        className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl transition-all font-bold shadow-lg shadow-blue-900/20 active:scale-95"
                    >
                        <Wallet size={20} className="group-hover:-rotate-12 transition-transform" />
                        Manage Wallets
                    </Link>
                </div>
            </motion.section>

            <motion.section
                className="snap-start scroll-mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                <div className={`grid grid-cols-1 gap-4 ${extraTile ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'}`}>
                    <Card className="card-base">
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Typography className="text-sm text-slate-300">Total Treasury Value</Typography>
                                    <Typography
                                        className="text-2xl md:text-4xl text-white font-bold mt-1"
                                        style={{ textShadow: '0 0 12px rgba(250,204,21,0.25)' }}
                                    >
                                        {showCinematicIntro ? (
                                            <RollingNumber
                                                value={totalTreasuryValue}
                                                prefix="$"
                                                delay={0.5} // Wait for cards
                                            />
                                        ) : (
                                            `$${totalTreasuryValue.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`
                                        )}
                                    </Typography>
                                </div>
                                <Chip label={(totalChange >= 0 ? '+' : '') + totalChange.toFixed(2) + ' 24h'} color={totalChange >= 0 ? 'success' : 'error'} className="rounded-xl scale-90 md:scale-100 origin-right" size="small" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="card-base">
                        <CardContent>
                            <Typography className="text-sm text-slate-300">Active Wallets</Typography>
                            <div className="flex items-end gap-2 mt-1">
                                <Typography className="text-3xl md:text-4xl text-white font-bold">{activeWallets}</Typography>
                                <Typography className="text-xs text-slate-400">tracked</Typography>
                            </div>
                            <div className="flex -space-x-2 mt-3">
                                {assets.filter(a => a.valueUsd > 0).slice(0, 5).map((asset) => (
                                    <Avatar key={asset.symbol} src={asset.logo} sx={{ width: 28, height: 28 }} className="ring-2 ring-white">
                                        {!asset.logo && asset.symbol.charAt(0)}
                                    </Avatar>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="card-base">
                        <CardContent>
                            <Typography className="text-sm text-slate-300">Lifetime Earnings</Typography>
                            <Typography className="text-3xl md:text-4xl text-white font-bold mt-1">$23.31</Typography>
                            <Typography className="text-xs text-slate-400">from investments</Typography>
                        </CardContent>
                    </Card>
                    {extraTile}
                </div>
            </motion.section>

            <motion.section
                className="snap-start scroll-mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0 h-auto">
                    {/* Chart & Legend Container - Expansive Version */}
                    {/* Chart & Legend Container - Expansive & Centered */}
                    <Card className="card-base min-w-0 h-auto">
                        {/* SAFETY NET: Clearing hover when leaving the main container area */}
                        <CardContent
                            className="flex flex-col h-full"
                            onMouseLeave={() => handleHover(null)}
                        >
                            <div className="flex items-center justify-between mb-8">
                                <Typography variant="h6" className="text-white">Portfolio Allocation</Typography>
                                <div className="flex items-center gap-2">

                                    <span className="chip" style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}>Donut</span>
                                </div>
                            </div>

                            {/* Main Content: Flex-row on desktop, Centered Vertically */}
                            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">

                                {/* Interactive Chart - Cinematic Wrapper */}
                                <motion.div
                                    className="w-full lg:w-1/2 max-w-[500px] aspect-square relative flex items-center justify-center"
                                    variants={showCinematicIntro ? speedometerWoosh : undefined}
                                    initial="hidden"
                                    animate="visible"
                                    key={showCinematicIntro ? 'cinematic' : 'standard'} // Remount on toggle
                                >
                                    <InvestmentChart
                                        data={tokenAllocations}
                                        activeSymbol={introAsset || hoveredAsset || expandedAsset}
                                        onHover={handleHover}
                                    />
                                </motion.div>

                                {/* Interactive Legend - Vertically Centered */}
                                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                                    <div className="space-y-3">
                                        {tokenAllocations.map(a => {
                                            const activeItem = introAsset || hoveredAsset || expandedAsset
                                            const isActive = activeItem === a.symbol
                                            const isDimmed = activeItem && !isActive

                                            return (
                                                <motion.div
                                                    key={a.symbol}
                                                    layout
                                                    // Handlers
                                                    onMouseEnter={() => handleHover(a.symbol)}
                                                    // Note: Parent onMouseLeave handles the "exit" safety, 
                                                    // but we keep this for specific item interactions if needed.

                                                    // Animation States
                                                    initial={{ opacity: 1 }}
                                                    animate={{
                                                        opacity: isDimmed ? 0.3 : 1,
                                                        scale: isActive ? 1.05 : 1,
                                                        x: isActive ? 10 : 0 // Slide right slightly
                                                    }}
                                                    transition={{ duration: 0.2 }}
                                                    className={`flex items-center justify-between group cursor-pointer p-3 rounded-xl transition-all ${isActive ? 'bg-white/10 shadow-lg ring-1 ring-white/20' : 'hover:bg-white/5'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-4 min-w-0">
                                                        <span className="w-4 h-4 rounded-full ring-2 ring-white/10 flex-shrink-0 shadow-sm" style={{ backgroundColor: a.color }} />
                                                        <span className="text-lg font-medium text-slate-300 group-hover:text-white transition-colors truncate" title={a.symbol}>
                                                            {a.symbol}
                                                        </span>
                                                    </div>
                                                    <span className="text-lg font-bold text-white tabular-nums flex-shrink-0">{a.percent}%</span>

                                                </motion.div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Asset List Section (Scrollable) */}
                    <div className="flex flex-col h-full overflow-hidden">
                        {/* Header for list could go here */}
                        <motion.div
                            className="overflow-y-auto custom-scrollbar pr-2 flex-1 h-full max-h-[500px] pb-12 overscroll-contain"
                            variants={containerStagger}
                            initial="hidden"
                            animate="visible"
                            key={showCinematicIntro ? 'cinematic-list' : 'standard-list'} // Force remount for stagger
                        >
                            {assets.filter(a => a.valueUsd > 0).map(asset => (
                                <motion.div
                                    key={asset.symbol}
                                    variants={showCinematicIntro ? thanosReverse : fadeInUp}
                                >
                                    <TokenCard
                                        asset={asset}
                                        isExpanded={expandedAsset === asset.symbol}
                                        onToggle={() => setExpandedAsset(prev => prev === asset.symbol ? null : asset.symbol)}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            <motion.section
                className="snap-start scroll-mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                <Card className="card-base">
                    <CardContent>
                        <div className="flex items-center justify-between mb-3">
                            <Typography variant="h6" className="text-white">Recent Transactions</Typography>
                            <div className="text-right">
                                <div className="text-sm text-slate-300">24h Transactions</div>
                                <div className="text-lg text-white font-bold">{transactionsStore.getAll().length}</div>
                            </div>
                        </div>
                        <Divider className="my-3" />
                        <div className="space-y-3">
                            {recentTransactions.length === 0 ? (
                                <div className="text-center text-slate-400 py-4">No transactions yet</div>
                            ) : (
                                recentTransactions.map((tx) => (
                                    <div key={tx.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar sx={{ width: 32, height: 32 }}>
                                                {tx.coin.charAt(0)}
                                            </Avatar>
                                            <div>
                                                <div className="text-sm text-white font-medium">{tx.type} {tx.coin}</div>
                                                <div className="text-xs text-slate-400">{tx.recipient}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-white font-medium">{tx.qty} {tx.coin}</div>
                                            <div className="text-xs text-slate-400">{tx.network}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.section>

        </motion.div >
    )
}

export default function Portfolio({ extraTile }: { extraTile?: React.ReactNode }) {
    const [view, setView] = useState<'v1' | 'v2' | 'v3'>('v1')

    return (
        <div className="relative h-full w-full">
            {view === 'v1' && <PortfolioOriginal extraTile={extraTile} />}
            {view === 'v2' && <PortfolioCrypto />}
            {view === 'v3' && <CryptoPortfolio />}

            {/* Floating Toggle Button */}
            <div className="fixed bottom-6 right-6 z-50 flex gap-2 p-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-full">
                <button
                    onClick={() => setView('v1')}
                    className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${view === 'v1' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    Standard
                </button>
                <button
                    onClick={() => setView('v2')}
                    className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${view === 'v2' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    Crypto
                </button>
                <button
                    onClick={() => setView('v3')}
                    className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${view === 'v3' ? 'bg-green-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    Manager
                </button>
            </div>
        </div>
    )
}