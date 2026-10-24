import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, PieChart, DollarSign, Activity, Plus, MoreHorizontal, ArrowUpRight, Calendar, Eye, EyeOff } from 'lucide-react'
import { containerStagger, fadeInUp, speedometerWoosh } from '../utils/animations'
import { formatUSD } from '../utils/format'
import { usePortfolioStore, Investment } from '../state/portfolioStore'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import InvestmentChart from '../components/InvestmentChart/InvestmentChart'
import InvestmentReview from '../components/Investment/InvestmentReview'
import { useUIStore } from '../state/uiStore'

// --- 1. NEW COMPONENT: SpotlightCard (The Visual 1%) ---
// Tracks mouse position to create a "flashlight" glow effect on the border
export const SpotlightCard = ({ children, className = "", onClick }: any) => {
    const divRef = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [opacity, setOpacity] = useState(0)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return
        const rect = divRef.current.getBoundingClientRect()
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }

    return (
        <motion.div
            variants={fadeInUp}
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setOpacity(1)}
            onMouseLeave={() => setOpacity(0)}
            onClick={onClick}
            className={`card-base relative overflow-hidden border border-white/5 rounded-2xl bg-[#1f1f22] group ${className}`}
        >
            {/* The Moving Glow */}
            <div
                className="pointer-events-none absolute -inset-px transition duration-300 z-0"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.06), transparent 40%)`,
                }}
            />
            {/* Content sits above glow */}
            <div className="relative z-10 h-full">{children}</div>
        </motion.div>
    )
}

export default function InvestmentPortfolio({ extraTile }: { extraTile?: React.ReactNode }) {
    const navigate = useNavigate()
    const { investments, getTotalInvested, getTotalProjectedYield, removeInvestment, updateInvestment } = usePortfolioStore()
    const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null)
    const { showCinematicIntro, showGradients } = useUIStore()

    // --- 2. NEW STATE: Yield Cycle & Privacy (The Functional 1%) ---
    // 'Year' (Default) -> 'Month' -> 'Day'
    const [yieldMode, setYieldMode] = useState<'year' | 'month' | 'day'>('year')
    const [hideBalance, setHideBalance] = useState(false)

    // Animation State
    const [hoveredAsset, setHoveredAsset] = useState<string | null>(null)
    const [introAsset, setIntroAsset] = useState<string | null>(null)
    const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const totalValue = getTotalInvested()
    const totalYieldYearly = getTotalProjectedYield()

    // Calculate Yield based on Mode
    const displayYield = useMemo(() => {
        if (yieldMode === 'month') return totalYieldYearly / 12
        if (yieldMode === 'day') return totalYieldYearly / 365
        return totalYieldYearly
    }, [totalYieldYearly, yieldMode])

    const averageApy = investments.length > 0
        ? investments.reduce((acc, curr) => acc + curr.apy, 0) / investments.length
        : 0

    // --- Chart Data ---
    const chartAllocations = useMemo(() => {
        const grouped = investments.reduce((acc, curr) => {
            const existing = acc.find(i => i.symbol === curr.name)
            if (existing) {
                existing.value += curr.amount
            } else {
                let color = '#60a5fa'
                if (curr.type === 'Staking') color = '#6366f1'
                if (curr.type === 'Liquidity') color = '#ec4899'
                if (curr.type === 'DeFi') color = '#f59e0b'
                acc.push({ symbol: curr.name, value: curr.amount, color })
            }
            return acc
        }, [] as { symbol: string; value: number; color: string }[])

        return grouped.map(d => ({
            symbol: d.symbol,
            percent: totalValue > 0 ? +(d.value / totalValue * 100).toFixed(1) : 0,
            color: d.color
        })).sort((a, b) => b.percent - a.percent)
    }, [investments, totalValue])

    // --- Interaction ---
    const handleHover = useCallback((symbol: string | null) => {
        if (hoverTimer.current) {
            clearTimeout(hoverTimer.current)
            hoverTimer.current = null
        }
        if (symbol) setHoveredAsset(symbol)
        else hoverTimer.current = setTimeout(() => setHoveredAsset(null), 200)
    }, [])

    // --- Cinematic Effect ---
    useEffect(() => {
        if (!showCinematicIntro || chartAllocations.length === 0) return
        const symbols = chartAllocations.map(t => t.symbol)
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
            }, 250)
        }, 500)
        return () => {
            clearTimeout(startTimer)
            if (interval) clearInterval(interval)
        }
    }, [showCinematicIntro, chartAllocations.length])

    return (
        <div className="space-y-6 text-coolgray dark:text-slate-300 h-full overflow-y-auto snap-y snap-mandatory pb-8 no-scrollbar">
            {/* --- HEADER --- */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2"
            >
                <div className="group">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Investment Portfolio</h1>
                        {/* Privacy Toggle (The other 1% feature) */}
                        <button
                            onClick={() => setHideBalance(!hideBalance)}
                            className="p-2 rounded-full hover:bg-white/10 text-slate-500 hover:text-white transition-colors mb-2"
                            title="Toggle Privacy Mode"
                        >
                            {hideBalance ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    <p className="text-slate-400 font-medium">Manage your high-yield DeFi strategies and liquidity positions.</p>
                </div>
                <Link
                    to="/app/investment"
                    className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl transition-all font-bold shadow-lg shadow-blue-900/20 active:scale-95"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                    New Strategy
                </Link>
            </motion.div>

            {/* --- STATS GRID (With Spotlight & Yield Logic) --- */}
            {investments.length > 0 && (
                <motion.div
                    variants={containerStagger}
                    initial="hidden"
                    animate="visible"
                    className={`grid grid-cols-1 gap-6 ${extraTile ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'}`}
                >
                    {/* 1. Total Invested */}
                    <SpotlightCard className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500/10 text-blue-400">
                                <DollarSign size={20} />
                            </div>
                            <span className="text-slate-400 font-medium">Total Invested</span>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1 tracking-tight">
                            {hideBalance ? '••••••••' : formatUSD(totalValue)}
                        </div>
                        <div className="text-sm text-slate-500 font-medium">Active Capital Deployed</div>
                    </SpotlightCard>

                    {/* 2. Projected Yield (CLICKABLE!) */}
                    <SpotlightCard
                        className="p-6 cursor-pointer hover:border-green-500/30 transition-colors"
                        onClick={() => setYieldMode(prev => prev === 'year' ? 'month' : prev === 'month' ? 'day' : 'year')}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-500/10 text-green-400">
                                    {/* Icon Changes based on mode */}
                                    {yieldMode === 'year' ? <TrendingUp size={20} /> : <Calendar size={20} />}
                                </div>
                                <span className="text-slate-400 font-medium">
                                    {yieldMode === 'year' ? 'Yearly Yield' : yieldMode === 'month' ? 'Monthly Yield' : 'Daily Yield'}
                                </span>
                            </div>
                            {/* Tiny indicator tag */}
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-500/20 text-green-400 uppercase tracking-wider">
                                Click Me
                            </span>
                        </div>

                        <motion.div
                            key={yieldMode} // Animate number switch
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl font-bold text-white mb-1 tracking-tight"
                        >
                            {hideBalance ? '••••••••' : formatUSD(displayYield)}
                        </motion.div>
                        <div className="text-sm text-slate-500 font-medium">
                            {yieldMode === 'year' ? 'Annualized Return' : yieldMode === 'month' ? 'Est. Monthly Income' : 'Est. Daily Income'}
                        </div>
                    </SpotlightCard>

                    {/* 3. Avg APY */}
                    <SpotlightCard className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-500/10 text-purple-400">
                                <Activity size={20} />
                            </div>
                            <span className="text-slate-400 font-medium">Avg. APY</span>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1 tracking-tight">
                            {averageApy.toFixed(2)}%
                        </div>
                        <div className="text-sm text-slate-500 font-medium">Weighted Portfolio Average</div>
                    </SpotlightCard>

                    {/* 4. Extra Tile (Toggle) */}
                    {extraTile}
                </motion.div>
            )}

            {/* --- MAIN CONTENT --- */}
            {investments.length === 0 ? (
                /* EMPTY STATE */
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="card-base p-12 flex flex-col items-center justify-center text-center min-h-[400px] border border-dashed border-white/10"
                >
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <PieChart size={48} className="text-slate-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Portfolio Empty</h2>
                    <p className="text-slate-400 max-w-md mb-8">
                        Your capital is sleeping. Deploy assets into staking or liquidity pools to generate yield.
                    </p>
                    <Link to="/app/investment" className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-2">
                        Browse Opportunities <ArrowUpRight size={16} />
                    </Link>
                </motion.div>
            ) : (
                /* SPLIT VIEW (Restored & Fixed) */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* LEFT: CHART (Fixed sizing) */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-5 lg:sticky lg:top-6"
                    >
                        <div className="card-base p-6 bg-[#1f1f22] border border-white/5 rounded-2xl !overflow-visible">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-bold text-white">Allocation</h3>
                                <span className="text-xs font-bold px-2 py-1 rounded bg-white/5 text-slate-400">BY ASSET</span>
                            </div>

                            {/* RESTORED: Robust Aspect Ratio Container */}
                            <div className="aspect-square w-full max-w-[380px] mx-auto relative flex items-center justify-center !overflow-visible z-10">
                                <motion.div
                                    className="w-full h-full"
                                    variants={showCinematicIntro ? speedometerWoosh : undefined}
                                    initial="hidden"
                                    animate="visible"
                                    key={showCinematicIntro ? 'cinematic' : 'standard'}
                                >
                                    <InvestmentChart
                                        data={chartAllocations}
                                        activeSymbol={introAsset || hoveredAsset || (selectedInvestment?.name ?? null)}
                                        onHover={handleHover}
                                    />
                                </motion.div>

                                {/* The "Donut Hole" Stats (Visible when nothing hovered) */}
                                {!hoveredAsset && !introAsset && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Total</span>
                                        <span className="text-1xl font-bold text-white">{hideBalance ? '••••' : formatUSD(totalValue)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Improved Legend Layout */}
                            <div className="mt-8 flex flex-wrap gap-3 justify-center">
                                {chartAllocations.slice(0, 4).map(item => (
                                    <div
                                        key={item.symbol}
                                        className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/10"
                                        onMouseEnter={() => handleHover(item.symbol)}
                                        onMouseLeave={() => handleHover(null)}
                                    >
                                        <span className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px] shadow-current transition-transform group-hover:scale-110" style={{ backgroundColor: item.color, color: item.color }} />
                                        <span className="font-medium">{item.symbol}</span>
                                        <span className="text-white font-bold bg-white/5 px-1.5 py-0.5 rounded ml-1">{item.percent}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT: LIST */}
                    <motion.div
                        className="lg:col-span-7 space-y-4"
                        variants={containerStagger}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="flex items-center justify-between px-2 mb-2">
                            <h3 className="text-lg font-bold text-white">Active Positions</h3>
                            <span className="text-sm text-slate-500">{investments.length} Strategies</span>
                        </div>

                        <AnimatePresence mode='popLayout'>
                            {investments.map((item, i) => {
                                const color = item.type === 'Staking' ? '#6366f1' : item.type === 'DeFi' ? '#f59e0b' : item.type === 'Liquidity' ? '#ec4899' : '#60a5fa'

                                const isActive = hoveredAsset === item.name || selectedInvestment?.id === item.id
                                const backgroundStyle = showGradients ? {
                                    background: `linear-gradient(90deg, ${color}25 0%, transparent 40%, transparent 60%, ${color}25 100%)`,
                                    borderLeft: `4px solid ${color}`
                                } : { borderLeft: `4px solid ${color}` }

                                return (
                                    <motion.div
                                        key={item.id}
                                        variants={fadeInUp}
                                        layout
                                        onClick={() => setSelectedInvestment(prev => prev?.id === item.id ? null : item)}
                                        onMouseEnter={() => handleHover(item.name)}
                                        onMouseLeave={() => handleHover(null)}
                                        style={backgroundStyle}
                                        className={`
                                                card-base p-4 flex flex-col sm:flex-row items-center gap-4 transition-all group cursor-pointer border overflow-hidden rounded-xl bg-[#1f1f22]
                                                ${isActive ? 'bg-white/10 ring-1 ring-white/20 scale-[1.01]' : 'hover:bg-white/5 border-transparent'}
                                            `}
                                    >
                                        <div className="flex items-center gap-4 w-full sm:w-auto sm:flex-1">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold transition-transform duration-300 group-hover:scale-110 shadow-lg`}
                                                style={{ backgroundColor: `${color}20`, color: color }}>
                                                {item.name.charAt(0)}
                                            </div>

                                            <div>
                                                <h3 className="font-bold text-white text-lg">{item.name}</h3>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-white/10 text-slate-300">{item.type}</span>
                                                    <span className="text-xs font-medium text-green-400 flex items-center gap-1">
                                                        <TrendingUp size={12} /> {item.apy}% APY
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full sm:w-auto text-right flex items-center justify-between sm:block border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0 mt-2 sm:mt-0">
                                            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5 sm:hidden">Principal</div>
                                            <div>
                                                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5 hidden sm:block">Principal</div>
                                                <div className="font-mono font-bold text-white text-lg">{hideBalance ? '••••••' : formatUSD(item.amount)}</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </motion.div>
                </div>
            )}


            {/* --- MODAL (Fixed Overlay - Portalled to Body to escape Layout Transforms) --- */}
            {createPortal(
                <AnimatePresence>
                    {selectedInvestment && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            // Z-index boosted to 1300 to be above Sidebar (z-1100)
                            className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                            onClick={() => setSelectedInvestment(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.95, y: 20 }}
                                onClick={e => e.stopPropagation()}
                                className="w-full max-w-5xl max-h-[85vh] overflow-y-auto no-scrollbar bg-[#0f1230] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative"
                            >
                                <button
                                    onClick={() => setSelectedInvestment(null)}
                                    className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors z-50"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </button>
                                <InvestmentReview
                                    selectedOption={selectedInvestment}
                                    amount={selectedInvestment.amount}
                                    isViewMode={true}
                                    onBack={() => setSelectedInvestment(null)}
                                    onConfirm={() => setSelectedInvestment(null)}
                                    onBuyMore={() => navigate('/app/invest', { state: { sourceWallet: 'Investment Wallet' } })}
                                    onSell={(amountToSell) => {
                                        if (amountToSell && amountToSell < selectedInvestment.amount) {
                                            updateInvestment(selectedInvestment.id, { amount: selectedInvestment.amount - amountToSell })
                                        } else {
                                            removeInvestment(selectedInvestment.id)
                                        }
                                        setSelectedInvestment(null)
                                    }}
                                />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div >
    )
}