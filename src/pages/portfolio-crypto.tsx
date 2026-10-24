import { useMemo, useEffect, useState, useCallback, useRef } from 'react'
import { Card, CardContent, Typography, Avatar, Button, IconButton } from '@mui/material'
import InvestmentChart from '../components/InvestmentChart/InvestmentChart'
import TokenCard from '../components/TokenCard/TokenCard'
import { RollingNumber } from '../components/RollingNumber'
import { cryptoStore, type CryptoSymbol } from '../state/cryptoStore'
import { cryptoMeta } from '../state/cryptoMeta'
import { prices } from '../state/prices'
import { transactionsStore, type Transaction } from '../state/transactions'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '../state/uiStore'
import { speedometerWoosh, thanosReverse, containerStagger, fadeInUp } from '../utils/animations'

// --- ICONS ---
const TrendUpIcon = ({ className }: { className?: string }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
)
const TrendDownIcon = ({ className }: { className?: string }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>
)
const ArrowUpRight = ({ className }: { className?: string }) => (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
)
const ArrowDownLeft = ({ className }: { className?: string }) => (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="17" y1="7" x2="7" y2="17"></line><polyline points="17 17 7 17 7 7"></polyline></svg>
)
const WalletIcon = ({ className }: { className?: string }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" /><path d="M4 6v12c0 1.1.9 2 2 2h14v-4" /><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h2v-4Z" /></svg>
)

