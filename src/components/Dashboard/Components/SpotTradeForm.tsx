import React, { useState } from 'react'
import { ChevronDown, Info, ChevronsUpDown } from 'lucide-react'
import { useDashboardStore } from '../../../store/dashboardStore'

// Reusable Input Component (Shared Style)
const SpotInput = ({
    label,
    unit,
    value,
    onChange,
    placeholder,
    type = "number",
    icon
}: {
    label: string,
    unit: string,
    value?: string | number,
    onChange?: (e: any) => void,
    placeholder?: string,
    type?: string,
    icon?: React.ReactNode
}) => (
    <div className="flex items-center relative bg-[#0b0c10] hover:bg-[#151926] border border-white/10 rounded-md px-3 h-10 nexus-7:h-7 focus-within:border-blue-500 focus-within:bg-[#151926] transition-all group">
        {/* Label */}
        <div className="flex items-center gap-1 shrink-0 mr-2">
            <span className="text-[11px] nexus-7:text-[9px] font-bold text-slate-400 group-focus-within:text-blue-400 transition-colors">{label}</span>
            {icon && <span className="opacity-50">{icon}</span>}
        </div>

        {/* Input */}
        <input
            type={type}
            value={value}
            onChange={onChange}
            className="flex-1 bg-transparent text-right outline-none text-sm nexus-7:text-[10px] font-bold text-white font-mono placeholder-slate-700 w-full h-full"
            placeholder={placeholder}
        />

        {/* Unit */}
        <div className="ml-2 shrink-0">
            <span className="text-[10px] nexus-7:text-[8px] font-bold text-slate-500">{unit}</span>
        </div>

        {/* Spinners removal hack for number inputs if needed, usually handled by CSS globally or type="text" with regex */}
    </div>
)

