import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
    X, Info, ChevronRight, TrendingUp, TrendingDown,
    AlertCircle, CheckCircle, Wallet, ArrowLeftRight, Minimize2, Maximize2
} from 'lucide-react'
import {
    AreaChart, Area, XAxis, YAxis, Tooltip,
    ResponsiveContainer, ReferenceLine
} from 'recharts'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { useDashboardStore, OrderType } from '../../../store/dashboardStore'
import { investmentWallet } from '../../../state/investmentWallet'

// --- TYPES & INTERFACES -----------------------------------------------------

type OrderSide = 'BUY' | 'SELL'
type Timeframe = '1m' | '15m' | '1H' | '4H' | '1D' | '1W'

export interface AssetData {
    symbol: string
    name: string
    price: number
    change24h: number
    high24h: number
    low24h: number
    vol24h: string
    chartData?: number[]
}

interface QuickTradeModalProps {
    isOpen: boolean
    onClose: () => void
    asset: AssetData | null
}

interface ValidationResult {
    isValid: boolean
    message?: string
    level?: 'error' | 'warning'
}

// --- CONSTANTS --------------------------------------------------------------

const TIMEFRAMES: Timeframe[] = ['1m', '15m', '1H', '4H', '1D', '1W']
const TAKER_FEE_RATE = 0.001 // 0.1%
const MAKER_FEE_RATE = 0.0005 // 0.05%
const MIN_ORDER_VALUE = 10 // $10 USD

// --- HELPER HOOKS -----------------------------------------------------------

/**
 * Hook to handle "Drag to Change" numeric inputs.
 * Allows users to click and drag left/right on a pill to adjust values.
 */
function useDraggableInput(
    initialValue: number,
    step: number,
    onChange: (val: number) => void
) {
    const handleDrag = (_: any, info: PanInfo) => {
        // Sensitivity: 1 pixel = 1 step
        const delta = Math.round(info.offset.x / 5) * step
        const newValue = Math.max(0, initialValue + delta)
        onChange(Number(newValue.toFixed(6))) // Precision lock
    }
    return { handleDrag }
}

// --- MAIN COMPONENT ---------------------------------------------------------

