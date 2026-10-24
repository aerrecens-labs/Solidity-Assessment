import React, { useState, useEffect, useMemo } from 'react'
import { Search, Bell, Calculator, ChevronDown, Check, Maximize2, Settings, Camera, FileText, Wallet, Info } from 'lucide-react'
import CustomChart from '../Components/CustomChart'
import OrderBook from '../Components/OrderBook'
import TradeForm from '../Components/TradeForm'
import ChartSettingsModal from '../Components/ChartSettingsModal'
import GlobalPreferencesDrawer from '../Components/GlobalPreferencesDrawer'
import ChartIndicatorsModal from '../Components/ChartIndicatorsModal'
import { useDashboardStore } from '../../../store/dashboardStore'
import { motion } from 'framer-motion'
import TradingViewWidget from '../Components/TradingViewWidget'
import CoinSelector from '../Components/CoinSelector' // Added import

// --- 2. POSITIONS TABLE (Refined & Functional) ---
const PositionsTable = () => {
    const { orders, cancelOrder } = useDashboardStore()
    const [activeTab, setActiveTab] = useState('OPEN ORDERS')

    const filteredOrders = useMemo(() => {
        if (activeTab === 'OPEN ORDERS') return orders.filter(o => o.status === 'OPEN')
        if (activeTab === 'ORDER HISTORY') return orders.filter(o => o.status !== 'OPEN')
        return []
    }, [orders, activeTab])

    const TABS = ['POSITIONS (0)', 'OPEN ORDERS', 'ORDER HISTORY', 'TRADE HISTORY', 'TRANSACTION HISTORY']

    return (
        <div className="flex flex-col h-full bg-[#0b0e14]">
            {/* Tabs */}
            <div className="flex items-center gap-2 md:gap-4 px-2 border-b border-white/5 bg-[#151926] overflow-x-auto no-scrollbar shrink-0">
                {TABS.map((tab) => {
                    const count = tab === 'OPEN ORDERS' ? `(${orders.filter(o => o.status === 'OPEN').length})` :
                        tab === 'ORDER HISTORY' ? `(${orders.filter(o => o.status !== 'OPEN').length})` : ''
                    const label = (tab === 'OPEN ORDERS' || tab === 'ORDER HISTORY') ? `${tab.split(' (')[0]} ${count}` : tab

                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.split(' ')[0] + (tab.includes(' ') ? ' ' + tab.split(' ')[1] : ''))} // Simple mapping
                            className={`h-7 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap px-2
                            ${activeTab === tab.split(' (')[0] || (tab === 'OPEN ORDERS' && activeTab === 'OPEN ORDERS') || (tab === 'ORDER HISTORY' && activeTab === 'ORDER HISTORY')
                                    ? 'text-blue-400 border-blue-500 bg-blue-500/5'
                                    : 'text-slate-500 border-transparent hover:text-slate-300'}`}
                        >
                            {label}
                        </button>
                    )
                })}
            </div>

            {/* Content Area */}
            {activeTab === 'POSITIONS (0)' && (
                <>
                    {/* Helper Header - 10 Columns */}
                    <div className="px-2 py-1 border-b border-white/5 grid grid-cols-10 gap-2 text-[9px] text-slate-500 font-bold uppercase tracking-wider bg-[#0b0e14] min-w-[1000px] overflow-x-auto shrink-0">
                        <div className="col-span-1">Pair</div>
                        <div className="col-span-1">Margin Type</div>
                        <div className="col-span-1">Quantity</div>
                        <div className="col-span-1">Size</div>
                        <div className="col-span-1 flex items-center gap-1">Entry Price <Info size={8} /></div>
                        <div className="col-span-1 flex items-center gap-1">Mark Price <Info size={8} /></div>
                        <div className="col-span-1 flex items-center gap-1">Liq. Price <Info size={8} /></div>
                        <div className="col-span-1">Unrealised P&L</div>
                        <div className="col-span-1">Realised P&L</div>
                        <div className="col-span-1 text-right">Margin Ratio</div>
                    </div>

                    {/* Empty State */}
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-600 gap-4 min-h-[150px] bg-[#0b0e14]">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-b from-blue-500/10 to-transparent flex items-center justify-center">
                                <Wallet size={32} className="opacity-40 text-blue-400" />
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm font-bold text-slate-400">No positions to display</div>
                            <div className="text-xs text-slate-600 mt-1">Placed position orders will be found in the list.</div>
                        </div>
                    </div>
                </>
            )}

            {(activeTab === 'OPEN ORDERS' || activeTab === 'ORDER HISTORY') && (
                <div className="flex-1 overflow-auto custom-scrollbar">
                    {/* Orders Header */}
                    <div className="px-2 py-1 border-b border-white/5 grid grid-cols-8 gap-4 text-[9px] text-slate-500 font-bold uppercase tracking-wider bg-[#0b0e14] min-w-[800px] sticky top-0 z-10">
                        <div className="">Time</div>
                        <div className="">Pair</div>
                        <div className="">Type</div>
                        <div className="">Side</div>
                        <div className="">Price</div>
                        <div className="">Amount</div>
                        <div className="">Total</div>
                        <div className="text-right">Action</div>
                    </div>

                    {filteredOrders.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-600 gap-4 min-h-[150px] bg-[#0b0e14]">
                            <FileText size={32} className="opacity-20" />
                            <span className="text-xs font-bold opacity-50">No {activeTab.toLowerCase()} to display</span>
                        </div>
                    ) : (
                        <div className="min-w-[800px]">
                            {filteredOrders.map(order => (
                                <div key={order.id} className="grid grid-cols-8 gap-4 px-2 py-1 border-b border-white/5 text-[10px] text-slate-300 hover:bg-white/5 transition-colors">
                                    <div className="text-slate-500 font-mono">{new Date(order.timestamp).toLocaleTimeString()}</div>
                                    <div className="font-bold text-white">{order.pair}</div>
                                    <div className="text-slate-400">{order.type}</div>
                                    <div className={order.side === 'BUY' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{order.side}</div>
                                    <div className="font-mono">{order.price.toLocaleString()}</div>
                                    <div className="font-mono">{order.amount}</div>
                                    <div className="text-slate-400 font-mono">{order.total.toLocaleString()}</div>
                                    <div className="text-right">
                                        {activeTab === 'OPEN ORDERS' ? (
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
            )}
        </div>
    )
}


// --- 1. HEADER (Previous MarketHeader) ---
const FuturesHeader = ({ stats, onOpenPreferences }: { stats: any, onOpenPreferences: () => void }) => {
    const { marginMode, setMarginMode, wallet, activePair } = useDashboardStore()
    const [isWalletOpen, setIsWalletOpen] = useState(false)
    const [isSelectorOpen, setIsSelectorOpen] = useState(false) // New state

    // Safety check for stats
    if (!stats) return null;

    const handleMaximize = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((e) => {
                console.error(`Error attempting to enable fullscreen mode: ${e.message} (${e.name})`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    return (
        <div className="h-[40px] bg-[#0b0e14] border-b border-white/5 flex items-center px-2 justify-between shrink-0 z-30 relative">
            {/* Left: Ticker & Main Price */}
            <div className="flex items-center gap-4 relative">
                <div
                    onClick={() => setIsSelectorOpen(!isSelectorOpen)}
                    className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded-lg transition-colors group border border-transparent hover:border-white/5 relative"
                >
                    <div className="w-6 h-6 rounded-full bg-[#F7931A] flex items-center justify-center text-white text-[9px] font-bold shadow-sm shadow-orange-500/20">
                        {activePair.split('/')[0][0]}
                    </div>
                    <div className="flex flex-col leading-none gap-0.5">
                        <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                            {activePair} <ChevronDown size={10} className={`inline transition-transform ${isSelectorOpen ? 'rotate-180' : ''}`} />
                        </span>
                        <span className="text-[9px] text-slate-500 font-medium">Perpetual</span>
                    </div>
                </div>

                <CoinSelector isOpen={isSelectorOpen} onClose={() => setIsSelectorOpen(false)} />

                <div className={`text-sm font-mono font-bold tracking-tight ${stats?.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {stats?.price?.toLocaleString(undefined, { minimumFractionDigits: 1 })}
                </div>
            </div>

            {/* Center: Market Stats Ribbon */}
            <div className="hidden 2xl:flex items-center gap-4">
                <div className="flex flex-col items-end">
                    <span className="text-[9px] text-slate-500 font-medium border-b border-dashed border-slate-700 cursor-help">Mark</span>
                    <span className="text-[10px] text-slate-300 font-mono tracking-wide">{stats?.price?.toLocaleString()}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[9px] text-slate-500 font-medium border-b border-dashed border-slate-700 cursor-help">Index</span>
                    <span className="text-[10px] text-slate-300 font-mono tracking-wide">{(stats?.price + 12.5).toLocaleString()}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[9px] text-slate-500 font-medium border-b border-dashed border-slate-700 cursor-help">Funding / Countdown</span>
                    <span className="text-[10px] text-[#EAB308] font-mono tracking-wide font-bold">0.0100% <span className="text-slate-500 font-normal">/</span> 05:42:18</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[9px] text-slate-500 font-medium border-b border-dashed border-slate-700 cursor-help">24h Change</span>
                    <span className={`text-[10px] font-mono tracking-wide ${stats?.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {stats?.change24h > 0 ? '+' : ''}{stats?.change24h}%
                    </span>
                </div>
                <div className="flex flex-col items-end opacity-60 hover:opacity-100 transition-opacity">
                    <span className="text-[9px] text-slate-500 font-medium border-b border-dashed border-slate-700 cursor-help">24h Vol (USDT)</span>
                    <span className="text-[10px] text-slate-300 font-mono tracking-wide">493.5M</span>
                </div>
            </div>

            {/* Right: Wallet & Settings & Mode */}
            <div className="flex items-center gap-3">
                {/* Margin Mode Toggle */}
                <div className="flex items-center bg-[#151926] p-0.5 rounded border border-white/5">
                    <button
                        onClick={() => setMarginMode('CROSS')}
                        className={`px-3 py-1 text-[10px] font-bold rounded transition-colors ${marginMode === 'CROSS' ? 'bg-[#0b0c10] text-blue-400 shadow-sm border border-white/5' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Cross
                    </button>
                    <button
                        onClick={() => setMarginMode('ISOLATED')}
                        className={`px-3 py-1 text-[10px] font-bold rounded transition-colors ${marginMode === 'ISOLATED' ? 'bg-[#0b0c10] text-blue-400 shadow-sm border border-white/5' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Isolated
                    </button>
                </div>

                {/* Wallet Dropdown */}
                <div className="relative">
                    <div
                        onClick={() => setIsWalletOpen(!isWalletOpen)}
                        className="flex items-center gap-3 px-3 py-1 bg-[#151926] rounded border border-white/5 cursor-pointer hover:border-slate-600 transition-all group"
                    >
                        <Wallet size={14} className="text-blue-500" />
                        <div className="flex flex-col items-end leading-tight">
                            <span className="text-[9px] text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1">Futures (USDT) <ChevronDown size={8} /></span>
                            <span className="text-[11px] text-white font-mono font-bold">{(wallet?.usdt?.available ?? 0).toFixed(2)} <span className="text-slate-500 text-[9px] font-sans">USDT</span></span>
                        </div>
                    </div>
                    {isWalletOpen && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-[#151926] border border-white/10 rounded-lg shadow-xl p-3 z-50">
                            <div className="text-[10px] text-slate-500 font-bold uppercase mb-2">Total Balance</div>
                            <div className="text-lg text-white font-mono font-bold">${(wallet?.usd?.total || 0).toLocaleString()}</div>
                            <div className="h-px bg-white/5 my-2" />
                            <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">USDT Balance</div>
                            <div className="text-sm text-emerald-400 font-mono font-bold">{(wallet?.usdt?.total || 0).toLocaleString()} USDT</div>
                        </div>
                    )}
                </div>

                <button
                    onClick={onOpenPreferences}
                    className="p-2 hover:bg-white/5 rounded text-slate-400 hover:text-white transition-colors"
                >
                    <Settings size={18} />
                </button>
                <button
                    onClick={handleMaximize}
                    className="p-2 hover:bg-white/5 rounded text-slate-400 hover:text-white transition-colors"
                >
                    <Maximize2 size={18} />
                </button>
            </div>
        </div>
    )
}



// --- 3. LEVERAGE SLIDER (Extracted) ---
const LeverageSlider = () => {
    const { leverage, setLeverage } = useDashboardStore()
    return (
        <div className="mb-4 px-1">
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-2">
                <span>Leverage</span>
                <span className="text-white bg-slate-800 px-1 rounded">{leverage}x</span>
            </div>
            <div className="relative h-6 flex items-center group">
                {/* Track */}
                <div className="absolute inset-x-0 h-1 bg-[#1e232f] rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-1/2 transition-all duration-300 group-hover:bg-blue-500" style={{ width: `${(leverage / 125) * 100}%` }} />
                </div>
                {/* Steps */}
                <div className="absolute inset-x-0 h-1 flex justify-between px-0.5">
                    {[0, 25, 50, 75, 100].map(s => <div key={s} className="w-0.5 h-0.5 bg-slate-600 rounded-full" />)}
                </div>
                {/* Thumb (Fake) */}
                <div
                    className="absolute h-3 w-3 bg-blue-500 rounded-full shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-transform left-1/2 ring-2 ring-[#151926]"
                    style={{ left: `${(leverage / 125) * 100}%`, marginLeft: '-6px' }}
                />
                <input
                    type="range"
                    min="1" max="125"
                    value={leverage}
                    onChange={(e) => setLeverage(parseInt(e.target.value))}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
                />
            </div>
        </div>
    )
}

export default function FuturesView() {
    const { activePair } = useDashboardStore()
    const [mobileTab, setMobileTab] = useState<'CHART' | 'TRADE' | 'BOOK'>('CHART')
    const [sidebarTab, setSidebarTab] = useState<'TRADE' | 'BOOK'>('TRADE')

    // Timeframe State
    const [activeTF, setActiveTF] = useState('15m')
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [isPreferencesOpen, setIsPreferencesOpen] = useState(false)
    const [isIndicatorsOpen, setIsIndicatorsOpen] = useState(false)
    const [chartType, setChartType] = useState('Candles')
    const [isSnapshotOpen, setIsSnapshotOpen] = useState(false)

    // Mock Data Generator (Self-Contained)
    const stats = useMemo(() => {
        const isBTC = activePair.includes('BTC')
        const basePrice = isBTC ? 90123.5 : (activePair.includes('ETH') ? 3420.5 : 150.5)

        return {
            price: basePrice,
            change24h: isBTC ? -0.16 : 1.25,
            high: basePrice * 1.05,
            low: basePrice * 0.95,
            vol: 49809
        }
    }, [activePair])

    // Ensure chart renders
    const [data, setData] = useState<any[]>([])
    useEffect(() => {
        // Hydrate initial mock data
        setData(Array.from({ length: 100 }, (_, i) => ({
            time: Math.floor(Date.now() / 1000) - (100 - i) * 60,
            open: stats.price + Math.random() * 50,
            high: stats.price + 100,
            low: stats.price - 100,
            close: stats.price + Math.random() * 50 - 25
        })))
    }, [stats.price]) // Update on price change

    return (
        <div className="flex flex-col h-full bg-[#0b0e14] overflow-hidden font-sans">
            <FuturesHeader stats={stats} onOpenPreferences={() => setIsPreferencesOpen(true)} />

            {/* MAIN CONTENT AREA - 3 COLUMN LAYOUT */}
            <div className="flex-1 flex overflow-hidden relative">

                {/* 1. LEFT SIDEBAR: TRADE FORM (Fixed Width) */}
                <div className={`
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
                        <TradeForm type="FUTURES" price={stats.price} />
                    </div>
                </div>

                {/* 2. CENTER AREA: CHART & ORDERS (Fluid) */}
                <div className={`
                    flex-1 flex flex-col min-w-0 bg-[#0b0e14] relative z-10
                    ${mobileTab === 'CHART' ? 'flex' : 'hidden nexus-7:flex'}
                `}>
                    {/* Top: Chart Area with Dedicated Toolbar */}
                    <div className="flex-1 flex flex-col relative border-b border-white/5 bg-[#0b0e14]">
                        <TradingViewWidget
                            symbol={`BINANCE:${activePair.replace('/', '')}`}
                            theme="dark"
                            interval={activeTF === '15m' ? '15' : activeTF === '1h' ? '60' : activeTF === '4h' ? '240' : activeTF === '1D' ? 'D' : 'W'}
                        />
                    </div>

                    {/* Bottom: Positions Table (Resizable/Toggleable in future?) */}
                    <div className="h-[250px] flex-none border-t border-white/5 bg-[#0b0e14] z-20">
                        <PositionsTable />
                    </div>
                </div>

                {/* 3. RIGHT SIDEBAR: ORDER BOOK & TRADES (Fixed Width) */}
                <div className={`
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
                            price={stats.price}
                            quoteSymbol={activePair.split('/')[1]}
                            baseSymbol={activePair.split('/')[0]}
                        />
                    </div>
                    {/* Bottom Half: Trade History */}
                    <div className="flex-[0.4] flex flex-col min-h-0">
                        {/* Trade History Component (Reused/Mocked) */}
                        <div className="flex-1 p-4 text-center text-slate-500 text-xs">Trade History</div>
                    </div>
                </div>

            </div>

            {/* MOBILE BOTTOM NAVIGATION (Visible < Nexus-7 600px) */}
            <div className="nexus-7:hidden h-[50px] bg-[#151926] border-t border-white/5 flex items-center px-2 shrink-0 z-50">
                {['CHART', 'TRADE', 'BOOK'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => {
                            setMobileTab(tab as any)
                            if (tab === 'TRADE') setSidebarTab('TRADE')
                            if (tab === 'BOOK') setSidebarTab('BOOK')
                        }}
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
