import { useMemo, useEffect, useRef } from 'react'
import { Typography, Avatar, Button } from '@mui/material'
import { motion, AnimatePresence, TargetAndTransition } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useUIStore } from '../../state/uiStore'
import { cryptoMeta, CryptoSymbol } from '../../state/cryptoMeta'

// --- Import from your animations file ---
import {
    accordionVariants,
    tapAnimation,
    getLiquidGradientStyle,
    liquidMovement
} from '../../utils/animations'

// --- 1. Icons (Internal Components) ---
const ChevronIcon = ({ className }: { className?: string }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9l6 6 6-6" />
    </svg>
)

const WalletIcon = ({ className }: { className?: string }) => (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
        <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
        <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h2v-4Z" />
    </svg>
)

const ChartIcon = ({ className }: { className?: string }) => (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="20" x2="12" y2="10" />
        <line x1="18" y1="20" x2="18" y2="4" />
        <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
)

// --- 2. Sparkline Component ---
const Sparkline = ({ color, isPositive, width = "100%", height = 60 }: { color: string, isPositive: boolean, width?: string | number, height?: number }) => {
    const points = useMemo(() => {
        const data = []
        let current = 50
        for (let i = 0; i < 30; i++) {
            current += (Math.random() - 0.5) * 15
            if (isPositive) current += 1; else current -= 1
            current = Math.max(10, Math.min(90, current))
            data.push(current)
        }
        return data
    }, [isPositive])

    const max = Math.max(...points)
    const min = Math.min(...points)
    const range = max - min || 1

    const polylinePoints = points.map((p, i) => {
        const x = (i / (points.length - 1)) * 100
        const y = height - ((p - min) / range) * height
        return `${x},${y}`
    }).join(' ')

    return (
        <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="overflow-visible w-full">
            <defs>
                <linearGradient id={`gradient-${color}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon points={`0,${height} ${polylinePoints} 100,${height}`} fill={`url(#gradient-${color})`} />
            <polyline points={polylinePoints} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

// --- 3. Types ---
export type Asset = {
    symbol: string
    name: string
    logo: string
    qty: number
    valueUsd: number
    percentOfTreasury: number
    change24hPercent: number
    price: number
}

interface TokenCardProps {
    asset: Asset
    isExpanded: boolean
    onToggle: () => void
}

// --- 4. Main Component ---
export default function TokenCard({ asset, isExpanded, onToggle }: TokenCardProps) {
    const navigate = useNavigate()
    const cardRef = useRef<HTMLDivElement>(null)

    // Global State
    const { showGradients, hoveredAsset, setHoveredAsset } = useUIStore()

    // Values
    const isPositive = asset.change24hPercent >= 0
    const changeColor = isPositive ? '#4ade80' : '#f87171'
    const changeBg = isPositive ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)'
    const metaColor = cryptoMeta[asset.symbol as CryptoSymbol]?.color || '#64748b'

    const isFocused = hoveredAsset === asset.symbol
    const isActive = isFocused || isExpanded;

    // Scroll Sync
    useEffect(() => {
        if (isFocused) {
            cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
    }, [isFocused])

    // Styles
    const gradientStyle = useMemo(() => getLiquidGradientStyle(metaColor), [metaColor])

    return (
        <motion.div
            layout
            ref={cardRef}
            initial={false}
            whileTap={tapAnimation}
            onClick={onToggle}
            onMouseEnter={() => setHoveredAsset(asset.symbol)}
            onMouseLeave={() => setHoveredAsset(null)}
            className="w-full py-2 cursor-pointer z-0 relative"
        >
            <div
                className={`
                    card-base relative rounded-xl overflow-hidden
                    transition-all duration-300 bg-[#1f1f22]
                    ${isExpanded ? 'ring-1 ring-white/10' : ''} 
                    ${isFocused ? 'ring-2 ring-blue-500/50' : 'ring-1 ring-white/5'}
                `}
                style={{
                    borderLeft: showGradients ? `3px solid ${metaColor}` : '3px solid transparent',
                    boxShadow: isActive && showGradients ? `inset 0 0 20px ${metaColor}20` : 'none'
                }}
            >
                {/* BACKGROUND LAYER */}
                <motion.div
                    className="absolute inset-0 z-0 pointer-events-none will-change-transform"
                    style={gradientStyle}
                    variants={liquidMovement}
                    initial="noGlow"
                    animate={!showGradients ? "noGlow" : (isActive ? "active" : "idle")}
                />

                {/* CONTENT LAYER */}
                <div className="relative z-10 flex flex-col backdrop-blur-[1px]">

                    {/* Header */}
                    <motion.div layout="position" className="flex items-center justify-between gap-3 p-4">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <Avatar src={asset.logo} sx={{ width: 42, height: 42 }} className="ring-2 ring-white/5 shadow-lg flex-shrink-0" />
                            <div className="min-w-0">
                                <Typography className="text-sm text-slate-400 font-medium truncate">{asset.name}</Typography>
                                <div className="flex items-center gap-2">
                                    <Typography variant="h6" className="text-white font-bold leading-tight truncate tracking-tight">{asset.symbol}</Typography>
                                    <ChevronIcon className={`text-slate-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <Typography className="text-white font-bold text-sm tracking-wide">
                                ${asset.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </Typography>
                            <div className="flex items-center justify-center px-2 py-0.5 rounded-md font-bold text-[11px] mt-1" style={{ backgroundColor: changeBg, color: changeColor }}>
                                {isPositive ? '+' : ''}{asset.change24hPercent.toFixed(2)}%
                            </div>
                        </div>
                    </motion.div>

                    {/* Expanded Body */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                variants={accordionVariants}
                                initial="collapsed"
                                animate="expanded"
                                exit="collapsed"
                                className="overflow-hidden bg-black/30"
                            >
                                <div className="border-t border-white/5 p-4 flex flex-col gap-4">
                                    <div className="grid grid-cols-2 gap-4 items-center">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold uppercase tracking-wider">
                                                <WalletIcon className="text-slate-600" />
                                                Your Balance
                                            </div>
                                            <div className="flex items-baseline gap-2">
                                                <Typography className="text-2xl font-bold text-white tracking-tight">
                                                    {asset.qty.toLocaleString()}
                                                </Typography>
                                                <Typography className="text-sm font-medium text-slate-400">
                                                    {asset.symbol}
                                                </Typography>
                                            </div>
                                            <Typography className="text-xs font-medium text-slate-500">
                                                ≈ ${asset.valueUsd.toLocaleString()} USD
                                            </Typography>
                                        </div>

                                        <div className="flex items-center justify-end h-full">
                                            <Button
                                                variant="contained"
                                                onClick={(e) => { e.stopPropagation(); navigate(`/app/trade/${asset.symbol}`) }}
                                                className="shadow-xl hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
                                                style={{
                                                    backgroundColor: '#3b82f6',
                                                    color: 'white',
                                                    textTransform: 'none',
                                                    fontWeight: 700,
                                                    padding: '10px 24px',
                                                    borderRadius: '12px',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                Trade {asset.symbol}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="relative w-full h-[70px] mt-2">
                                        <div className="absolute top-0 left-0 flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-wider z-10">
                                            <ChartIcon className="text-slate-600" />
                                            24h Performance
                                        </div>
                                        <div className="absolute inset-0 pt-4">
                                            <Sparkline color={changeColor} isPositive={isPositive} height={60} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    )
}