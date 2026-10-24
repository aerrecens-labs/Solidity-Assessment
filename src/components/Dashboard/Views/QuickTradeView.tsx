import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Star, Zap, TrendingUp, BarChart2 } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import { investmentWallet } from '../../../state/investmentWallet'
import QuickTradeModal, { AssetData } from '../Components/QuickTradeModal'

// Mock Data
const ASSETS: AssetData[] = [
    {
        symbol: 'BTC', name: 'Bitcoin', price: 64230.50, change24h: -2.08,
        high24h: 65800.20, low24h: 62900.50, vol24h: '34.2B',
        chartData: [40, 50, 45, 60, 55, 65, 60]
    },
    {
        symbol: 'ETH', name: 'Ethereum', price: 3450.12, change24h: 1.54,
        high24h: 3520.10, low24h: 3380.00, vol24h: '15.8B',
        chartData: [30, 35, 40, 38, 45, 50, 48]
    },
    {
        symbol: 'SOL', name: 'Solana', price: 145.20, change24h: 12.50,
        high24h: 152.00, low24h: 130.50, vol24h: '4.2B',
        chartData: [10, 20, 15, 30, 40, 60, 80]
    },
    {
        symbol: 'BNB', name: 'Binance Coin', price: 590.00, change24h: -0.50,
        high24h: 595.20, low24h: 585.50, vol24h: '1.2B',
        chartData: [50, 48, 49, 47, 46, 48, 50]
    },
    {
        symbol: 'XRP', name: 'Ripple', price: 0.62, change24h: 5.20,
        high24h: 0.65, low24h: 0.58, vol24h: '890M',
        chartData: [10, 12, 11, 14, 13, 15, 16]
    },
    {
        symbol: 'ADA', name: 'Cardano', price: 0.45, change24h: -1.20,
        high24h: 0.48, low24h: 0.44, vol24h: '450M',
        chartData: [20, 18, 19, 17, 16, 15, 14]
    },
    {
        symbol: 'DOGE', name: 'Dogecoin', price: 0.12, change24h: 8.40,
        high24h: 0.13, low24h: 0.11, vol24h: '2.1B',
        chartData: [5, 8, 7, 12, 10, 15, 14]
    },
    {
        symbol: 'DOT', name: 'Polkadot', price: 7.20, change24h: 0.80,
        high24h: 7.50, low24h: 6.90, vol24h: '320M',
        chartData: [20, 22, 21, 23, 22, 24, 25]
    },
]

