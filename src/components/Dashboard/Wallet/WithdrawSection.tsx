import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, ChevronRight, CreditCard, Wallet, AlertCircle, Loader2 } from 'lucide-react'
import { useWalletStore } from '../../../store/walletStore'

export default function WithdrawSection() {
    const { balance, accounts, activeAccountId, setActiveAccount, withdraw } = useWalletStore()
    const [amount, setAmount] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleWithdraw = async () => {
        if (!amount || parseFloat(amount) <= 0) return
        setLoading(true)
        await withdraw(parseFloat(amount))
        setLoading(false)
        setSuccess(true)
        setTimeout(() => {
            setSuccess(false)
            setAmount('')
        }, 3000)
    }

    const handlePreset = (percent: number) => {
        setAmount((balance * percent).toFixed(2))
    }

    const activeAccount = accounts.find(a => a.id === activeAccountId)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-200px)] min-h-[600px]">

            {/* --- LEFT PANEL: DESTINATION --- */}
            <div className="lg:col-span-7 bg-[#13141b] rounded-3xl border border-white/5 p-8 flex flex-col">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="w-1 h-8 bg-[#6a7bff] rounded-full" />
                    Select Destination
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {accounts.map((acc) => (
                        <div
                            key={acc.id}
                            onClick={() => setActiveAccount(acc.id)}
                            className={`relative p-6 rounded-2xl border cursor-pointer transition-all duration-300 group
                        ${activeAccountId === acc.id
                                    ? 'bg-[#6a7bff]/10 border-[#6a7bff] shadow-[0_0_30px_rgba(106,123,255,0.15)]'
                                    : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="text-3xl filter grayscale group-hover:grayscale-0 transition-all">{acc.icon}</div>
                                {activeAccountId === acc.id && (
                                    <div className="bg-[#6a7bff] rounded-full p-1 text-white shadow-lg">
                                        <Check size={14} strokeWidth={4} />
                                    </div>
                                )}
                            </div>
                            <div className="font-bold text-white text-lg">{acc.name}</div>
                            <div className="text-slate-500 font-mono text-sm">•••• {acc.last4}</div>
                        </div>
                    ))}
                </div>

                <div className="mt-auto p-6 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                            <Wallet size={24} />
                        </div>
                        <div>
                            <div className="text-white font-bold">Add New Method</div>
                            <div className="text-slate-500 text-sm">Connect Bank, Card, or Wallet</div>
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-bold transition-colors">
                        Connect
                    </button>
                </div>
            </div>

            {/* --- RIGHT PANEL: AMOUNT & CONFIRM --- */}
            <div className="lg:col-span-5 bg-[#0b0c10] rounded-3xl border border-white/5 p-8 flex flex-col relative overflow-hidden">
                {/* Glow Effect */}
                <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-[#6a7bff]/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="flex justify-between items-center mb-12">
                    <div className="text-slate-400 font-medium">Available Balance</div>
                    <div className="text-white font-mono text-xl">${balance.toLocaleString()}</div>
                </div>

                <div className="mb-12 relative">
                    <div className="text-6xl md:text-7xl font-bold text-white font-mono tracking-tighter flex items-center overflow-hidden">
                        <span className="text-[#6a7bff] mr-2">$</span>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="bg-transparent border-none outline-none w-full placeholder:text-white/10"
                        />
                    </div>
                    <div className="h-[2px] w-full bg-gradient-to-r from-[#6a7bff] to-transparent mt-4 opacity-50" />
                </div>

                <div className="flex gap-3 mb-12">
                    {[0.25, 0.5, 1].map((pct) => (
                        <button
                            key={pct}
                            onClick={() => handlePreset(pct)}
                            className="flex-1 py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-slate-300 font-bold text-sm transition-all"
                        >
                            {pct * 100}%
                        </button>
                    ))}
                </div>

                <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-sm text-slate-400">
                        <span>Transaction Fee (Network)</span>
                        <span>$2.50</span>
                    </div>
                    <div className="flex justify-between text-sm text-white font-bold">
                        <span>Total Deducted</span>
                        <span>${(parseFloat(amount || '0') + 2.50).toFixed(2)}</span>
                    </div>
                </div>

                <button
                    disabled={!amount || parseFloat(amount) <= 0 || loading || success}
                    onClick={handleWithdraw}
                    className={`mt-auto w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all
                ${success ? 'bg-emerald-500 text-white' : 'bg-[#6a7bff] hover:bg-[#5a6bed] text-white shadow-[0_0_30px_rgba(106,123,255,0.3)]'}
                ${(!amount || parseFloat(amount) <= 0) && 'opacity-50 cursor-not-allowed shadow-none'}
            `}
                >
                    {loading ? <Loader2 className="animate-spin" /> :
                        success ? <Check /> :
                            'Confirm Withdrawal'}
                    {success ? 'Success' : ''}
                </button>

            </div>
        </div>
    )
}
