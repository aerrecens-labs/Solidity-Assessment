import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MoreVertical, Star } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

// Mock Data for Market List
// Mock Data for Market List
const MARKET_DATA = [
    { id: 1, symbol: 'USDT', name: 'Tether', price: 1.00, change: -0.31, chartData: [1.00, 1.00, 1.00, 1.00, 1.00, 1.00] },
    { id: 2, symbol: 'XRP', name: 'Ripple', price: 2.23, change: -0.63, chartData: [2.24, 2.25, 2.22, 2.21, 2.23, 2.23] },
    { id: 3, symbol: 'ETH', name: 'Ethereum', price: 3420.12, change: -3.96, chartData: [3500, 3480, 3450, 3400, 3410, 3420] },
    { id: 4, symbol: 'BTC', name: 'Bitcoin', price: 98250.00, change: -2.35, chartData: [99000, 98500, 98000, 97500, 98000, 98250] },
    { id: 5, symbol: 'SOL', name: 'Solana', price: 145.20, change: -5.03, chartData: [150, 148, 145, 142, 144, 145] },
    { id: 6, symbol: 'TRX', name: 'TRON', price: 0.30, change: -1.37, chartData: [0.31, 0.30, 0.29, 0.30, 0.30, 0.30] },
    { id: 7, symbol: 'BNB', name: 'Binance Coin', price: 975.43, change: 0.88, chartData: [960, 970, 975, 980, 978, 975] },
    { id: 8, symbol: 'DOGE', name: 'Dogecoin', price: 0.15, change: -0.31, chartData: [0.16, 0.15, 0.15, 0.14, 0.15, 0.15] },
    { id: 9, symbol: 'POL', name: 'Polygon', price: 0.13, change: 1.14, chartData: [0.12, 0.13, 0.13, 0.14, 0.13, 0.13] },
]

import { useDashboardStore } from '../../../store/dashboardStore'

export default function MarketView() {
    const { setView, setPair } = useDashboardStore()
    const [searchTerm, setSearchTerm] = useState('')
    const [activeTab, setActiveTab] = useState('USD')

    // Filter logic
    const filteredData = MARKET_DATA.filter(coin =>
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleTrade = (symbol: string) => {
        setPair(`${symbol}/USDT`)
        setView('EXCHANGE')
    }

    return (
        <div className="flex flex-col h-full bg-[#0b0e14] p-6 overflow-hidden">
            {/* ... (Keep existing Toolbar & Header) ... */}

            {/* Top Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
                {/* Search */}
                <div className="relative w-full max-w-sm group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search coin"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#151926] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>

                {/* Currency Tabs */}
                <div className="flex bg-[#151926] p-1 rounded-xl border border-white/5">
                    {['USD', 'USDT'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-white'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-bold text-slate-500 uppercase border-b border-white/5">
                <div className="col-span-3">Coins</div>
                <div className="col-span-3 text-right">Price</div>
                <div className="col-span-2 text-right">24 Hr Change</div>
                <div className="col-span-2 text-center">Chart</div>
                <div className="col-span-2 text-right">Options</div>
            </div>

            {/* Table Content */}
            <div className="flex-1 overflow-y-auto">
                {filteredData.map((coin) => (
                    <div
                        key={coin.id}
                        className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/5 border-b border-white/5 transition-colors group"
                    >
                        {/* Coin Info */}
                        <div className="col-span-3 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white/5">
                                {coin.symbol[0]}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-white text-base">{coin.symbol}</span>
                                    <span className="text-xs text-slate-500 border border-white/10 px-1 rounded">{activeTab}</span>
                                </div>
                                <div className="text-xs text-slate-500">{coin.name}</div>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="col-span-3 text-right">
                            <div className="font-mono text-white text-base font-medium">{coin.price.toLocaleString('en-IN', { minimumFractionDigits: 4 })} <span className="text-slate-500 text-xs">INR</span></div>
                        </div>

                        {/* Change */}
                        <div className="col-span-2 text-right">
                            <div className={`font-mono font-medium ${coin.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {coin.change > 0 ? '↑' : '↓'} {Math.abs(coin.change).toFixed(2)}%
                            </div>
                        </div>

                        {/* Sparkline Chart */}
                        <div className="col-span-2 h-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={coin.chartData.map((val, i) => ({ i, val }))}>
                                    <Line
                                        type="monotone"
                                        dataKey="val"
                                        stroke={coin.change >= 0 ? '#10b981' : '#f43f5e'}
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Options */}
                        <div className="col-span-2 flex items-center justify-end gap-2">
                            <button
                                onClick={() => handleTrade(coin.symbol)}
                                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-6 py-2 rounded-lg transition-colors shadow-lg shadow-blue-600/20"
                            >
                                TRADE
                            </button>
                            <button className="text-slate-500 hover:text-white p-2">
                                <MoreVertical size={16} />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Empty State */}
                {filteredData.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                        <Search size={48} className="mb-4 opacity-20" />
                        <div>No coins found matching "{searchTerm}"</div>
                    </div>
                )}
            </div>
        </div>
    )
}