// --- HELPERS ---
const StatCard = ({ label, value, subValue, icon: Icon, trend }: any) => (
    <div className="card-base p-5 rounded-2xl bg-[#1f1f22] border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
            {Icon && <Icon className="w-16 h-16 text-white" />}
        </div>
        <div className="relative z-10">
            <Typography className="text-sm font-medium text-slate-400 mb-1">{label}</Typography>
            <div className="flex items-baseline gap-2">
                <Typography variant="h4" className="text-white font-bold tracking-tight shadow-glow">
                    {value}
                </Typography>
            </div>
            <div className="flex items-center gap-2 mt-2">
                {trend && (
                    <span className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded ${trend >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {trend >= 0 ? '+' : ''}{trend}%
                    </span>
                )}
                <Typography className="text-xs text-slate-500 font-medium">{subValue}</Typography>
            </div>
        </div>
    </div>
)

export default function Portfolio() {
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
    const [balances, setBalances] = useState(cryptoStore.getAll())
    const [expandedAsset, setExpandedAsset] = useState<string | null>(null)
    const [introAsset, setIntroAsset] = useState<string | null>(null)

    // Global Store
    const { setHoveredAsset, hoveredAsset, showCinematicIntro } = useUIStore()
    const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    // --- Hover Logic ---
    const handleHover = useCallback((symbol: string | null) => {
        if (hoverTimer.current) {
            clearTimeout(hoverTimer.current)
            hoverTimer.current = null
        }
        if (symbol) {
            setHoveredAsset(symbol)
        } else {
            hoverTimer.current = setTimeout(() => {
                setHoveredAsset(null)
            }, 200)
        }
    }, [setHoveredAsset])

    // --- Data Subscriptions ---
    useEffect(() => {
        setRecentTransactions(transactionsStore.getRecent(5))
        return transactionsStore.subscribe((transactions) => setRecentTransactions(transactions.slice(0, 5)))
    }, [])

    useEffect(() => {
        setBalances(cryptoStore.getAll())
        return cryptoStore.subscribeToBalances((newBalances) => setBalances(newBalances))
    }, [])

    // --- Data Prep ---
    const portfolio = useMemo(() => [
        { symbol: 'BTC', name: 'Bitcoin', logo: '', qty: balances.BTC },
        { symbol: 'ETH', name: 'Ethereum', logo: '', qty: balances.ETH },
        { symbol: 'USDT', name: 'Tether', logo: '', qty: balances.USDT },
        { symbol: 'SOL', name: 'Solana', logo: '', qty: balances.SOL },
        { symbol: 'BAT', name: 'Basic Attention Token', logo: '', qty: balances.BAT },
        { symbol: 'SEPOLIA_ETH', name: 'Sepolia ETH', logo: '', qty: balances.SEPOLIA_ETH },
    ], [balances])

    const assets = useMemo(() => portfolio.map(p => {
        const data = prices.get(p.symbol as CryptoSymbol)
        return {
            symbol: p.symbol,
            name: cryptoMeta[p.symbol as CryptoSymbol]?.name || p.name,
            logo: cryptoMeta[p.symbol as CryptoSymbol]?.icon || p.logo,
            qty: p.qty,
            valueUsd: Math.max(0, p.qty * data.price),
            percentOfTreasury: 0,
            change24hPercent: data.change24h,
            price: data.price,
        }
    }), [portfolio])

    const totalTreasuryValue = assets.reduce((acc, a) => acc + a.valueUsd, 0)
    const activeWallets = Object.values(balances).filter(balance => balance > 0).length

    // Sort assets by Value USD Descending
    const sortedAssets = useMemo(() => [...assets].sort((a, b) => b.valueUsd - a.valueUsd), [assets])

    const tokenAllocations = useMemo(() => sortedAssets
        .filter(a => a.valueUsd > 0)
        .map(a => ({
            symbol: a.symbol,
            percent: totalTreasuryValue ? +(a.valueUsd / totalTreasuryValue * 100).toFixed(2) : 0,
            color: cryptoMeta[a.symbol as CryptoSymbol]?.color || '#60a5fa'
        })), [sortedAssets, totalTreasuryValue])


    // --- Fake Volatility for Hero ---
    const totalChange = useMemo(() => (Math.random() - 0.4) * 2.5, [])

    // --- Cinematic Effect ---
    useEffect(() => {
        if (!showCinematicIntro || tokenAllocations.length === 0) return
        const symbols = tokenAllocations.map(t => t.symbol)
        let interval: ReturnType<typeof setInterval>
        const startTimer = setTimeout(() => {
            let index = 0
            interval = setInterval(() => {
                setIntroAsset(symbols[index])
                index++
                if (index >= symbols.length) {
                    clearInterval(interval)
                    setTimeout(() => setIntroAsset(null), 300)
                }
            }, 300)
        }, 800)
        return () => {
            clearTimeout(startTimer)
            if (interval) clearInterval(interval)
        }
    }, [showCinematicIntro, tokenAllocations.length])

    return (
        <motion.div
            className="h-[calc(100vh-48px)] overflow-y-auto overflow-x-hidden no-scrollbar pb-12 bg-[#131313]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 space-y-6">

                {/* --- 1. HERO STATS ROW (Bento Grid) --- */}
                <motion.section
                    variants={containerStagger}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    <motion.div variants={fadeInUp} className="lg:col-span-2">
                        <StatCard
                            label="Total Treasury Value"
                            value={showCinematicIntro ? <RollingNumber value={totalTreasuryValue} prefix="$" delay={0.5} /> : `$${totalTreasuryValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                            subValue="Global AUM"
                            trend={totalChange.toFixed(2)}
                            icon={totalChange >= 0 ? TrendUpIcon : TrendDownIcon}
                        />
                    </motion.div>
                    <motion.div variants={fadeInUp}>
                        <StatCard
                            label="Active Wallets"
                            value={activeWallets}
                            subValue="Tracked on-chain"
                            icon={WalletIcon}
                        />
                    </motion.div>
                    <motion.div variants={fadeInUp}>
                        <StatCard
                            label="Lifetime Earnings"
                            value="$12,402"
                            trend={12.5}
                            subValue="Realized Gains"
                            icon={TrendUpIcon}
                        />
                    </motion.div>
                </motion.section>

                {/* --- 2. MAIN SPLIT VIEW (Chart Left, Assets Right) --- */}
                <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

                    {/* LEFT: Sticky Chart & Allocation (4 Columns) */}
                    <motion.div
                        className="xl:col-span-4 xl:sticky xl:top-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card className="card-base bg-[#1f1f22] border-white/5 h-auto overflow-visible">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <Typography variant="h6" className="text-white font-bold">Allocation</Typography>
                                    <div className="px-3 py-1 rounded-full bg-white/5 text-xs font-bold text-slate-400 border border-white/5">Live</div>
                                </div>

                                {/* Chart */}
                                <div className="aspect-square relative flex items-center justify-center mb-6">
                                    <motion.div
                                        className="w-full h-full"
                                        variants={showCinematicIntro ? speedometerWoosh : undefined}
                                        initial="hidden"
                                        animate="visible"
                                        key={showCinematicIntro ? 'cine' : 'stat'}
                                    >
                                        <InvestmentChart
                                            data={tokenAllocations}
                                            activeSymbol={introAsset || hoveredAsset || expandedAsset}
                                            onHover={handleHover}
                                        />
                                    </motion.div>
                                </div>

                                {/* Mini Legend */}
                                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                    {tokenAllocations.map(t => (
                                        <div
                                            key={t.symbol}
                                            className={`flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer ${hoveredAsset === t.symbol ? 'bg-white/10' : 'hover:bg-white/5'}`}
                                            onMouseEnter={() => handleHover(t.symbol)}
                                            onMouseLeave={() => handleHover(null)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: t.color }} />
                                                <span className="text-sm text-slate-300 font-medium">{t.symbol}</span>
                                            </div>
                                            <span className="text-sm text-white font-bold">{t.percent}%</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* RIGHT: Scrollable Asset List (8 Columns) */}
                    <motion.div
                        className="xl:col-span-8 space-y-4"
                        variants={containerStagger}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-2 mb-2">
                            <Typography variant="h6" className="text-white font-bold">Your Assets</Typography>
                            {/* Filter/Sort buttons could go here */}
                        </div>

                        {/* Asset List */}
                        <div className="space-y-3 pb-4">
                            {sortedAssets.filter(a => a.valueUsd > 0).map((asset) => (
                                <motion.div key={asset.symbol} variants={showCinematicIntro ? thanosReverse : fadeInUp}>
                                    <TokenCard
                                        asset={asset}
                                        isExpanded={expandedAsset === asset.symbol}
                                        onToggle={() => setExpandedAsset(prev => prev === asset.symbol ? null : asset.symbol)}
                                    />
                                </motion.div>
                            ))}
                        </div>

                        {/* --- 3. TRANSACTIONS SECTION (Inline at bottom of list) --- */}
                        <motion.div
                            variants={fadeInUp}
                            className="mt-8 pt-6 border-t border-white/5"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <Typography variant="h6" className="text-white font-bold">Recent Activity</Typography>
                                <Button size="small" className="text-slate-400 hover:text-white normal-case">View All</Button>
                            </div>

                            <div className="bg-[#1f1f22] rounded-xl border border-white/5 overflow-hidden">
                                {recentTransactions.length === 0 ? (
                                    <div className="text-center text-slate-500 py-8 text-sm">No recent transactions</div>
                                ) : (
                                    recentTransactions.map((tx, idx) => {
                                        const isIn = tx.type === 'investment' || tx.type === 'receive';
                                        return (
                                            <div
                                                key={tx.id}
                                                className={`flex items-center justify-between p-4 transition-colors hover:bg-white/5 ${idx !== recentTransactions.length - 1 ? 'border-b border-white/5' : ''}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isIn ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                        {isIn ? <ArrowDownLeft /> : <ArrowUpRight />}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-white font-bold">{tx.type} {tx.coin}</div>
                                                        <div className="text-xs text-slate-500">{tx.date} • {tx.network}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-sm font-bold ${isIn ? 'text-green-400' : 'text-white'}`}>
                                                        {isIn ? '+' : '-'}{tx.qty} {tx.coin}
                                                    </div>
                                                    <div className="text-xs text-slate-500 capitalize">{tx.status}</div>
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </motion.div>

                    </motion.div>
                </section>
            </div>
        </motion.div>
    )
}