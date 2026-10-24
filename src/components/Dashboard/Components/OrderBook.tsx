// Dynamic generation inside component
import { useMemo } from 'react'

export default function OrderBook({ price, quoteSymbol = 'USDT', baseSymbol = 'BTC' }: { price?: number, quoteSymbol?: string, baseSymbol?: string }) {
    const currentPrice = price || 65000

    const { asks, bids } = useMemo(() => {
        const _asks = []
        const _bids = []
        for (let i = 0; i < 15; i++) {
            const askPrice = currentPrice + (i + 1) * (currentPrice * 0.0001)
            const bidPrice = currentPrice - (i + 1) * (currentPrice * 0.0001)
            _asks.push({
                price: askPrice,
                amount: Math.random() * 0.5,
                total: askPrice * (Math.random() * 0.5)
            })
            _bids.push({
                price: bidPrice,
                amount: Math.random() * 0.5,
                total: bidPrice * (Math.random() * 0.5)
            })
        }
        return { asks: _asks, bids: _bids }
    }, [currentPrice])

    const ASKS = asks
    const BIDS = bids

    return (
        <div className="h-full flex flex-col bg-[#151926] overflow-hidden text-[10px] nexus-7:text-[8px] font-sans">
            {/* Header */}
            <div className="flex items-center justify-between px-2 py-1.5 nexus-7:py-0.5 border-b border-white/5 bg-[#151926] shrink-0">
                <div className="font-bold text-slate-400">Order Book</div>
                <div className="flex gap-2">
                    <button className="hover:text-white text-slate-500"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="nexus-7:w-2.5 nexus-7:h-2.5"><path d="M4 4h16v16H4z" /></svg></button>
                    <button className="hover:text-white text-slate-500"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="nexus-7:w-2.5 nexus-7:h-2.5"><path d="M4 12h16v8H4z" /></svg></button>
                    <button className="hover:text-white text-slate-500"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="nexus-7:w-2.5 nexus-7:h-2.5"><path d="M4 4h16v8H4z" /></svg></button>
                </div>
            </div>

            {/* Columns Header */}
            <div className="grid grid-cols-3 px-2 py-1 nexus-7:py-0.5 text-[#787b86] font-bold uppercase shrink-0 text-[10px] nexus-7:text-[7px]">
                <span className="text-left font-sans">Price({quoteSymbol})</span>
                <span className="text-right font-sans">Qty({baseSymbol})</span>
                <span className="text-right font-sans">Total({quoteSymbol})</span>
            </div>

            {/* Asks (Sells) - Red */}
            <div className="flex-1 overflow-hidden relative flex flex-col justify-end">
                <div className="w-full">
                    {ASKS.slice().reverse().map((ask, i) => (
                        <div key={i} className="grid grid-cols-3 px-2 py-0.5 nexus-7:py-0 cursor-pointer hover:bg-white/5 relative group">
                            <div className="text-rose-400 font-mono z-10">{ask.price.toLocaleString(undefined, { minimumFractionDigits: 1 })}</div>
                            <div className="text-right text-slate-300 font-mono z-10">{ask.amount.toFixed(3)}</div>
                            <div className="text-right text-slate-500 font-mono z-10">{ask.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                            <div className="absolute top-0 right-0 bottom-0 bg-rose-500/10 z-0 transition-all" style={{ width: `${Math.random() * 60}%` }} />
                        </div>
                    ))}
                    {/* Repeat for density */}
                    {ASKS.slice().reverse().map((ask, i) => (
                        <div key={`d-${i}`} className="grid grid-cols-3 px-2 py-0.5 nexus-7:py-0 cursor-pointer hover:bg-white/5 relative group opacity-60">
                            <div className="text-rose-400 font-mono z-10">{(ask.price + 5).toLocaleString(undefined, { minimumFractionDigits: 1 })}</div>
                            <div className="text-right text-slate-300 font-mono z-10">{ask.amount.toFixed(3)}</div>
                            <div className="text-right text-slate-500 font-mono z-10">{ask.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                            <div className="absolute top-0 right-0 bottom-0 bg-rose-500/10 z-0 transition-all" style={{ width: `${Math.random() * 40}%` }} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Current Price Strip */}
            <div className="py-2 nexus-7:py-1 px-3 border-y border-white/5 bg-[#0b0e14] flex items-center justify-between shrink-0 my-0.5">
                <div className="flex items-center gap-2">
                    <span className={`text-lg nexus-7:text-sm font-bold font-mono ${price && price > 64230 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {price?.toLocaleString(undefined, { minimumFractionDigits: 1 }) || '---'}
                        <span className="text-lg nexus-7:text-sm opacity-0 font-sans">⬆</span>
                    </span>
                </div>
                <span className="text-slate-500 font-mono underline decoration-dotted underline-offset-2 hover:text-slate-300 cursor-pointer text-sm nexus-7:text-xs">
                    {price ? (price + 0.5).toLocaleString(undefined, { minimumFractionDigits: 1 }) : '--'}
                </span>
            </div>

            {/* Bids (Buys) - Green */}
            <div className="flex-1 overflow-hidden relative">
                <div className="w-full">
                    {BIDS.map((bid, i) => (
                        <div key={i} className="grid grid-cols-3 px-2 py-0.5 nexus-7:py-0 cursor-pointer hover:bg-white/5 relative group">
                            <div className="text-emerald-400 font-mono z-10">{bid.price.toLocaleString(undefined, { minimumFractionDigits: 1 })}</div>
                            <div className="text-right text-slate-300 font-mono z-10">{bid.amount.toFixed(3)}</div>
                            <div className="text-right text-slate-500 font-mono z-10">{bid.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                            <div className="absolute top-0 right-0 bottom-0 bg-emerald-500/10 z-0 transition-all" style={{ width: `${Math.random() * 60}%` }} />
                        </div>
                    ))}
                    {/* Repeat for density */}
                    {BIDS.map((bid, i) => (
                        <div key={`d-${i}`} className="grid grid-cols-3 px-2 py-0.5 nexus-7:py-0 cursor-pointer hover:bg-white/5 relative group opacity-60">
                            <div className="text-emerald-400 font-mono z-10">{(bid.price - 5).toLocaleString(undefined, { minimumFractionDigits: 1 })}</div>
                            <div className="text-right text-slate-300 font-mono z-10">{bid.amount.toFixed(3)}</div>
                            <div className="text-right text-slate-500 font-mono z-10">{bid.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                            <div className="absolute top-0 right-0 bottom-0 bg-emerald-500/10 z-0 transition-all" style={{ width: `${Math.random() * 40}%` }} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
