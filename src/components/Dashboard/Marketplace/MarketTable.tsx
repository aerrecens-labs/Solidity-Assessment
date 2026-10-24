import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react'
import { useMarketStore, Coin } from '../../../store/marketStore'
import { useDashboardStore } from '../../../store/dashboardStore'

export default function MarketTable() {
    const { coins, searchQuery, activeFilter, selectCoin } = useMarketStore()
    const { setView, setPair } = useDashboardStore()

    // Navigation Handler
    const handleRefNav = (coin: Coin) => {
        // Construct pair, default to USDT for now
        const pair = `${coin.symbol}/USDT`
        setPair(pair)
        setView('EXCHANGE')
        // We might also want to scroll to top or similar, but this is enough logic for now
    }

    // Filter Logic
    const filteredCoins = coins.filter(coin => {
        const matchesSearch = coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter = activeFilter === 'ALL' || coin.category.toUpperCase() === activeFilter
        return matchesSearch && matchesFilter
    })

    return (
        <div className="bg-white/5 rounded-3xl border border-white/5 overflow-hidden backdrop-blur-sm">
            {/* Table Header */}
            <div className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr_1.5fr_1fr] gap-4 px-6 py-4 bg-[#13141b]/50 border-b border-white/5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <div>Asset</div>
                <div className="text-right">Price</div>
                <div className="text-right">24h Change</div>
                <div className="text-right hidden md:block">Market Cap</div>
                <div className="text-right hidden md:block">Volume (24h)</div>
                <div className="text-right">Action</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
                {filteredCoins.map((coin) => (
                    <motion.div
                        key={coin.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                        onClick={() => handleRefNav(coin)}
                        className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr_1.5fr_1fr] gap-4 px-6 py-4 items-center group transition-colors cursor-pointer"
                    >
                        {/* Asset Name */}
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold text-xs border border-white/10 shadow-lg relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                {coin.symbol[0]}
                            </div>
                            <div>
                                <div className="text-white font-bold text-sm group-hover:text-[#6a7bff] transition-colors">{coin.name}</div>
                                <div className="text-slate-500 text-xs flex items-center gap-1.5">
                                    <span className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] border border-white/5">{coin.symbol}</span>
                                    <span className="hidden sm:inline opacity-60">{coin.category}</span>
                                </div>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="text-right font-mono text-white text-sm font-medium">
                            ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                        </div>

                        {/* 24h Change */}
                        <div className="text-right flex flex-col items-end">
                            <div className={`font-mono font-bold text-sm flex items-center gap-1 ${coin.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                                {coin.change24h >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            </div>
                        </div>

                        {/* Market Cap */}
                        <div className="text-right font-mono text-slate-400 text-sm hidden md:block">
                            ${coin.marketCap}
                        </div>

                        {/* Volume */}
                        <div className="text-right font-mono text-slate-400 text-sm hidden md:block">
                            ${coin.volume24h}
                        </div>

                        {/* Action Button */}
                        <div className="flex justify-end" onClick={(e) => { e.stopPropagation(); handleRefNav(coin); }}>
                            <button className="opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all bg-[#6a7bff] hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-[0_0_15px_rgba(106,123,255,0.3)] active:scale-95 flex items-center gap-2">
                                <Zap size={14} className="fill-white" /> Trade
                            </button>
                        </div>
                    </motion.div>
                ))}

                {filteredCoins.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        No assets found matching "{searchQuery}"
                    </div>
                )}
            </div>
        </div>
    )
}
