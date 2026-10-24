import React, { useState } from 'react'
import { Search, ChevronDown, ChevronUp, Star } from 'lucide-react'
import { useDashboardStore } from '../../../store/dashboardStore'
import { MARKET_DATA } from '../../../data/appData'

export default function CoinSelector({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const { setPair } = useDashboardStore()
    const [searchTerm, setSearchTerm] = useState('')
    const [activeTab, setActiveTab] = useState('ALL')

    const filteredCoins = MARKET_DATA.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (!isOpen) return null

    return (
        <div className="absolute top-full left-0 mt-2 w-[480px] bg-[#151926] border border-white/10 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden font-sans">
            {/* Search & Header */}
            <div className="p-3 border-b border-white/5 space-y-3">
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search for Coin"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-[#0b0c10] border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:border-blue-500 outline-none"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                        <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-slate-400 font-bold border border-white/5">USD</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-4 text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                    {['ALL', 'GAINERS', 'LOSERS', 'ZERO FEES', 'MORE'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-1 border-b-2 transition-colors ${activeTab === tab ? 'text-white border-blue-500' : 'border-transparent hover:text-slate-300'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* List Header */}
            <div className="grid grid-cols-4 px-4 py-2 bg-[#0b0e14] text-[10px] font-bold text-slate-500 uppercase border-b border-white/5">
                <div className="col-span-1">Coin Pair</div>
                <div className="col-span-1 text-right cursor-pointer hover:text-white flex items-center justify-end gap-1">Last Price <ChevronDown size={10} /></div>
                <div className="col-span-1 text-right">24H Change</div>
                <div className="col-span-1 text-right">Volume</div>
            </div>

            {/* List Content */}
            <div className="max-h-[320px] overflow-y-auto custom-scrollbar bg-[#13141b]">
                {filteredCoins.map(coin => (
                    <div
                        key={coin.id}
                        onClick={() => {
                            setPair(`${coin.symbol}/${coin.pair}`)
                            onClose()
                        }}
                        className="grid grid-cols-4 px-4 py-3 hover:bg-white/5 cursor-pointer border-b border-white/5 items-center group transition-colors"
                    >
                        <div className="col-span-1 flex items-center gap-3">
                            <input type="checkbox" className="rounded border-white/20 bg-transparent w-3 h-3 cursor-pointer accent-blue-500" />
                            <div className="w-6 h-6 rounded-full bg-[#F7931A] flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                                {coin.symbol[0]}
                            </div>
                            <div className="flex flex-col leading-none">
                                <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                                    {coin.symbol} <span className="text-slate-500 font-normal">| {coin.pair}</span>
                                </div>
                                <div className="text-[10px] text-slate-500">{coin.name}</div>
                            </div>
                        </div>
                        <div className="col-span-1 text-right font-mono text-xs text-white group-hover:text-blue-400">
                            {coin.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                        <div className={`col-span-1 text-right font-mono text-xs ${coin.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {coin.change24h > 0 ? '+' : ''}{coin.change24h.toFixed(2)} %
                        </div>
                        <div className="col-span-1 text-right font-mono text-xs text-white">
                            {coin.volume24h}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-2 bg-[#0b0c10] text-[10px] text-center text-slate-500 border-t border-white/5">
                Showing {filteredCoins.length} pairs
            </div>
        </div>
    )
}
