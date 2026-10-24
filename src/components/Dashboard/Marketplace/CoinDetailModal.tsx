import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, TrendingUp, TrendingDown, DollarSign, Activity, Maximize2 } from 'lucide-react'
import { useMarketStore } from '../../../store/marketStore'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function CoinDetailModal() {
    const { selectedCoin, selectCoin } = useMarketStore()

    if (!selectedCoin) return null

    // Format sparkline data for Recharts
    const chartData = selectedCoin.sparkline.map((val, idx) => ({ name: `Day ${idx + 1}`, value: val }))
    const isUp = selectedCoin.change24h >= 0

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex justify-end bg-black/60 backdrop-blur-sm"
                onClick={() => selectCoin(null)} // Close on backdrop click
            >
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    className="w-full max-w-md h-full bg-[#13141b] border-l border-white/5 shadow-2xl overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()} // Prevent close on panel click
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 flex items-start justify-between bg-[#0b0c10]/50 backdrop-blur-md sticky top-0 z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-2xl shadow-lg border border-white/10">
                                {selectedCoin.symbol[0]}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white leading-tight">{selectedCoin.name}</h2>
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded bg-white/5 text-xs text-slate-400 font-mono border border-white/5">{selectedCoin.symbol}</span>
                                    <span className={`text-sm font-bold flex items-center gap-1 ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {isUp ? '+' : ''}{selectedCoin.change24h}%
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => selectCoin(null)}
                            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">

                        {/* Price Hero */}
                        <div className="px-6 pt-8 pb-4">
                            <div className="text-sm text-slate-400 mb-1">Current Price</div>
                            <div className="text-5xl font-bold text-white font-mono tracking-tight">
                                ${selectedCoin.price.toLocaleString()}
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="h-64 w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={isUp ? '#10b981' : '#f43f5e'} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={isUp ? '#10b981' : '#f43f5e'} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1f1f22', border: '1px solid #333', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                        labelStyle={{ display: 'none' }}
                                        formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke={isUp ? '#10b981' : '#f43f5e'}
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorPrice)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 p-6">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
                                    <Activity size={14} /> MARKET CAP
                                </div>
                                <div className="text-xl font-mono text-white">{selectedCoin.marketCap}</div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
                                    <TrendingUp size={14} /> VOLUME (24H)
                                </div>
                                <div className="text-xl font-mono text-white">{selectedCoin.volume24h}</div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
                                    <Maximize2 size={14} /> CIRCULATING
                                </div>
                                <div className="text-xl font-mono text-white">19.2M</div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
                                    <DollarSign size={14} /> ALL TIME HIGH
                                </div>
                                <div className="text-xl font-mono text-white">$69,044</div>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="px-6 pb-24">
                            <h3 className="text-white font-bold mb-3">About {selectedCoin.name}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                {selectedCoin.name} is a decentralized digital currency, without a central bank or single administrator, that can be sent from user to user on the peer-to-peer network without the need for intermediaries.
                            </p>
                        </div>
                    </div>

                    {/* Sticky Footer Actions */}
                    <div className="p-6 border-t border-white/10 bg-[#13141b] sticky bottom-0 z-10 grid grid-cols-2 gap-4">
                        <button className="py-4 bg-[#6a7bff] hover:bg-blue-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(106,123,255,0.3)] transition-all active:scale-95 text-lg">
                            Buy
                        </button>
                        <button className="py-4 bg-[#1f1f22] hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/50 text-rose-400 font-bold rounded-xl transition-all active:scale-95 text-lg">
                            Sell
                        </button>
                    </div>

                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
