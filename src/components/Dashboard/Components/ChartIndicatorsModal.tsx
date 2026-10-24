import React, { useState } from 'react'
import { X, Search, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ChartIndicatorsModalProps {
    isOpen: boolean
    onClose: () => void
}

const INDICATORS = [
    { name: 'Accumulation/Distribution', category: 'Oscillator', favorite: false },
    { name: 'Advance/Decline', category: 'Breadth', favorite: false },
    { name: 'Arnaud Legoux Moving Average', category: 'Moving Average', favorite: false },
    { name: 'Aroon', category: 'Trend', favorite: false },
    { name: 'Average Directional Index', category: 'Trend', favorite: false },
    { name: 'Average True Range', category: 'Volatility', favorite: false },
    { name: 'Awesome Oscillator', category: 'Oscillator', favorite: false },
    { name: 'Balance of Power', category: 'Oscillator', favorite: false },
    { name: 'Bollinger Bands', category: 'Volatility', favorite: true },
    { name: 'Bollinger Bands %B', category: 'Volatility', favorite: false },
    { name: 'Bollinger Bands Width', category: 'Volatility', favorite: false },
    { name: 'Chaikin Money Flow', category: 'Volume', favorite: false },
    { name: 'Chaikin Oscillator', category: 'Oscillator', favorite: false },
    { name: 'Chande Momentum Oscillator', category: 'Momentum', favorite: false },
    { name: 'Commodity Channel Index', category: 'Momentum', favorite: false },
    { name: 'Connors RSI', category: 'Momentum', favorite: false },
    { name: 'Coppock Curve', category: 'Trend', favorite: false },
    { name: 'Correlation Coefficient', category: 'Statistics', favorite: false },
    { name: 'Detrended Price Oscillator', category: 'Oscillator', favorite: false },
    { name: 'Directional Movement Index', category: 'Trend', favorite: false },
    { name: 'Donchian Channels', category: 'Volatility', favorite: false },
    { name: 'Double EMA', category: 'Moving Average', favorite: false },
    { name: 'Ease of Movement', category: 'Volume', favorite: false },
    { name: 'Elder Ray Index', category: 'Trend', favorite: false },
    { name: 'Envelope', category: 'Trend', favorite: false },
    { name: 'Exponential Moving Average', category: 'Moving Average', favorite: true },
    { name: 'Fisher Transform', category: 'Oscillator', favorite: false },
    { name: 'Historical Volatility', category: 'Volatility', favorite: false },
    { name: 'Hull Moving Average', category: 'Moving Average', favorite: false },
    { name: 'Ichimoku Cloud', category: 'Trend', favorite: true },
    { name: 'Keltner Channels', category: 'Volatility', favorite: false },
    { name: 'Klinger Oscillator', category: 'Volume', favorite: false },
    { name: 'Know Sure Thing', category: 'Momentum', favorite: false },
    { name: 'Least Squares Moving Average', category: 'Moving Average', favorite: false },
    { name: 'Linear Regression Curve', category: 'Statistics', favorite: false },
    { name: 'MACD', category: 'Momentum', favorite: true },
    { name: 'Momentum', category: 'Momentum', favorite: false },
    { name: 'Money Flow Index', category: 'Volume', favorite: false },
    { name: 'Moving Average', category: 'Moving Average', favorite: true },
    { name: 'Moving Average Weighted', category: 'Moving Average', favorite: false },
    { name: 'On Balance Volume', category: 'Volume', favorite: false },
    { name: 'Parabolic SAR', category: 'Trend', favorite: false },
    { name: 'Pivot Points Standard', category: 'Overlay', favorite: false },
    { name: 'Price Oscillator', category: 'Momentum', favorite: false },
    { name: 'Price Volume Trend', category: 'Volume', favorite: false },
    { name: 'Rate of Change', category: 'Momentum', favorite: false },
    { name: 'Relative Strength Index', category: 'Momentum', favorite: true },
    { name: 'Stochastic', category: 'Momentum', favorite: true },
    { name: 'Stochastic RSI', category: 'Momentum', favorite: false },
    { name: 'SuperTrend', category: 'Trend', favorite: true },
    { name: 'Triple EMA', category: 'Moving Average', favorite: false },
    { name: 'TRIX', category: 'Momentum', favorite: false },
    { name: 'True Strength Indicator', category: 'Momentum', favorite: false },
    { name: 'Ultimate Oscillator', category: 'Momentum', favorite: false },
    { name: 'Volatility Stop', category: 'Volatility', favorite: false },
    { name: 'Volume', category: 'Volume', favorite: true },
    { name: 'Volume Oscillator', category: 'Volume', favorite: false },
    { name: 'Volume Weighted Average Price', category: 'Volume', favorite: true },
    { name: 'Williams %R', category: 'Momentum', favorite: false },
    { name: 'Zig Zag', category: 'Trend', favorite: false }
]

export default function ChartIndicatorsModal({ isOpen, onClose }: ChartIndicatorsModalProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    const filteredIndicators = INDICATORS.filter(indicator =>
        indicator.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (!selectedCategory || indicator.category === selectedCategory)
    )

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-[600px] h-[500px] bg-[#1e222d] rounded-lg shadow-2xl border border-[#2a2e39] text-[#d1d4dc] flex flex-col overflow-hidden font-sans"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2e39] shrink-0">
                    <span className="text-lg font-medium text-[#d1d4dc]">Indicators</span>
                    <button onClick={onClose} className="text-[#787b86] hover:text-[#d1d4dc] transition-colors"><X size={20} /></button>
                </div>

                {/* Search Bar */}
                <div className="p-4 border-b border-[#2a2e39]">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#787b86]" />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                            className="w-full bg-[#2a2e39] text-[#d1d4dc] pl-10 pr-4 py-2 rounded focus:outline-none focus:ring-1 focus:ring-[#2962ff] placeholder-[#787b86] text-sm"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 min-h-0">
                    {/* Sidebar */}
                    <div className="w-[180px] flex flex-col py-2 border-r border-[#2a2e39] shrink-0 overflow-y-auto">
                        <div className="px-4 py-2 text-xs font-bold text-[#787b86] uppercase mb-1">Scripts</div>
                        <button className="flex items-center gap-3 px-4 py-2 text-sm text-[#2962ff] bg-[#2a2e39] text-left">
                            Build-ins
                        </button>
                        <button className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#d1d4dc] hover:bg-[#2a2e39] transition-colors text-left">
                            Candlestick Patterns
                        </button>
                        <button className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#d1d4dc] hover:bg-[#2a2e39] transition-colors text-left">
                            Economy
                        </button>
                        <div className="px-4 py-2 text-xs font-bold text-[#787b86] uppercase mt-2 mb-1">Community Scripts</div>
                        <button className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#d1d4dc] hover:bg-[#2a2e39] transition-colors text-left">
                            Top
                        </button>
                        <button className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#d1d4dc] hover:bg-[#2a2e39] transition-colors text-left">
                            Trending
                        </button>
                    </div>

                    {/* Indicator List */}
                    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#2a2e39]">
                        {filteredIndicators.map((indicator, index) => (
                            <div key={index} className="flex items-center justify-between px-4 py-2.5 hover:bg-[#2a2e39] cursor-pointer group transition-colors">
                                <div className="flex flex-col">
                                    <span className="text-sm text-[#d1d4dc] group-hover:text-white font-medium">{indicator.name}</span>
                                    <span className="text-[10px] text-[#787b86] uppercase tracking-wide hidden">{indicator.category}</span> {/* Hiding category for cleaner look matching ref */}
                                </div>
                                <button className={`text-[#787b86] hover:text-[#f7931a] opacity-0 group-hover:opacity-100 transition-all ${indicator.favorite ? 'opacity-100 text-[#f7931a]' : ''}`}>
                                    <Star size={16} fill={indicator.favorite ? "currentColor" : "none"} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
