import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Filter, Download } from 'lucide-react'
import { useDashboardStore } from '../../../store/dashboardStore'
import { investmentWallet } from '../../../state/investmentWallet'

export default function OrdersView() {
    const { setView } = useDashboardStore()
    const [investmentBalance, setInvestmentBalance] = useState(investmentWallet.getBalance())

    useEffect(() => {
        const unsub = investmentWallet.subscribe((balance) => {
            setInvestmentBalance(balance)
        })
        return unsub
    }, [])

    const TABS = ['OPEN ORDERS', 'ORDER HISTORY', 'TRADE HISTORY']

    return (
        <div className="flex-1 min-h-screen bg-[#0b0e14] text-white flex flex-col gap-8 p-6 md:p-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Orders</h1>
                <div className="flex items-center gap-4">
                    <div className="bg-[#151926] border border-white/5 rounded-lg px-4 py-2 flex items-center gap-3">
                        <div className="text-[10px] text-slate-500 font-bold uppercase">Investment Wallet Balance</div>
                        <div className="text-sm font-mono text-emerald-400">${investmentBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    </div>
                    <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-xs font-bold px-4 py-2 rounded-lg transition-colors border border-white/5">
                        <Download size={14} />
                        SEND STATEMENT
                    </button>
                </div>
            </div>

            {/* Content Card */}
            <div className="flex-1 bg-[#151926] rounded-3xl border border-white/5 flex flex-col overflow-hidden relative">

                {/* Tabs */}
                <div className="flex items-center gap-8 px-8 border-b border-white/5">
                    {TABS.map((tab, i) => (
                        <button key={tab} className={`py-6 text-xs font-bold tracking-wider border-b-2 transition-colors ${i === 0 ? 'border-[#3b82f6] text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Empty State */}
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                    {/* Illustration Placeholder (Using Icon for now) */}
                    <div className="w-40 h-40 bg-gradient-to-b from-blue-500/10 to-transparent rounded-full flex items-center justify-center mb-6 relative">
                        <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
                        <FileText size={64} className="text-[#3b82f6] relative z-10" />
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-3">No Open orders to display</h2>
                    <p className="text-slate-400 max-w-md mb-8">
                        View orders for over a year by applying a <span className="text-[#3b82f6] font-bold cursor-pointer">FILTER</span> or place a new order.
                    </p>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setView('QUICK')}
                            className="px-8 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-bold transition-all uppercase tracking-wider"
                        >
                            QuickTrade
                        </button>
                        <button
                            onClick={() => setView('EXCHANGE')}
                            className="px-8 py-3 rounded-xl bg-[#3b82f6] hover:bg-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all uppercase tracking-wider"
                        >
                            Exchange
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}