export default function QuickTradeView() {
    const [filter, setFilter] = useState<'ALL' | 'GAINERS' | 'LOSERS'>('ALL')
    const [searchTerm, setSearchTerm] = useState('')
    const [investmentBalance, setInvestmentBalance] = useState(investmentWallet.getBalance())
    const [selectedAsset, setSelectedAsset] = useState<AssetData | null>(null)

    useEffect(() => {
        const unsub = investmentWallet.subscribe((balance) => {
            setInvestmentBalance(balance)
        })
        return unsub
    }, [])

    // Filter Logic
    const filteredAssets = ASSETS.filter(asset => {
        const matchesSearch = asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.name.toLowerCase().includes(searchTerm.toLowerCase())

        if (!matchesSearch) return false

        if (filter === 'GAINERS') return asset.change24h > 0
        if (filter === 'LOSERS') return asset.change24h < 0
        return true
    })

    return (
        <div className="h-full bg-[#0b0e14] text-white flex flex-col gap-6 p-6 overflow-hidden">

            {/* Stats / Info Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#151926] border border-white/5 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden group">
                    <div>
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Investment Wallet Balance</div>
                        <div className="text-2xl font-mono text-white font-medium">${investmentBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#3b82f6]/10 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#3b82f6] shadow-[0_0_10px_#3b82f6]" />
                    </div>
                </div>
                <div className="bg-[#151926] border border-white/5 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden">
                    <div>
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">24h Vol</div>
                        <div className="text-2xl font-mono text-slate-200 font-medium">$42.8B</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <TrendingUp size={18} className="text-emerald-500" />
                    </div>
                </div>
                <div className="bg-[#151926] border border-white/5 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden">
                    <div>
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Market Cap</div>
                        <div className="text-2xl font-mono text-slate-200 font-medium">$2.1T</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <BarChart2 size={18} className="text-purple-500" />
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Tabs */}
                <div className="flex bg-[#151926] p-1 rounded-xl w-full md:w-auto border border-white/5">
                    {['ALL', 'GAINERS', 'LOSERS'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab as any)}
                            className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-xs font-bold transition-all
                                ${filter === tab ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                    <input
                        type="text"
                        placeholder="Search coins..."
                        className="w-full bg-[#151926] text-white text-xs rounded-xl py-2.5 pl-9 pr-4 border border-white/5 focus:border-[#3b82f6] focus:outline-none transition-colors placeholder:text-slate-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Asset List */}
            <div className="flex-1 bg-[#151926] rounded-2xl border border-white/5 overflow-hidden flex flex-col shadow-xl shadow-black/20">
                {/* Table Header */}
                <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] md:grid-cols-[2fr_1.5fr_1.5fr_2fr_1.5fr] gap-4 px-6 py-3 bg-[#0a0a0a]/30 border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <div>Asset</div>
                    <div className="text-right">Price (USD)</div>
                    <div className="text-right">24h Change</div>
                    <div className="hidden md:block h-full">Chart (24h)</div>
                    <div className="text-right">Action</div>
                </div>

                {/* Rows */}
                <div className="overflow-y-auto divide-y divide-white/5">
                    {filteredAssets.map(asset => (
                        <motion.div
                            key={asset.symbol}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                            onClick={() => setSelectedAsset(asset)}
                            className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] md:grid-cols-[2fr_1.5fr_1.5fr_2fr_1.5fr] gap-4 px-6 py-3.5 items-center group cursor-pointer"
                        >
                            {/* Asset */}
                            <div className="flex items-center gap-3">
                                <button className="text-slate-700 hover:text-yellow-400 transition-colors">
                                    <Star size={14} />
                                </button>
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-[10px] ring-1 ring-white/10">
                                    {asset.symbol[0]}
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-white group-hover:text-[#3b82f6] transition-colors">{asset.symbol}</div>
                                    <div className="text-[10px] text-slate-500">{asset.name}</div>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="text-right font-mono text-white text-sm font-medium">
                                ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>

                            {/* 24h Change */}
                            <div className={`text-right font-mono font-bold text-xs ${asset.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {asset.change24h > 0 ? '+' : ''}{asset.change24h}%
                            </div>

                            {/* Chart (Sparkline) */}
                            <div className="hidden md:block h-8 w-full opacity-40 group-hover:opacity-100 transition-opacity">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={asset.chartData ? asset.chartData.map((val, i) => ({ i, val })) : []}>
                                        <defs>
                                            <linearGradient id={`gradient-${asset.symbol}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={asset.change24h >= 0 ? '#10b981' : '#f43f5e'} stopOpacity={0.3} />
                                                <stop offset="95%" stopColor={asset.change24h >= 0 ? '#10b981' : '#f43f5e'} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Area
                                            type="monotone"
                                            dataKey="val"
                                            stroke={asset.change24h >= 0 ? '#10b981' : '#f43f5e'}
                                            fill={`url(#gradient-${asset.symbol})`}
                                            strokeWidth={1.5}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Action */}
                            <div className="flex justify-end">
                                <button className="bg-[#3b82f6] hover:bg-blue-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-lg shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-1.5 opacity-80 group-hover:opacity-100">
                                    <Zap size={12} className="fill-white" />
                                    BUY
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Quick Trade Modal */}
            <QuickTradeModal
                isOpen={!!selectedAsset}
                onClose={() => setSelectedAsset(null)}
                asset={selectedAsset}
            />
        </div>
    )
}
