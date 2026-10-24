import React from 'react'
import { useDashboardStore } from '../../../store/dashboardStore'

export default function TradeHistory() {
    const { trades } = useDashboardStore()

    return (
        <div className="flex flex-col h-full bg-[#151926] font-sans text-[10px]">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 shrink-0 bg-[#151926]">
                <span className="font-bold text-slate-300 text-xs">Trade History</span>
            </div>

            {/* Columns */}
            <div className="grid grid-cols-3 px-3 py-1.5 text-slate-500 font-bold uppercase shrink-0 border-b border-white/5">
                <span className="text-left">Price USD</span>
                <span className="text-right">Qty BTC</span>
                <span className="text-right">Time</span>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {trades.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-slate-600">No trades yet</div>
                ) : (
                    trades.map((trade, i) => (
                        <div key={i} className="grid grid-cols-3 px-3 py-1 hover:bg-white/5 cursor-pointer">
                            <span className={`font-mono font-medium ${trade.side === 'BUY' ? 'text-[#26a17b]' : 'text-[#ef4444]'}`}>
                                {trade.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                            <span className="text-right font-mono text-slate-300">{trade.amount.toFixed(8)}</span>
                            <span className="text-right text-slate-500">{new Date(trade.timestamp).toLocaleTimeString()}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
