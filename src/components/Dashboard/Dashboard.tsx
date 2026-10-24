import React from 'react'
import { motion } from 'framer-motion'
import { Bell, Clock, BarChart2, TrendingUp, ClipboardList, Landmark } from 'lucide-react'
import CryptoDashboard from './CryptoDashboard'
import { useDashboardStore } from '../../store/dashboardStore'
import QuickTradeModal from './Components/QuickTradeModal'

export default function Dashboard() {
  const { currentView, setView, isFullScreen, isQuickTradeOpen, setQuickTradeOpen, activePair, currentPrice } = useDashboardStore()

  // Derived Asset for QuickTrade
  const derivedAsset = {
    symbol: activePair,
    name: activePair.split('/')[0] === 'BTC' ? 'Bitcoin' : activePair,
    price: currentPrice,
    change24h: 1.25,
    high24h: currentPrice * 1.05,
    low24h: currentPrice * 0.95,
    vol24h: '1.2B'
  }

  const TABS = [
    { id: 'TREASURY', label: 'Treasury', icon: Landmark },
    { id: 'MARKET', label: 'Market', icon: BarChart2 },
    { id: 'QUICK', label: 'QuickTrade', icon: Clock },
    { id: 'EXCHANGE', label: 'Exchange', icon: TrendingUp },
    { id: 'FUTURES', label: 'Futures', icon: TrendingUp },
  ] as const

  return (
    <div style={{
      height: '100vh',
      background: 'radial-gradient(1200px 600px at 15% -10%, rgba(114,87,255,.10), transparent 60%), radial-gradient(1000px 500px at 85% -20%, rgba(93,199,255,.10), transparent 65%), #0a0a0a',
      color: 'white',
      fontFamily: 'sans-serif'
    }} className="flex flex-col overflow-hidden selection:bg-blue-500/30">

      {/* --- FIXED HEADER --- */}
      {!isFullScreen && (
        <header className="flex-none z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl px-4 md:px-6 py-3 flex items-center justify-between">

          {/* Left: Navigation Tabs */}
          <div className="flex items-center gap-1 bg-[#151926] p-1 rounded-xl border border-white/5 overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={tab.id === 'QUICK' ? () => setQuickTradeOpen(true) : () => setView(tab.id as any)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap
                    ${currentView === tab.id
                    ? 'text-white shadow-lg'
                    : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
              >
                {currentView === tab.id && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-0 bg-[#3b82f6] rounded-lg"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <tab.icon size={14} />
                  {tab.label}
                </span>
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center px-3 py-1 rounded-full border border-amber-300/30 bg-amber-300/10 text-[10px] font-bold tracking-widest text-amber-200">
            LOCAL DEVELOPMENT ONLY
          </div>

          {/* Right: Orders & Notifications */}
          <div className="flex items-center gap-3 md:gap-4 ml-4">
            <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors group">
              <Bell size={18} className="text-slate-400 group-hover:text-white transition-colors" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
            </button>

            <div className="h-6 w-[1px] bg-white/10" />

            {/* Orders Button */}
            <button
              onClick={() => setView('ORDERS')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all
            ${currentView === 'ORDERS'
                  ? 'bg-[#3b82f6] border-[#3b82f6] text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                  : 'bg-white/5 border-white/5 text-slate-300 hover:border-white/20 hover:text-white'}`}
            >
              <ClipboardList size={16} />
              <span className="text-xs font-bold uppercase tracking-wide">Orders</span>
            </button>
          </div>
        </header>
      )}

      {/* Main Content (Scrollable) */}
      <div className="flex-1 overflow-hidden flex flex-col relative w-full">
        <CryptoDashboard />
        <QuickTradeModal
          isOpen={isQuickTradeOpen}
          onClose={() => setQuickTradeOpen(false)}
          asset={derivedAsset}
        />
      </div>

    </div>
  )
}