export default function QuickTradeModal({ isOpen, onClose, asset }: QuickTradeModalProps) {
    const { placeOrder } = useDashboardStore()

    // --- GLOBAL STATE ---
    const [balance, setBalance] = useState(investmentWallet.getBalance())
    const [assetBalance, setAssetBalance] = useState(0) // Mock holding of the asset

    // --- FORM STATE ---
    const [side, setSide] = useState<OrderSide>('BUY')
    const [orderType, setOrderType] = useState<OrderType>('LIMIT')

    // Core Values
    const [price, setPrice] = useState<string>('')
    const [triggerPrice, setTriggerPrice] = useState<string>('') // For Stop Limit
    const [amount, setAmount] = useState<string>('')
    const [total, setTotal] = useState<string>('')

    // UI State
    const [sliderValue, setSliderValue] = useState(0)
    const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('1D')
    const [chartData, setChartData] = useState<{ time: number; price: number }[]>([])
    const [validation, setValidation] = useState<ValidationResult>({ isValid: true })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [isExpandedMobile, setIsExpandedMobile] = useState(false) // For mobile chart expansion

    // --- INITIALIZATION ---

    useEffect(() => {
        const unsub = investmentWallet.subscribe((bal) => {
            setBalance(bal)
            // Mock: Give user some random amount of this asset for selling testing
            if (asset) setAssetBalance(bal / 1000 / asset.price)
        })
        return unsub
    }, [asset])

    useEffect(() => {
        if (asset && isOpen) {
            setPrice(asset.price.toString())
            setTriggerPrice((asset.price * 1.05).toFixed(2)) // Default trigger 5% away
            setAmount('')
            setTotal('')
            setSliderValue(0)
            generateMockChartData(activeTimeframe)
        }
    }, [asset, isOpen])

    // --- LOGIC ENGINE -------------------------------------------------------

    // 1. Chart Data Generator
    const generateMockChartData = (tf: Timeframe) => {
        if (!asset) return
        const points = 100
        const volatility = tf === '1m' ? 0.001 : tf === '1W' ? 0.15 : 0.05
        let current = asset.price * 0.9 // Start slightly lower to show trend

        const data = Array.from({ length: points }, (_, i) => {
            const change = current * (Math.random() - 0.45) * volatility
            current += change
            return { time: i, price: current }
        })

        // Force the last point to match current price for visual continuity
        data[points - 1].price = asset.price
        setChartData(data)
    }

    // Change chart when timeframe changes
    useEffect(() => {
        generateMockChartData(activeTimeframe)
    }, [activeTimeframe])

    // 2. Calculation Engine (The "Brain")
    const calculateValues = (
        type: 'amount' | 'total' | 'slider',
        value: string | number
    ) => {
        const currentPrice = orderType === 'MARKET' ? asset?.price || 0 : parseFloat(price) || 0
        if (currentPrice === 0) return

        let newAmount = amount
        let newTotal = total
        let newSlider = sliderValue

        if (type === 'amount') {
            newAmount = value.toString()
            newTotal = (parseFloat(newAmount) * currentPrice).toFixed(2)
            // Update Slider position relative to max balance
            const maxAffordable = side === 'BUY' ? balance / currentPrice : assetBalance
            newSlider = maxAffordable > 0 ? (parseFloat(newAmount) / maxAffordable) * 100 : 0
        }
        else if (type === 'total') {
            newTotal = value.toString()
            newAmount = (parseFloat(newTotal) / currentPrice).toFixed(6)
            const maxTotal = side === 'BUY' ? balance : (assetBalance * currentPrice)
            newSlider = maxTotal > 0 ? (parseFloat(newTotal) / maxTotal) * 100 : 0
        }
        else if (type === 'slider') {
            newSlider = value as number
            const percent = newSlider / 100

            if (side === 'BUY') {
                const maxUsd = balance
                newTotal = (maxUsd * percent).toFixed(2)
                newAmount = (parseFloat(newTotal) / currentPrice).toFixed(6)
            } else {
                const maxAsset = assetBalance
                newAmount = (maxAsset * percent).toFixed(6)
                newTotal = (parseFloat(newAmount) * currentPrice).toFixed(2)
            }
        }

        setAmount(newAmount)
        setTotal(newTotal)
        setSliderValue(Math.min(100, Math.max(0, newSlider)))
        validateForm(newAmount, newTotal)
    }

    const handlePercentage = (pct: number) => calculateValues('slider', pct)

    // 3. Validation Engine
    const validateForm = (chkAmount: string, chkTotal: string) => {
        const numAmount = parseFloat(chkAmount)
        const numTotal = parseFloat(chkTotal)

        if (isNaN(numAmount) || numAmount <= 0) {
            setValidation({ isValid: false, message: 'Enter a valid amount' })
            return
        }

        if (numTotal < MIN_ORDER_VALUE) {
            setValidation({
                isValid: false,
                message: `Minimum order is $${MIN_ORDER_VALUE}`,
                level: 'warning'
            })
            return
        }

        if (side === 'BUY' && numTotal > balance) {
            setValidation({ isValid: false, message: 'Insufficient USD Balance', level: 'error' })
            return
        }

        if (side === 'SELL' && numAmount > assetBalance) {
            setValidation({ isValid: false, message: `Insufficient ${asset?.symbol} Balance`, level: 'error' })
            return
        }

        setValidation({ isValid: true })
    }

    // 4. Drag Handlers
    const { handleDrag: dragPrice } = useDraggableInput(parseFloat(price || '0'), 10, (v) => {
        setPrice(v.toString())
        // Recalculate totals based on new price
        if (amount) calculateValues('amount', amount)
    })

    const { handleDrag: dragAmount } = useDraggableInput(parseFloat(amount || '0'), 0.01, (v) => {
        calculateValues('amount', v)
    })

    // 5. Submission Handler
    const handleSubmit = async () => {
        if (!validation.isValid || !asset) return

        setIsSubmitting(true)

        // Simulate API Latency
        await new Promise(r => setTimeout(r, 800))

        placeOrder({
            side: side,
            type: orderType,
            amount: parseFloat(amount),
            price: parseFloat(price)
        })

        // Success Feedback
        setIsSubmitting(false)
        setShowSuccess(true)
        setTimeout(() => {
            setShowSuccess(false)
            onClose()
        }, 1500)
    }

    // --- RENDERERS ----------------------------------------------------------

    if (!asset) return null

    const estimatedFee = (parseFloat(total || '0') * (orderType === 'MARKET' ? TAKER_FEE_RATE : MAKER_FEE_RATE))

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Dark Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4"
                    />

                    {/* Main Modal */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 30 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed inset-0 m-auto z-[101] w-[95%] sm:w-full max-w-4xl h-[600px] bg-[#0b0e14] border border-white/10 sm:rounded-2xl rounded-xl shadow-2xl flex flex-col lg:flex-row overflow-hidden font-sans"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* === LEFT COLUMN: CHART & INFO === */}
                        <div className={`relative flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 bg-gradient-to-b from-[#0b0e14] to-[#0f1218] transition-all duration-300
                            ${isExpandedMobile ? 'h-[70vh]' : 'h-[35vh]'} lg:h-full lg:flex-[2.5] shrink-0`}
                        >
                            {/* Mobile Pull Handle */}
                            <div className="sm:hidden w-full flex justify-center pt-2 pb-1" onClick={() => setIsExpandedMobile(!isExpandedMobile)}>
                                <div className="w-12 h-1.5 bg-white/10 rounded-full" />
                            </div>

                            {/* Asset Header */}
                            <div className="p-6 border-b border-white/5 flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-12 h-12 rounded-xl bg-[#1e2330] flex items-center justify-center text-xl font-bold text-white shadow-inner">
                                            {asset.symbol[0]}
                                        </div>
                                        <div>
                                            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                                                {asset.name}
                                                <span className="text-slate-500 text-sm font-medium bg-white/5 px-2 py-0.5 rounded">
                                                    {asset.symbol}/USD
                                                </span>
                                            </h1>
                                            <div className="flex items-center gap-4 text-sm mt-1">
                                                <span className="text-slate-400">Vol: {asset.vol24h}</span>
                                                <span className="text-slate-400">High: {asset.high24h}</span>
                                                <span className="text-slate-400">Low: {asset.low24h}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-mono font-bold text-white">
                                        ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </div>
                                    <div className={`flex items-center justify-end gap-1 font-bold mt-1 ${asset.change24h >= 0 ? 'text-[#00ff9d]' : 'text-rose-500'}`}>
                                        {asset.change24h >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                        {asset.change24h > 0 ? '+' : ''}{asset.change24h}%
                                    </div>
                                </div>
                            </div>

                            {/* Chart Controls */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0f1218]">
                                <div className="flex bg-[#1e2330] rounded-lg p-1">
                                    {TIMEFRAMES.map((tf) => (
                                        <button
                                            key={tf}
                                            onClick={() => setActiveTimeframe(tf)}
                                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeTimeframe === tf
                                                ? 'bg-[#3b82f6] text-white shadow-lg'
                                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            {tf}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-xs text-slate-500 hidden sm:flex gap-4">
                                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#00ff9d]" /> Support</span>
                                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500" /> Resistance</span>
                                    </div>
                                    {/* Mobile Expand Toggle */}
                                    <button
                                        onClick={() => setIsExpandedMobile(!isExpandedMobile)}
                                        className="sm:hidden p-1.5 text-slate-400 hover:text-white bg-[#1e2330] rounded ml-2"
                                    >
                                        {isExpandedMobile ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                                    </button>
                                </div>
                            </div>

                            {/* Chart Visualization */}
                            <div className="flex-1 relative w-full h-full p-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor={asset.change24h >= 0 ? "#00ff9d" : "#f43f5e"} stopOpacity={0.2} />
                                                <stop offset="100%" stopColor={asset.change24h >= 0 ? "#00ff9d" : "#f43f5e"} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="time" hide />
                                        <YAxis domain={['auto', 'auto']} hide />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1e2330',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                                            }}
                                            itemStyle={{ color: '#fff', fontWeight: 'bold', fontFamily: 'monospace' }}
                                            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                                            labelStyle={{ display: 'none' }}
                                        />
                                        <ReferenceLine y={asset.price} stroke="#ffffff30" strokeDasharray="3 3" />
                                        <Area
                                            type="monotone"
                                            dataKey="price"
                                            stroke={asset.change24h >= 0 ? "#00ff9d" : "#f43f5e"}
                                            strokeWidth={2}
                                            fill="url(#chartFill)"
                                            animationDuration={1000}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>

                                {/* Floating Order Lines Mockup */}
                                {orderType === 'LIMIT' && price && (
                                    <div
                                        className="absolute left-0 right-0 border-t border-dashed border-blue-500 flex justify-between px-2 text-[10px] text-blue-400"
                                        style={{ top: '40%' }} // Mock position
                                    >
                                        <span>Limit Order</span>
                                        <span>${price}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* === RIGHT COLUMN: TRADE FORM === */}
                        <div className="flex-[1.2] bg-[#11141d] p-6 flex flex-col relative h-full justify-between overflow-hidden">

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-20 p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>

                            {/* Header (Fixed Top) */}
                            <div className="mb-4 shrink-0">
                                <h2 className="text-xl font-bold text-white mb-1">Place Order</h2>
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <Wallet size={14} />
                                    <span>Avail:</span>
                                    <span className="text-white font-mono font-bold">
                                        {side === 'BUY'
                                            ? `$${balance.toLocaleString()}`
                                            : `${assetBalance.toFixed(4)} ${asset.symbol.split('/')[0]}`
                                        }
                                    </span>
                                </div>
                            </div>

                            {/* Scrollable Content Area */}
                            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar -mr-4 pr-4 flex flex-col gap-4">

                                {/* 1. Side Toggle */}
                                <div className="flex p-1 bg-[#0b0e14] rounded-xl border border-white/5 relative shrink-0">
                                    <motion.div
                                        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-[10px] shadow-lg ${side === 'BUY' ? 'bg-[#00c087] left-1' : 'bg-[#ff3b30] left-[calc(50%+1px)]'}`}
                                        layoutId="sidePill"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                    <button
                                        onClick={() => setSide('BUY')}
                                        className={`flex-1 relative z-10 py-2.5 text-sm font-bold transition-colors ${side === 'BUY' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        BUY
                                    </button>
                                    <button
                                        onClick={() => setSide('SELL')}
                                        className={`flex-1 relative z-10 py-2.5 text-sm font-bold transition-colors ${side === 'SELL' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        SELL
                                    </button>
                                </div>

                                {/* 2. Order Type Tabs */}
                                <div className="flex gap-6 border-b border-white/5 px-1 shrink-0">
                                    {['LIMIT', 'MARKET', 'STOP_LIMIT'].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setOrderType(type as OrderType)}
                                            className={`pb-3 text-xs font-bold uppercase tracking-wider relative transition-colors ${orderType === type ? 'text-[#3b82f6]' : 'text-slate-500 hover:text-slate-300'
                                                }`}
                                        >
                                            {type.replace('_', ' ')}
                                            {orderType === type && (
                                                <motion.div
                                                    layoutId="activeTab"
                                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3b82f6]"
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* 3. Inputs Group */}
                                <div className="space-y-3 pb-2">

                                    {/* Trigger Price (Only for Stop Limit) */}
                                    {orderType === 'STOP_LIMIT' && (
                                        <div className="space-y-1.5 shrink-0">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Trigger Price</label>
                                            <div className="bg-[#0b0e14] border border-white/10 rounded-xl px-4 py-3 flex items-center group focus-within:border-[#3b82f6] transition-colors">
                                                <input
                                                    type="number"
                                                    value={triggerPrice}
                                                    onChange={(e) => setTriggerPrice(e.target.value)}
                                                    className="bg-transparent text-white font-mono text-sm w-full focus:outline-none placeholder-slate-700"
                                                    placeholder="0.00"
                                                />
                                                <span className="text-xs font-bold text-slate-500">USD</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Price Input */}
                                    <div className="space-y-1.5 shrink-0">
                                        <div className="flex justify-between">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Price</label>
                                            {orderType === 'MARKET' && <span className="text-[10px] text-[#00ff9d] font-bold uppercase">Best Market Price</span>}
                                        </div>

                                        <div className={`bg-[#0b0e14] border rounded-xl px-4 py-3 flex items-center transition-colors relative group/input ${orderType === 'MARKET' ? 'border-white/5 opacity-50 cursor-not-allowed' : 'border-white/10 focus-within:border-[#3b82f6]'}`}>
                                            <input
                                                type="number"
                                                value={orderType === 'MARKET' ? asset.price : price}
                                                onChange={(e) => {
                                                    setPrice(e.target.value)
                                                    if (amount) calculateValues('amount', amount)
                                                }}
                                                disabled={orderType === 'MARKET'}
                                                className="bg-transparent text-white font-mono text-sm w-full focus:outline-none disabled:cursor-not-allowed placeholder-slate-700"
                                                placeholder="0.00"
                                            />
                                            <span className="text-xs font-bold text-slate-500">{asset.symbol.split('/')[1] || 'USD'}</span>

                                            {/* Drag Badge - Hover Only */}
                                            {orderType !== 'MARKET' && (
                                                <motion.div
                                                    onPan={dragPrice}
                                                    drag="y"
                                                    dragConstraints={{ top: 0, bottom: 0 }}
                                                    dragElastic={0}
                                                    dragMomentum={false}
                                                    className="absolute -top-2.5 right-3 bg-[#3b82f6] text-white text-[9px] font-bold px-2 py-0.5 rounded-full cursor-ns-resize cursor-pointer opacity-0 group-hover/input:opacity-100 transition-opacity z-10 select-none shadow-lg flex items-center gap-1"
                                                >
                                                    <ArrowLeftRight size={10} className="rotate-90" /> DRAG
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Amount Input */}
                                    <div className="space-y-1.5 shrink-0">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Amount</label>
                                        <div className="bg-[#0b0e14] border border-white/10 rounded-xl px-4 py-3 flex items-center group/input focus-within:border-[#3b82f6] transition-colors relative">
                                            <input
                                                type="number"
                                                value={amount}
                                                onChange={(e) => calculateValues('amount', e.target.value)}
                                                className="bg-transparent text-white font-mono text-sm w-full focus:outline-none placeholder-slate-700"
                                                placeholder="0.00"
                                            />
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handlePercentage(100)}
                                                    className="text-[10px] font-bold text-[#3b82f6] bg-[#3b82f6]/10 hover:bg-[#3b82f6]/20 px-1.5 py-0.5 rounded opacity-0 group-hover/input:opacity-100 transition-opacity"
                                                >
                                                    MAX
                                                </button>
                                                <span className="text-xs font-bold text-slate-500">{asset.symbol.split('/')[0]}</span>
                                            </div>

                                            {/* Drag Badge - Hover Only */}
                                            <motion.div
                                                onPan={dragAmount}
                                                drag="x"
                                                dragConstraints={{ left: 0, right: 0 }}
                                                dragElastic={0}
                                                dragMomentum={false}
                                                className="absolute -top-2.5 right-3 bg-[#3b82f6] text-white text-[9px] font-bold px-2 py-0.5 rounded-full cursor-ew-resize cursor-pointer opacity-0 group-hover/input:opacity-100 transition-opacity z-10 select-none shadow-lg flex items-center gap-1"
                                            >
                                                <ArrowLeftRight size={10} /> DRAG
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* Slider */}
                                    <div className="py-2 px-1 shrink-0 relative group">
                                        <div className="h-1.5 bg-[#1e2330] rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-[#3b82f6]"
                                                style={{ width: `${sliderValue}%` }}
                                            />
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={sliderValue}
                                            onChange={(e) => calculateValues('slider', parseFloat(e.target.value))}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        {/* Hover Tooltip */}
                                        <div
                                            className="absolute -top-6 -translate-x-1/2 bg-[#3b82f6] text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold pointer-events-none shadow-lg"
                                            style={{ left: `${sliderValue}%` }}
                                        >
                                            {sliderValue.toFixed(0)}%
                                        </div>
                                    </div>

                                    {/* Total Cost Input */}
                                    <div className="space-y-1.5 shrink-0">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Total Cost</label>
                                        <div className="bg-[#0b0e14] border border-white/10 rounded-xl px-4 py-3 flex items-center focus-within:border-[#3b82f6] transition-colors">
                                            <input
                                                type="number"
                                                value={total}
                                                onChange={(e) => calculateValues('total', e.target.value)}
                                                className="bg-transparent text-white font-mono text-sm w-full focus:outline-none placeholder-slate-700"
                                                placeholder="0.00"
                                            />
                                            <span className="text-xs font-bold text-slate-500">USD</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Info (Fixed Bottom) */}
                            <div className="mt-4 pt-4 border-t border-white/5 space-y-3 shrink-0">
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>Est. Fee ({orderType === 'MARKET' ? 'Taker' : 'Maker'})</span>
                                    <span className="font-mono text-slate-300">${estimatedFee.toFixed(4)}</span>
                                </div>
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>Total (Inc. Fees)</span>
                                    <span className="font-mono text-white font-bold">${(parseFloat(total || '0') + estimatedFee).toFixed(2)}</span>
                                </div>

                                {/* Error Message */}
                                <AnimatePresence>
                                    {!validation.isValid && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className={`text-xs flex items-center gap-2 p-2 rounded-lg bg-opacity-10 ${validation.level === 'warning' ? 'text-yellow-500 bg-yellow-500' : 'text-rose-500 bg-rose-500'}`}
                                        >
                                            <AlertCircle size={14} />
                                            {validation.message}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* ACTION BUTTON */}
                                <button
                                    onClick={handleSubmit}
                                    disabled={!validation.isValid || isSubmitting}
                                    className={`w-full py-4 rounded-xl font-bold text-base text-white shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden
                                        ${side === 'BUY'
                                            ? 'bg-gradient-to-r from-[#00c087] to-[#00a372] shadow-[#00c087]/20'
                                            : 'bg-gradient-to-r from-[#ff3b30] to-[#d63026] shadow-[#ff3b30]/20'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : showSuccess ? (
                                        <span className="flex items-center gap-2">Success <CheckCircle size={20} /></span>
                                    ) : (
                                        <span>{side} {asset.symbol.split('/')[0]}</span>
                                    )}
                                </button>
                            </div>
                        </div>

                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
