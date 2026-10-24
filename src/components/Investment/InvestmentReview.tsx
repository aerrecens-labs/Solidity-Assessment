import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle, AlertCircle, ArrowRight, ShieldCheck,
    PieChart, TrendingUp, Info, User, Layers, Activity
} from 'lucide-react';
import { formatUSD } from '../../utils/format';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getPerformanceData, getHoldingsForType, getRandomManager } from '../../data/mockDataEngine';

interface InvestmentReviewProps {
    selectedOption: any;
    amount: number;
    onConfirm?: () => void;
    onBack?: () => void;
    isViewMode?: boolean;
    currentValue?: number;
    onBuyMore?: () => void;
    onSell?: (amount?: number) => void;
}

const InvestmentReview: React.FC<InvestmentReviewProps> = ({
    selectedOption,
    amount,
    onConfirm,
    onBack,
    isViewMode = false,
    currentValue,
    onBuyMore,
    onSell
}) => {
    const [timeRange, setTimeRange] = useState('1Y');
    const [activeTab, setActiveTab] = useState('overview'); // overview, holdings, manager
    const [isSellMode, setIsSellMode] = useState(false);
    const [sellAmountStr, setSellAmountStr] = useState(amount.toString());
    const sellAmount = parseFloat(sellAmountStr) || 0;

    // Update sellAmount if amount prop changes
    React.useEffect(() => {
        setSellAmountStr(amount.toString());
    }, [amount]);

    // Memoize random data so it doesn't change on re-renders unless option changes
    const performanceData = useMemo(() => getPerformanceData(1000, 0.15), []);
    const holdingsData = useMemo(() => getHoldingsForType(selectedOption.type), [selectedOption.type]);
    const manager = useMemo(() => getRandomManager(), []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-8 max-w-5xl mx-auto"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold uppercase rounded-full tracking-wider border border-blue-500/30">
                            {selectedOption.type || 'DeFi & Yield Farming'}
                        </span>
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold uppercase rounded-full tracking-wider border border-green-500/30">
                            {selectedOption.riskLevel || 'Low Risk'}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{selectedOption.name}</h1>
                    <p className="text-gray-400 max-w-2xl">
                        Start earning passive income with a diversified portfolio of high-performing DeFi protocols.
                        Automated rebalancing and yield optimization included.
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-400 mb-1">Current APY</div>
                    <div className="text-4xl font-bold text-green-400">{selectedOption.apy}%</div>
                    {selectedOption.startDate && (
                        <div className="text-xs text-slate-500 mt-2 font-medium flex items-center justify-end gap-1">
                            <span>Purchased:</span>
                            <span className="text-slate-300">
                                {new Date(selectedOption.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                <span className="mx-1">•</span>
                                {new Date(selectedOption.startDate).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Performance Chart Card */}
                    <div className="card-base p-6 rounded-2xl bg-[#1b1f4a]/50 border border-white/5 backdrop-blur-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <TrendingUp size={20} className="text-blue-400" />
                                Fund Performance
                            </h3>
                            <div className="flex gap-2">
                                {['1M', '6M', '1Y', 'ALL'].map((range) => (
                                    <button
                                        key={range}
                                        onClick={() => setTimeRange(range)}
                                        className={`px-3 py-1 text-xs rounded-lg transition-all ${timeRange === range
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                            }`}
                                    >
                                        {range}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={performanceData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#3b82f6"
                                        fillOpacity={1}
                                        fill="url(#colorValue)"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 flex gap-8 border-t border-white/5 pt-4">
                            <div>
                                <div className="text-xs text-gray-500 mb-1">1 Month</div>
                                <div className="text-emerald-400 font-bold">+2.3%</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 mb-1">6 Months</div>
                                <div className="text-emerald-400 font-bold">+12.4%</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 mb-1">1 Year</div>
                                <div className="text-emerald-400 font-bold">+15.2%</div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Section */}
                    <div className="card-base p-6 rounded-2xl bg-[#1b1f4a]/50 border border-white/5 backdrop-blur-sm">
                        <div className="flex gap-6 border-b border-white/10 mb-6">
                            {['overview', 'holdings', 'manager'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-3 text-sm font-medium capitalize border-b-2 transition-all ${activeTab === tab
                                        ? 'border-blue-500 text-blue-400'
                                        : 'border-transparent text-gray-500 hover:text-gray-300'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="p-4 rounded-xl bg-white/5">
                                        <div className="text-xs text-gray-500 mb-1">Fund Size</div>
                                        <div className="text-white font-mono font-bold">$1.25B</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white/5">
                                        <div className="text-xs text-gray-500 mb-1">Volatilty</div>
                                        <div className="text-green-400 font-bold">Low</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white/5">
                                        <div className="text-xs text-gray-500 mb-1">Expense Ratio</div>
                                        <div className="text-white font-bold">0.85%</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white/5">
                                        <div className="text-xs text-gray-500 mb-1">Liquidity</div>
                                        <div className="text-white font-bold">Daily</div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-white font-medium mb-2">Strategy</h4>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        The fund seeks to generate optimized yield by strategically allocating capital across high-performing
                                        DeFi protocols, including liquidity provision, lending, and yield farming strategies while maintaining
                                        risk-adjusted returns.
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'holdings' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-white/5 text-gray-400 text-xs uppercase">
                                        <tr>
                                            <th className="p-3 rounded-l-lg">Position</th>
                                            <th className="p-3">Protocol</th>
                                            <th className="p-3">Type</th>
                                            <th className="p-3 text-right rounded-r-lg">Allc.</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {holdingsData.map((item, idx) => (
                                            <tr key={idx} className="border-b border-white/5">
                                                <td className="p-3 text-white font-medium">{item.name}</td>
                                                <td className="p-3 text-gray-400">{item.name.split(' ')[0]}</td>
                                                <td className="p-3 text-blue-300 bg-blue-500/5 rounded-md text-xs w-fit">
                                                    <span className="px-2 py-1 bg-blue-500/10 rounded">{item.type}</span>
                                                </td>
                                                <td className="p-3 text-right text-white font-mono">{item.allocation}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'manager' && (
                            <div className="flex items-start gap-6">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                    {manager.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white">{manager.name}</h4>
                                    <p className="text-blue-400 text-sm mb-2">{manager.role}</p>
                                    <div className="flex gap-4 text-sm text-gray-400 mb-4">
                                        <span>{manager.exp}</span>
                                        <span>•</span>
                                        <span>Stanford CS</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center p-3 bg-white/5 rounded-lg">
                                            <div className="text-xs text-gray-500">Funds</div>
                                            <div className="font-bold text-white">12</div>
                                        </div>
                                        <div className="text-center p-3 bg-white/5 rounded-lg">
                                            <div className="text-xs text-gray-500">AUM</div>
                                            <div className="font-bold text-white">{manager.aum}</div>
                                        </div>
                                        <div className="text-center p-3 bg-white/5 rounded-lg">
                                            <div className="text-xs text-gray-500">Return</div>
                                            <div className="font-bold text-green-400">{manager.return}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Sticky Action Card */}
                <div className="lg:col-span-1">
                    <div id="tour-invest-card" className="sticky top-6 card-base p-6 rounded-2xl bg-[#1b1f4a]/50 border border-white/5 backdrop-blur-sm shadow-xl">

                        {isViewMode ? (
                            // VIEW MODE: Active Investment Details
                            isSellMode ? (
                                // SELL CONFIRMATION MODE
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <h3 className="text-white font-bold text-lg mb-2 text-red-400">Confirm Sale</h3>
                                    <p className="text-sm text-gray-400 mb-6">
                                        Configure the amount you wish to sell from your <span className="text-white font-bold">{selectedOption.name}</span> position.
                                    </p>

                                    {/* Partial Sell Controls */}
                                    <div className="mb-6 space-y-3">
                                        <div className="flex justify-between text-xs text-gray-400 uppercase tracking-wider font-bold">
                                            <span>Sell Amount</span>
                                            <span>Max: {formatUSD(amount)}</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="relative flex-1">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                                <input
                                                    type="text"
                                                    value={sellAmountStr}
                                                    onChange={(e) => {
                                                        let val = e.target.value;

                                                        // 1. Allow clearing the input completely
                                                        if (val === '') {
                                                            setSellAmountStr('');
                                                            return;
                                                        }

                                                        // 2. Simple numeric check (regex for positive decimal)
                                                        if (!/^\d*\.?\d*$/.test(val)) return;

                                                        // 3. Strip leading zero (e.g. "05" -> "5") unless it's "0."
                                                        if (val.length > 1 && val.startsWith('0') && val[1] !== '.') {
                                                            val = val.substring(1);
                                                        }

                                                        // 4. Update state if within bounds
                                                        const numVal = parseFloat(val);
                                                        // Note: We check <= amount. We check isNaN only if val is not empty/dot, but regex handles that mostly.
                                                        // Actually, just set it if it parses reasonably or is just a dot (handled by regex)
                                                        if (!isNaN(numVal) && numVal <= amount) {
                                                            setSellAmountStr(val);
                                                        }
                                                    }}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-white font-mono focus:outline-none focus:border-red-500/50 transition-colors"
                                                />
                                            </div>
                                            <button
                                                onClick={() => setSellAmountStr(amount.toString())}
                                                className="px-3 py-3 bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 rounded-xl border border-white/10 transition-colors"
                                            >
                                                MAX
                                            </button>
                                        </div>

                                        <div className="flex gap-2">
                                            {[0.25, 0.5, 0.75].map((pct) => (
                                                <button
                                                    key={pct}
                                                    onClick={() => setSellAmountStr((amount * pct).toFixed(2))}
                                                    className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-[10px] font-bold text-gray-400 hover:text-white rounded-lg transition-colors border border-white/5"
                                                >
                                                    {pct * 100}%
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-6">
                                        <div className="text-xs text-red-300 uppercase tracking-wider mb-1">Estimated Return</div>
                                        {/* Pro-rated current value based on sell amount vs total amount */}
                                        <div className="text-2xl font-bold text-white font-mono">
                                            {formatUSD((currentValue || amount * 1.05) * (sellAmount / amount))}
                                        </div>
                                        <div className="text-xs text-red-300/60 mt-2">Funds returned to Investment Wallet</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => onSell && onSell(sellAmount)}
                                            disabled={sellAmount <= 0}
                                            className="py-3 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-red-900/20"
                                        >
                                            {sellAmount >= amount ? 'Confirm Sell All' : 'Confirm Sell'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsSellMode(false);
                                                setSellAmountStr(amount.toString()); // Reset on cancel
                                            }}
                                            className="py-3 bg-white/5 hover:bg-white/10 text-gray-300 font-medium rounded-xl transition-all border border-white/10"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                // STANDARD VIEW DETAILS
                                <>
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-white font-bold text-lg">Your Investment</h3>
                                        <div className="px-2 py-1 bg-green-500/10 rounded text-green-400 text-xs font-bold uppercase tracking-wide">
                                            ACTIVE
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                            <span className="text-gray-400 text-sm">Principal</span>
                                            <span className="text-white font-mono">{formatUSD(amount)}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-green-500/20">
                                            <span className="text-gray-400 text-sm">Current Value</span>
                                            <span className="text-green-400 font-mono font-bold">{formatUSD(currentValue || amount * 1.05)}</span>
                                        </div>
                                        <div className="flex justify-between items-center px-1">
                                            <span className="text-gray-400 text-sm">Total Returns</span>
                                            <div className="text-right">
                                                <div className="text-green-400 font-bold">+5.2%</div>
                                                <div className="text-xs text-gray-500">+$245.32</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={onBuyMore}
                                            className="py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20"
                                        >
                                            Buy More
                                        </button>
                                        <button
                                            onClick={() => setIsSellMode(true)}
                                            className="py-3 bg-white/5 hover:bg-white/10 text-gray-300 font-medium rounded-xl transition-all border border-white/10"
                                        >
                                            Sell Output
                                        </button>
                                    </div>
                                </>
                            )
                        ) : (
                            // INVEST MODE: Review & Confirm
                            <>
                                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Investment Summary</h3>

                                <div className="flex bg-white/5 rounded-lg p-1 mb-6">
                                    <button className="flex-1 py-2 text-xs font-bold text-gray-500 text-center hover:text-gray-300">MONTHLY SIP</button>
                                    <button className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 rounded shadow-md text-center">ONE-TIME</button>
                                </div>

                                <div className="mb-6">
                                    <div className="text-sm text-gray-400 mb-1">Amount to Invest</div>
                                    <div className="text-4xl font-bold text-white font-mono tracking-tight">{formatUSD(amount)}</div>
                                </div>

                                <div className="space-y-3 mb-8">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Payment Method</span>
                                        <span className="text-white">Inv. Wallet</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Network Fee</span>
                                        <span className="text-white">$0.00</span>
                                    </div>
                                    <div className="flex justify-between text-sm pt-3 border-t border-white/10">
                                        <span className="text-gray-400">Total</span>
                                        <span className="text-white font-bold">{formatUSD(amount)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={onConfirm}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 
                                               text-white font-bold text-lg shadow-lg hover:shadow-green-500/25 transition-all
                                               flex items-center justify-center gap-2 group"
                                >
                                    INVEST NOW
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>

                                <button
                                    onClick={onBack}
                                    className="w-full mt-4 py-3 text-gray-400 hover:text-white text-sm font-medium transition-colors"
                                >
                                    Back to Options
                                </button>
                            </>
                        )}

                        <div className="mt-6 flex items-start gap-2 p-3 bg-yellow-500/5 rounded-lg border border-yellow-500/10">
                            <AlertCircle size={14} className="text-yellow-500/40 mt-0.5 flex-shrink-0" />
                            <p className="text-[10px] text-yellow-200/40 leading-relaxed">
                                Not financial advice. Past performance is not a reliable indicator of future results.
                            </p>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/5">
                            <div className="flex items-center gap-2 mb-1">
                                <ShieldCheck size={16} className="text-purple-400" />
                                <h4 className="text-xs text-white font-medium">Audited Source</h4>
                            </div>
                            <p className="text-[10px] text-gray-500">
                                Contracts audited by CertiK & ConsenSys. Protected by 24/7 monitoring.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default InvestmentReview;
