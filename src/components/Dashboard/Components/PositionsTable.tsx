import React from 'react'
import { useDashboardStore } from '../../../store/dashboardStore'
import { X } from 'lucide-react'

export default function PositionsTable() {
    const { positions, closePosition } = useDashboardStore()

    if (positions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-slate-600 gap-2 min-h-[100px] h-full">
                <div className="text-xs font-bold text-white">No active positions</div>
            </div>
        )
    }

    return (
        <div className="flex-1 overflow-auto custom-scrollbar">
            <div className="px-2 py-1 border-b border-white/5 grid grid-cols-8 gap-2 text-[9px] text-slate-500 font-bold uppercase tracking-wider bg-[#0b0e14] min-w-[800px] sticky top-0">
                <div>Symbol</div>
                <div>Size</div>
                <div>Entry Price</div>
                <div>Mark Price</div>
                <div>Liq. Price</div>
                <div>Margin Ratio</div>
                <div>Unrealized PNL</div>
                <div className="text-right">Action</div>
            </div>

            {positions.map(pos => {
                const markPrice = pos.markPrice
                const pnl = pos.unrealizedPnl
                const roe = pos.roe

                return (
                    <div key={pos.id} className="grid grid-cols-8 gap-2 px-2 py-1 border-b border-white/5 text-[10px] text-slate-300 hover:bg-white/5 transition-colors items-center min-w-[800px]">
                        <div className="flex items-center gap-1 font-bold text-white">
                            <div className={`w-1 h-4 rounded-full ${pos.side === 'LONG' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            {pos.symbol} <span className="text-slate-500 bg-white/5 px-1 rounded">{pos.leverage}x</span>
                        </div>
                        <div className={`font-mono ${pos.side === 'LONG' ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {pos.size}
                        </div>
                        <div className="font-mono">{pos.entryPrice.toLocaleString()}</div>
                        <div className="font-mono">{markPrice.toLocaleString()}</div>
                        <div className="font-mono text-orange-400">{pos.liquidationPrice.toLocaleString()}</div>
                        <div className="font-mono">{(0.5).toFixed(2)}%</div>
                        <div className={`font-mono font-bold ${pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {pnl.toFixed(2)} USD ({roe.toFixed(2)}%)
                        </div>
                        <div className="text-right">
                            <button
                                onClick={() => closePosition(pos.id)}
                                className="text-white hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded px-2 py-1 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
