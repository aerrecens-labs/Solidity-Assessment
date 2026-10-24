import React, { useState, useMemo, memo } from 'react'
import { ChevronDown, Maximize2, Minimize2, Globe } from 'lucide-react'
import SpotTradeForm from '../Components/SpotTradeForm'
import OrderBook from '../Components/OrderBook'
import TradeHistory from '../Components/TradeHistory'
import CoinSelector from '../Components/CoinSelector'
import { useMatchingEngine } from '../../../hooks/useMatchingEngine'
import { useChartData } from '../../../hooks/useChartData'
import { useDashboardStore } from '../../../store/dashboardStore'
import TradingViewWidget from '../Components/TradingViewWidget'
import PositionsTable from '../Components/PositionsTable'

// --- 1. MEMOIZED MARKET HEADER (Prevents unnecessary re-renders) ---
const MarketHeader = memo(({ stats }: { stats: any }) => {
    const { isFullScreen, activePair } = useDashboardStore()
    const [isCoinSelectorOpen, setIsCoinSelectorOpen] = useState(false)

    // Safe render for loading state to maintain DOM structure
    const displayStats = stats || { change: 0, high: 0, low: 0, vol: 0, price: 0 }

    // Derive symbol info
    const baseSymbol = activePair ? activePair.split('/')[0] : 'BTC'
    const quoteSymbol = activePair ? activePair.split('/')[1] : 'USDT'
    const firstLetter = baseSymbol ? baseSymbol[0] : 'B'

    return (
        <div className="flex items-center justify-between p-1 nexus-7:p-1 hd-720:p-2 2k:p-3 border-b border-white/5 bg-[#0b0e14] shrink-0 relative z-40">
            {/* Pair Selector Area */}
            <div className="flex items-center gap-2 relative">
                <div
                    onClick={() => setIsCoinSelectorOpen(!isCoinSelectorOpen)}
                    className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded-lg transition-colors group relative"
                >
                    <div className="flex -space-x-2">
                        <div className="w-8 h-8 nexus-7:w-8 nexus-7:h-8 hd-720:w-10 hd-720:h-10 2k:w-12 2k:h-12 rounded-full bg-[#f7931a] flex items-center justify-center text-white font-bold text-[10px] hd-720:text-xs 2k:text-sm ring-2 ring-[#0b0e14] shadow-sm">
                            {firstLetter}
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-1 font-bold text-base nexus-7:text-sm hd-720:text-lg 2k:text-xl text-white">
                            {activePair} <ChevronDown size={14} className={`text-slate-500 transition-transform ${isCoinSelectorOpen ? 'rotate-180' : ''} group-hover:text-white hd-720:w-5 hd-720:h-5`} />
                        </div>
                    </div>
                </div>

                <CoinSelector isOpen={isCoinSelectorOpen} onClose={() => setIsCoinSelectorOpen(false)} />

                {/* Stats - Only visible on larger screens */}
                <div className="hidden lg:flex items-center gap-4 px-2 border-l border-white/5">
                    <div>
                        <div className="text-[9px] nexus-7:text-[9px] hd-720:text-[11px] 2k:text-xs text-slate-500 font-bold uppercase">Last Price</div>
                        <div className={`font-mono font-medium text-sm nexus-7:text-xs hd-720:text-base 2k:text-lg ${displayStats.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {displayStats.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-[9px] hd-720:text-[11px] 2k:text-xs text-slate-500">{quoteSymbol}</span>
                        </div>
                    </div>
                    <div>
                        <div className="text-[9px] nexus-7:text-[9px] hd-720:text-[11px] 2k:text-xs text-slate-500 font-bold uppercase">24h Change</div>
                        <div className={`font-mono font-medium text-sm nexus-7:text-xs hd-720:text-base 2k:text-lg ${displayStats.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {displayStats.change?.toFixed(2) || '0.00'}%
                        </div>
                    </div>
                    <div>
                        <div className="text-[9px] nexus-7:text-[9px] hd-720:text-[11px] 2k:text-xs text-slate-500 font-bold uppercase">24h High</div>
                        <div className="font-mono text-slate-300 font-medium text-sm nexus-7:text-xs hd-720:text-base 2k:text-lg">{displayStats.high?.toLocaleString() || '0.00'}</div>
                    </div>
                    <div>
                        <div className="text-[9px] nexus-7:text-[9px] hd-720:text-[11px] 2k:text-xs text-slate-500 font-bold uppercase">24h Low</div>
                        <div className="font-mono text-slate-300 font-medium text-sm nexus-7:text-xs hd-720:text-base 2k:text-lg">{displayStats.low?.toLocaleString() || '0.00'}</div>
                    </div>
                    <div>
                        <div className="text-[9px] nexus-7:text-[9px] hd-720:text-[11px] 2k:text-xs text-slate-500 font-bold uppercase">24h Vol ({baseSymbol})</div>
                        <div className="font-mono text-slate-300 font-medium text-sm nexus-7:text-xs hd-720:text-base 2k:text-lg">{displayStats.volume?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || '42.5M'}</div>
                    </div>
                </div>
            </div>

            {/* Tools */}
            <div className="flex items-center gap-1">
                <button
                    onClick={() => alert("Region/Global settings")}
                    className="p-1.5 nexus-7:p-1 hd-720:p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors">
                    <Globe className="w-4 h-4 nexus-7:w-3.5 nexus-7:h-3.5 hd-720:w-5 hd-720:h-5 4k:w-6 4k:h-6" />
                </button>
                <button
                    onClick={() => {
                        if (!document.fullscreenElement) {
                            document.documentElement.requestFullscreen().catch((e) => console.error(e));
                        } else {
                            if (document.exitFullscreen) document.exitFullscreen();
                        }
                    }}
                    className="p-1.5 nexus-7:p-1 hd-720:p-2 2k:p-2.5 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors">
                    {isFullScreen ? (
                        <Minimize2 className="w-4 h-4 nexus-7:w-3.5 nexus-7:h-3.5 hd-720:w-5 hd-720:h-5 4k:w-6 4k:h-6" />
                    ) : (
                        <Maximize2 className="w-4 h-4 nexus-7:w-3.5 nexus-7:h-3.5 hd-720:w-5 hd-720:h-5 4k:w-6 4k:h-6" />
                    )}
                </button>
            </div>
        </div>
    )
})

export default function ExchangeView() {
    useMatchingEngine()
    const { orders, positions, cancelOrder, activePair } = useDashboardStore() // Added activePair
    const { stats } = useChartData(activePair) // Use dynamic pair
    const [mobileTab, setMobileTab] = useState<'TRADE' | 'CHART' | 'BOOK'>('CHART')
    const [activeTF, setActiveTF] = useState('1h')
    const [activeTab, setActiveTab] = useState('POSITIONS')

    const filteredOrders = useMemo(() => {
        if (activeTab === 'OPEN ORDERS') return orders.filter(o => o.status === 'OPEN')
        if (activeTab === 'ORDER HISTORY') return orders.filter(o => o.status !== 'OPEN')
        return []
    }, [orders, activeTab])

    return (
        <div className="flex flex-col h-full bg-[#0b0e14] overflow-hidden font-sans">
            <MarketHeader stats={stats} />

            {/* MAIN CONTENT AREA - 3 COLUMN LAYOUT */}
            <div className="flex-1 flex overflow-hidden relative">

                {/* 1. LEFT SIDEBAR: TRADE FORM (Fixed Width) */}
                <div
                    key="left-col"
                    className={`
                    w-full 
                    nexus-7:w-[140px] 
                    ipad-mini:w-[170px] 
                    xga:w-[200px] 
                    hd-720:w-[250px] 
                    mac-air-13:w-[280px] 
                    fhd:w-[300px] 
                    2k:w-[340px] 
                    4k:w-[420px] 
                    flex-none border-r border-white/5 bg-[#151926] flex-col z-20
                    ${mobileTab === 'TRADE' ? 'flex' : 'hidden nexus-7:flex'}
                `}>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <SpotTradeForm price={stats?.price || 98250} />
                    </div>
                </div>

                {/* 2. CENTER AREA: CHART & ORDERS (Fluid) */}
                <div
                    key="center-col"
                    className={`
                    flex-1 flex flex-col min-w-0 bg-[#0b0e14] relative z-10
                    ${mobileTab === 'CHART' ? 'flex' : 'hidden nexus-7:flex'}
                `}>
                    {/* Middle: Chart */}
                    <div className="flex-[4] flex flex-col relative border-b border-white/5 border-l border-r border-[#151926] bg-[#0b0e14]">
                        {/* CRITICAL FIX: 
                           Wrapping TradingViewWidget in a keyed div ensures React doesn't try to 
                           patch the DOM nodes created by the TradingView script during re-renders. 
                        */}
                        <div key={`chart-${activePair}`} className="w-full h-full">
                            <TradingViewWidget
                                symbol={`BINANCE:${activePair.replace('/', '')}`}
                                theme="dark"
                                interval={activeTF === '15m' ? '15' : activeTF === '1h' ? '60' : activeTF === '4h' ? '240' : activeTF === '1D' ? 'D' : 'W'}
                            />
                        </div>
                    </div>

                    {/* Bottom: Open Orders */}
                    <div className="flex-[1] flex flex-col bg-[#0b0e14] relative z-20 border-t border-white/5 min-h-[250px] max-h-[400px]">
                        <div className="flex items-center gap-4 px-2 border-b border-white/5 bg-[#151926]">
                            {['POSITIONS', 'OPEN ORDERS', 'ORDER HISTORY'].map((tab) => {
                                let count = ''
                                if (tab === 'POSITIONS') count = `(${positions.length})`
                                if (tab === 'OPEN ORDERS') count = `(${orders.filter(o => o.status === 'OPEN').length})`

                                return (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`h-9 text-[10px] nexus-7:text-[9px] font-bold uppercase tracking-wider border-b-2 transition-colors px-2
                                        ${activeTab === tab ? 'text-white border-blue-500 bg-white/5' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
                                    >
                                        {tab} {count}
                                    </button>
                                )
                            })}
                        </div>

                        {activeTab === 'POSITIONS' ? (
                            <PositionsTable />
                        ) : (
                            <div className="flex flex-col flex-1 min-h-0 bg-[#0b0e14]">
                                <div className="px-2 py-1 border-b border-white/5 grid grid-cols-8 gap-2 text-[9px] text-slate-500 font-bold uppercase tracking-wider bg-[#0b0e14] min-w-[800px] sticky top-0">
                                    <div>Date</div>
                                    <div>Pair</div>
                                    <div>Type</div>
                                    <div>Side</div>
                                    <div>Price</div>
                                    <div>Amount</div>
                                    <div className="text-right">Total</div>
                                    <div className="text-right">Action</div>
                                </div>

                                <div className="flex-1 overflow-auto custom-scrollbar">
                                    {filteredOrders.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center text-slate-600 gap-2 min-h-[100px] h-full">
                                            <div className="text-xs font-bold text-white">No {activeTab.toLowerCase()}</div>
                                        </div>
                                    ) : (
                                        <div>
                                            {filteredOrders.map(order => (
                                                <div key={order.id} className="grid grid-cols-8 gap-2 px-2 py-1 border-b border-white/5 text-[10px] text-slate-300 hover:bg-white/5 transition-colors items-center min-w-[800px]">
                                                    <div className="text-slate-500 font-mono">{new Date(order.timestamp).toLocaleTimeString()}</div>
                                                    <div className="font-bold text-white">{order.pair}</div>
                                                    <div className="text-slate-400">{order.type}</div>
                                                    <div className={order.side === 'BUY' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{order.side}</div>
                                                    <div className="font-mono">{order.price.toLocaleString()}</div>
                                                    <div className="font-mono">{order.amount}</div>
                                                    <div className="text-slate-400 font-mono text-right">{order.total.toLocaleString()}</div>
                                                    <div className="text-right">
                                                        {order.status === 'OPEN' ? (
                                                            <button
                                                                onClick={() => cancelOrder(order.id)}
                                                                className="text-rose-400 hover:text-rose-300 text-[9px] uppercase font-bold px-1.5 py-0.5 bg-rose-500/10 rounded hover:bg-rose-500/20 transition-colors"
                                                            >
                                                                Cancel
                                                            </button>
                                                        ) : (
                                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${order.status === 'FILLED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700/50 text-slate-400'}`}>
                                                                {order.status}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. RIGHT SIDEBAR: ORDER BOOK & TRADES (Fixed Width) */}
                <div
                    key="right-col"
                    className={`
                    w-full 
                    nexus-7:w-[140px] 
                    ipad-mini:w-[170px] 
                    xga:w-[200px] 
                    hd-720:w-[250px] 
                    mac-air-13:w-[280px] 
                    fhd:w-[300px] 
                    2k:w-[340px] 
                    4k:w-[420px] 
                    flex-none border-l border-white/5 bg-[#151926] flex-col z-20
                    ${mobileTab === 'BOOK' ? 'flex' : 'hidden nexus-7:flex'}
                `}>
                    {/* Top Half: Order Book */}
                    <div className="flex-[0.6] flex flex-col min-h-0 border-b border-white/5">
                        <OrderBook
                            price={stats?.price || 98250}
                            quoteSymbol={activePair.split('/')[1] || 'USDT'}
                            baseSymbol={activePair.split('/')[0] || 'BTC'}
                        />
                    </div>
                    {/* Bottom Half: Trade History */}
                    <div className="flex-[0.4] flex flex-col min-h-0">
                        <TradeHistory />
                    </div>
                </div>

            </div>

            {/* MOBILE BOTTOM NAVIGATION */}
            <div className="nexus-7:hidden h-[50px] bg-[#151926] border-t border-white/5 flex items-center px-2 shrink-0 z-50">
                {['TRADE', 'CHART', 'BOOK'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setMobileTab(tab as any)}
                        className={`flex-1 h-full flex items-center justify-center text-[10px] font-bold uppercase tracking-wider
                        ${mobileTab === tab ? 'text-blue-400 bg-white/5 border-t-2 border-blue-500' : 'text-slate-500 border-t-2 border-transparent'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>
    )
}