export default function SpotTradeForm({ price }: { price?: number }) {
    const { placeOrder, wallet, activePair } = useDashboardStore()
    const [side, setSide] = useState<'BUY' | 'SELL'>('BUY')
    const [orderType, setOrderType] = useState('LIMIT') // LIMIT, MARKET
    const [stopType, setStopType] = useState<'STOP_LIMIT' | 'STOP_MARKET' | null>(null)

    // Derived Asset Info
    // activePair is e.g. "BTC/USDT" or "BTC/USD"
    const [baseAsset, quoteAssetRaw] = (activePair || 'BTC/USDT').split('/')
    const quoteAsset = quoteAssetRaw === 'USDT' ? 'usdt' : 'usd'

    // Form State
    const [amount, setAmount] = useState('')
    const [orderPrice, setOrderPrice] = useState(price?.toString() || '')
    const [stopPrice, setStopPrice] = useState('')
    const [total, setTotal] = useState('')

    // Derived State
    const activeBalance = side === 'BUY' ? wallet[quoteAsset]?.available : wallet.btc?.available
    const balanceSymbol = side === 'BUY' ? quoteAsset.toUpperCase() : 'BTC'
    const currentPrice = Number(orderPrice) || price || 0

    // Handlers
    const handleAmountChange = (val: string) => {
        setAmount(val)
        if (currentPrice > 0) {
            setTotal((Number(val) * currentPrice).toFixed(2))
        }
    }

    const handleTotalChange = (val: string) => {
        setTotal(val)
        if (currentPrice > 0) {
            setAmount((Number(val) / currentPrice).toFixed(6))
        }
    }

    const handlePriceChange = (val: string) => {
        setOrderPrice(val)
        if (amount && Number(val) > 0) {
            setTotal((Number(amount) * Number(val)).toFixed(2))
        }
    }

    const handlePercentage = (pct: number) => {
        if (!activeBalance) return

        if (side === 'BUY') {
            // For Buy, we use Total (USD)
            const tradeValue = activeBalance * pct
            setTotal(tradeValue.toFixed(2))
            if (currentPrice > 0) {
                setAmount((tradeValue / currentPrice).toFixed(6))
            }
        } else {
            // For Sell, we use Amount (BTC)
            const tradeAmount = activeBalance * pct
            setAmount(tradeAmount.toFixed(6))
            if (currentPrice > 0) {
                setTotal((tradeAmount * currentPrice).toFixed(2))
            }
        }
    }

    const handleTrade = () => {
        console.log(`Placed ${side} Order: ${amount} BTC @ ${orderPrice} USD`)
        // Reset
        setAmount('')
        setTotal('')
        placeOrder({
            side,
            type: (orderType === 'STOP' ? (stopType === 'STOP_MARKET' ? 'MARKET' : 'STOP_LIMIT') : orderType) as any,
            price: Number(orderPrice),
            amount: Number(amount)
        })
    }

    return (
        <div className="flex flex-col h-full bg-[#151926] font-sans">
            {/* Header */}
            <div className="p-3 border-b border-white/5 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-300">Spot Trade</span>
                <div className="flex gap-2">
                    <button className="p-1 hover:bg-white/5 rounded text-slate-500"><Info size={12} /></button>
                </div>
            </div>

            <div className="p-4 nexus-7:p-2 hd-720:p-4 space-y-4 nexus-7:space-y-2 hd-720:space-y-4">
                {/* Buy/Sell Tabs */}
                <div className="flex bg-[#0b0c10] p-0.5 rounded-lg">
                    <button
                        onClick={() => setSide('BUY')}
                        className={`flex-1 py-3 nexus-7:py-1.5 hd-720:py-3 rounded-md text-[13px] nexus-7:text-[10px] hd-720:text-[13px] font-bold transition-all uppercase tracking-wide
                        ${side === 'BUY' ? 'bg-[#26a17b] text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        BUY
                    </button>
                    <button
                        onClick={() => setSide('SELL')}
                        className={`flex-1 py-3 nexus-7:py-1.5 hd-720:py-3 rounded-md text-[13px] nexus-7:text-[10px] hd-720:text-[13px] font-bold transition-all uppercase tracking-wide
                        ${side === 'SELL' ? 'bg-[#ef4444] text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        SELL
                    </button>
                </div>

                {/* Sub Tabs */}
                <div className="flex items-center gap-4 nexus-7:gap-2 hd-720:gap-4 text-[12px] nexus-7:text-[9px] hd-720:text-[12px] font-bold text-slate-500 uppercase tracking-wide border-b border-white/5 pb-2 nexus-7:pb-1 hd-720:pb-2">
                    {['LIMIT', 'MARKET'].map(t => (
                        <button
                            key={t}
                            onClick={() => { setOrderType(t); setStopType(null); }}
                            className={`pb-2 nexus-7:pb-1 hd-720:pb-2 border-b-2 transition-all ${orderType === t && !stopType ? 'text-white border-white' : 'border-transparent hover:text-slate-300'}`}
                        >
                            {t}
                        </button>
                    ))}
                    {/* More Dropdown for STOP */}
                    <div className="relative group ml-auto">
                        <button
                            className={`flex items-center gap-1 pb-2 nexus-7:pb-1 hd-720:pb-2 border-b-2 transition-all ${stopType ? 'text-white border-white' : 'border-transparent hover:text-slate-300'}`}
                        >
                            {stopType ? stopType.replace('_', ' ') : 'STOP'} <ChevronDown size={12} className="nexus-7:w-3 nexus-7:h-3 hd-720:w-4 hd-720:h-4" />
                        </button>
                        <div className="absolute top-full right-0 mt-1 w-28 bg-[#151926] border border-white/10 rounded shadow-xl hidden group-hover:block z-50">
                            <button onClick={() => { setOrderType('STOP'); setStopType('STOP_LIMIT'); }} className="w-full text-left px-3 py-2 text-[10px] text-slate-400 hover:text-white hover:bg-white/5">Stop Limit</button>
                            <button onClick={() => { setOrderType('STOP'); setStopType('STOP_MARKET'); }} className="w-full text-left px-3 py-2 text-[10px] text-slate-400 hover:text-white hover:bg-white/5">Stop Market</button>
                        </div>
                    </div>
                </div>

                {/* Avbl Balance */}
                <div className="flex justify-between text-[11px] nexus-7:text-[9px] hd-720:text-[11px] font-bold text-slate-500">
                    <span>Avbl.</span>
                    <span className="text-white">{activeBalance?.toFixed(side === 'BUY' ? 2 : 6)} {balanceSymbol}</span>
                </div>

                {/* Percentages */}
                <div className="grid grid-cols-4 gap-2 nexus-7:gap-1 hd-720:gap-2">
                    {[0.25, 0.50, 0.75, 1].map(p => (
                        <button
                            key={p}
                            onClick={() => handlePercentage(p)}
                            className="bg-[#0b0c10] border border-white/10 rounded py-2 nexus-7:py-1 hd-720:py-2 text-[10px] nexus-7:text-[8px] hd-720:text-[10px] text-slate-400 hover:border-slate-500 hover:text-white transition-colors"
                        >
                            {p * 100}%
                        </button>
                    ))}
                </div>

                {/* Inputs */}
                <div className="space-y-4 nexus-7:space-y-2 hd-720:space-y-4">
                    {/* STOP PRICE (Only for Stop orders) */}
                    {stopType && (
                        <SpotInput
                            label="Stop Price"
                            unit="USD"
                            value={stopPrice}
                            onChange={(e) => setStopPrice(e.target.value)}
                            placeholder="Trigger Price"
                            icon={<ChevronsUpDown size={10} className="text-slate-500" />}
                        />
                    )}

                    {/* PRICE INPUT (Hidden for Market & Stop Market) */}
                    {orderType !== 'MARKET' && stopType !== 'STOP_MARKET' && (
                        <SpotInput
                            label="Price"
                            unit="USD"
                            value={orderPrice}
                            onChange={(e) => handlePriceChange(e.target.value)}
                            placeholder={price?.toString()}
                            icon={<ChevronsUpDown size={10} className="text-slate-500" />}
                        />
                    )}

                    {/* AMOUNT INPUT */}
                    <SpotInput
                        label="Amount"
                        unit="BTC"
                        value={amount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        placeholder="0.00"
                        icon={<ChevronsUpDown size={10} className="text-slate-500" />}
                    />

                    {/* TOTAL INPUT */}
                    <SpotInput
                        label="Total"
                        unit="USD"
                        value={total}
                        onChange={(e) => handleTotalChange(e.target.value)}
                        placeholder="0.00"
                        icon={<ChevronsUpDown size={10} className="text-slate-500" />}
                    />
                </div>

                {/* Big Button */}
                <button
                    onClick={handleTrade}
                    className={`w-full py-3.5 nexus-7:py-2 hd-720:py-3.5 rounded-lg font-bold text-[13px] nexus-7:text-[10px] hd-720:text-[13px] text-white shadow-xl mt-4 active:scale-95 transition-all uppercase
                    ${side === 'BUY' ? 'bg-[#26a17b] hover:bg-[#1f8b68] shadow-emerald-900/20' : 'bg-[#ef4444] hover:bg-[#dc2626] shadow-rose-900/20'}
                `}>
                    {side} BTC
                </button>

                {/* Footer Fees */}
                <div className="flex items-center justify-between border-t border-white/5 pt-4 nexus-7:pt-2 mt-2">
                    <span className="text-[10px] nexus-7:text-[8px] font-bold text-slate-500">Fees & TDS</span>
                    <span className="px-2 py-0.5 bg-[#EAB308]/20 text-[#EAB308] text-[9px] nexus-7:text-[7px] font-bold rounded uppercase border border-[#EAB308]/30">Regular</span>
                </div>
            </div>
        </div>
    )
}
