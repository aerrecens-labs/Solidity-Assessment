import React, { useState } from 'react'
import { useDashboardStore, OrderType } from '../../../store/dashboardStore'
import { Toast } from '../../common/Toast'
import { ChevronDown, HelpCircle, AlertCircle, ChevronsUpDown } from 'lucide-react'

// Reusable Input Component to match specific style
const TradeInput = ({
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
    </div>
)

export default function TradeForm({ type = 'SPOT', price }: { type?: 'SPOT' | 'FUTURES', price?: number }) {
    const { placeOrder, leverage } = useDashboardStore()
    const [side, setSide] = useState<'BUY' | 'SELL'>('BUY')

    // Order Types: LIMIT, MARKET, STOP_MARKET, STOP_LIMIT
    const [orderType, setOrderType] = useState('LIMIT')
    const [stopType, setStopType] = useState<'STOP_MARKET' | 'STOP_LIMIT' | null>(null)

    const [amount, setAmount] = useState('')
    const [orderPrice, setOrderPrice] = useState(price?.toString() || '')
    const [stopPrice, setStopPrice] = useState('')

    const [showTPSL, setShowTPSL] = useState(false)
    const [tpPrice, setTpPrice] = useState('')
    const [slPrice, setSlPrice] = useState('')

    const [toast, setToast] = useState({ show: false, message: '', type: 'success' as any })
    const [isMarginExpanded, setIsMarginExpanded] = useState(false)
    const [isFeesExpanded, setIsFeesExpanded] = useState(false)

    // Derived State
    const displayPrice = orderType === 'MARKET' ? 'Market' : orderPrice
    const marginRequired = amount && price ? (parseFloat(amount) * price / leverage).toFixed(4) : '0.0000'

    const handleTrade = () => {
        if (!amount || parseFloat(amount) <= 0) {
            setToast({ show: true, message: 'Please enter a valid amount', type: 'error' })
            return
        }

        placeOrder({
            side,
            type: (stopType || orderType) as OrderType,
            amount: parseFloat(amount),
            price: orderType === 'MARKET' ? undefined : parseFloat(orderPrice)
        })

        setToast({ show: true, message: `${side} Order Placed Successfully!`, type: 'success' })
        setAmount('')
    }

    return (
        <>
            <Toast
                isOpen={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, show: false })}
            />

            <div className="flex flex-col h-full bg-[#151926] font-sans">
                <div className="p-4 nexus-7:p-2 hd-720:p-4 space-y-5 nexus-7:space-y-2 hd-720:space-y-5">
                    {/* 1. ORDER TYPE TABS */}
                    <div className="flex items-center gap-6 nexus-7:gap-3 hd-720:gap-6 text-[11px] nexus-7:text-[9px] hd-720:text-[11px] font-bold text-slate-500 uppercase tracking-wide border-b border-white/5 pb-2 nexus-7:pb-1 hd-720:pb-2">
                        {['LIMIT', 'MARKET'].map(t => (
                            <button
                                key={t}
                                onClick={() => { setOrderType(t); setStopType(null); }}
                                className={`pb-1 border-b-2 transition-all ${orderType === t && !stopType ? 'text-white border-white' : 'border-transparent hover:text-slate-300'}`}
                            >
                                {t}
                            </button>
                        ))}

                        {/* More Dropdown for STOP */}
                        <div className="relative group">
                            <button
                                className={`flex items-center gap-1 pb-1 border-b-2 transition-all ${stopType ? 'text-white border-white' : 'border-transparent hover:text-slate-300'}`}
                            >
                                {stopType ? stopType.replace('_', ' ') : 'MORE'} <ChevronDown size={10} className="nexus-7:w-3 nexus-7:h-3 hd-720:w-4 hd-720:h-auto" />
                            </button>
                            {/* Dropdown Content */}
                            <div className="absolute top-full left-0 mt-1 w-28 bg-[#151926] border border-white/10 rounded shadow-xl hidden group-hover:block z-50">
                                <button onClick={() => { setOrderType('STOP'); setStopType('STOP_LIMIT'); }} className="w-full text-left px-3 py-2 text-[10px] text-slate-400 hover:text-white hover:bg-white/5">Stop Limit</button>
                                <button onClick={() => { setOrderType('STOP'); setStopType('STOP_MARKET'); }} className="w-full text-left px-3 py-2 text-[10px] text-slate-400 hover:text-white hover:bg-white/5">Stop Market</button>
                            </div>
                        </div>
                    </div>

                    {/* 2. AVBL BALANCE */}
                    <div className="flex justify-between text-[10px] nexus-7:text-[9px] hd-720:text-[10px] font-medium text-slate-500">
                        <span>Avbl. <span className="text-white font-mono">0.0000</span> USDT</span>
                        <span className="cursor-pointer hover:text-blue-400"><ChevronsUpDown size={10} className="inline nexus-7:w-2.5 nexus-7:h-2.5 hd-720:w-3 hd-720:h-auto" /></span>
                    </div>

                    {/* 3. PERCENTAGE GRID */}
                    <div className="grid grid-cols-4 gap-2 nexus-7:gap-1 hd-720:gap-2">
                        {['25%', '50%', '75%', '100%'].map(p => (
                            <button key={p} className="bg-[#0b0c10] border border-white/10 rounded py-1.5 nexus-7:py-1 hd-720:py-1.5 text-[10px] nexus-7:text-[8px] hd-720:text-[10px] text-slate-400 hover:border-slate-500 hover:text-white transition-colors">
                                {p}
                            </button>
                        ))}
                    </div>

                    {/* 4. DYNAMIC INPUTS */}
                    <div className="space-y-4 nexus-7:space-y-2 hd-720:space-y-4">

                        {/* STOP PRICE (Only for Stop orders) */}
                        {stopType && (
                            <TradeInput
                                label="Stop Price"
                                unit="USDT"
                                value={stopPrice}
                                onChange={(e) => setStopPrice(e.target.value)}
                                placeholder="Trigger Price"
                                icon={<ChevronsUpDown size={10} className="text-slate-500" />}
                            />
                        )}

                        {/* PRICE INPUT (Hidden for Market & Stop Market) */}
                        {orderType !== 'MARKET' && stopType !== 'STOP_MARKET' && (
                            <TradeInput
                                label="Price"
                                unit="USDT"
                                value={orderPrice}
                                onChange={(e) => setOrderPrice(e.target.value)}
                                placeholder={price?.toString()}
                                icon={<ChevronsUpDown size={10} className="text-slate-500" />}
                            />
                        )}

                        {/* QUANTITY INPUT (Always visible) */}
                        <div className="space-y-1">
                            <TradeInput
                                label="Quantity"
                                unit="BTC"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0"
                                icon={<ChevronsUpDown size={10} className="text-slate-500" />}
                            />
                            {/* Error / Warning Text */}
                            {amount && parseFloat(amount) > 1000 ? (
                                <div className="text-[10px] nexus-7:text-[8px] hd-720:text-[10px] text-rose-500 font-medium">Insufficient USDT balance.</div>
                            ) : (
                                <div className="text-[10px] nexus-7:text-[8px] hd-720:text-[10px] text-slate-600 font-medium">Min. Qty 0.002 BTC</div>
                            )}
                        </div>
                    </div>

                    {/* 5. TP/SL TOGGLE */}
                    <div className="space-y-3 nexus-7:space-y-1.5 hd-720:space-y-3">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowTPSL(!showTPSL)}>
                            <div className={`w-3 h-3 rounded-sm border ${showTPSL ? 'bg-white border-white' : 'border-slate-500'} flex items-center justify-center transition-colors`}>
                                {showTPSL && <ChevronDown size={10} className="text-black" />}
                            </div>
                            <span className="text-[11px] nexus-7:text-[9px] hd-720:text-[11px] font-bold text-slate-400">TP/SL</span>
                        </div>

                        {showTPSL && (
                            <div className="space-y-3 nexus-7:space-y-1.5 hd-720:space-y-3 pl-1 animate-in slide-in-from-top-2 duration-200">
                                <TradeInput
                                    label="Take Profit"
                                    unit="USDT"
                                    value={tpPrice}
                                    onChange={(e) => setTpPrice(e.target.value)}
                                    placeholder="0"
                                    icon={<ChevronsUpDown size={10} className="text-slate-500" />}
                                />
                                <TradeInput
                                    label="Stop Loss"
                                    unit="USDT"
                                    value={slPrice}
                                    onChange={(e) => setSlPrice(e.target.value)}
                                    placeholder="0"
                                    icon={<ChevronsUpDown size={10} className="text-slate-500" />}
                                />
                            </div>
                        )}
                    </div>

                    {/* 6. BIG ACTION BUTTONS */}
                    <div className="grid grid-cols-2 gap-3 nexus-7:gap-1.5 hd-720:gap-3 pt-2 nexus-7:pt-1 hd-720:pt-2">
                        <button
                            onClick={() => { setSide('BUY'); handleTrade(); }}
                            className="py-3.5 nexus-7:py-2 hd-720:py-3.5 rounded bg-[#26a17b] hover:bg-[#1f8b68] text-white text-[13px] nexus-7:text-[10px] hd-720:text-[13px] font-bold uppercase shadow-lg shadow-emerald-900/20 active:translate-y-0.5 transition-all flex flex-col items-center justify-center leading-tight"
                        >
                            <span>Buy/Long</span>
                        </button>
                        <button
                            onClick={() => { setSide('SELL'); handleTrade(); }}
                            className="py-3.5 nexus-7:py-2 hd-720:py-3.5 rounded bg-[#ef4444] hover:bg-[#dc2626] text-white text-[13px] nexus-7:text-[10px] hd-720:text-[13px] font-bold uppercase shadow-lg shadow-rose-900/20 active:translate-y-0.5 transition-all flex flex-col items-center justify-center leading-tight"
                        >
                            <span>Sell/Short</span>
                        </button>
                    </div>

                    {/* 7. MARGIN REQUIRED INFO */}
                    <div className="flex justify-between text-[10px] nexus-7:text-[8px] hd-720:text-[10px] text-slate-500 pt-1 font-medium">
                        <div className="flex flex-col gap-1">
                            <span>Buy Margin Required</span>
                            <span className="text-white font-mono text-xs nexus-7:text-[10px] hd-720:text-xs">{marginRequired} USDT</span>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span>Sell Margin Required</span>
                            <span className="text-white font-mono text-xs nexus-7:text-[10px] hd-720:text-xs">{marginRequired} USDT</span>
                        </div>
                    </div>
                </div>

                {/* 8. FUTURES FOOTER (Sticky) */}
                {type === 'FUTURES' && (
                    <div className="mt-auto border-t border-white/5 bg-[#13141b]">
                        {/* Margin Ratio Accordion */}
                        <div className="border-b border-white/5">
                            <button
                                onClick={() => setIsMarginExpanded(!isMarginExpanded)}
                                className="w-full p-3 nexus-7:p-2 flex items-center justify-between text-[11px] nexus-7:text-[9px] font-bold text-slate-400 hover:text-white transition-colors"
                            >
                                <span className="flex items-center gap-1">Margin Ratio <AlertCircle size={10} /></span>
                                <ChevronDown size={14} className={`transition-transform ${isMarginExpanded ? 'rotate-180' : ''}`} />
                            </button>
                            {isMarginExpanded && (
                                <div className="px-3 pb-3 space-y-2 text-[10px]">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Maintenance Margin</span>
                                        <span className="text-white font-mono">0.0000 USDT</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Margin Balance</span>
                                        <span className="text-white font-mono">0.0000 USDT</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Fees & Taxes Accordion */}
                        <div>
                            <button
                                onClick={() => setIsFeesExpanded(!isFeesExpanded)}
                                className="w-full p-3 nexus-7:p-2 flex items-center justify-between text-[11px] nexus-7:text-[9px] font-bold text-slate-400 hover:text-white transition-colors"
                            >
                                <span>Fees & Taxes</span>
                                <ChevronDown size={14} className={`transition-transform ${isFeesExpanded ? 'rotate-180' : ''}`} />
                            </button>
                            {isFeesExpanded && (
                                <div className="px-3 pb-3 space-y-2 text-[10px]">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Taker Fees</span>
                                        <span className="text-white font-mono">0.06%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Maker Fees</span>
                                        <span className="text-white font-mono">0.02%</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
