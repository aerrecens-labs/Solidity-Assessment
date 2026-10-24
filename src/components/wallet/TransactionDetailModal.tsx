import { Modal } from '../common/Modal'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownLeft, Calendar, Hash, CreditCard, Share2, Printer, Activity } from 'lucide-react'
import { formatCrypto, formatDateTime } from '../../utils/format'

// Define Transaction type locally if not imported, or improved shared type
interface Transaction {
    id: string
    date: string
    coin: string
    network: string
    qty: number
    fee: number
    gst: number
    deb: number
    recipient: string
    recipientFull: string
    self: boolean
    status: 'Completed' | 'Failed' | 'Pending'
    type: string
}

interface TransactionDetailModalProps {
    isOpen: boolean
    onClose: () => void
    transaction: Transaction | null
}

export const TransactionDetailModal = ({ isOpen, onClose, transaction }: TransactionDetailModalProps) => {
    if (!transaction) return null

    const isIncoming = transaction.type === 'receive' || transaction.type === 'auto-sweep'

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Transaction Details" className="max-w-xl">
            <div className="flex flex-col gap-6">

                {/* Status Header */}
                <div className="flex flex-col items-center gap-2 py-4">
                    <div className={`p-4 rounded-full ${isIncoming ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {isIncoming ? <ArrowDownLeft size={32} /> : <ArrowUpRight size={32} />}
                    </div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                        {isIncoming ? '+' : '-'}{formatCrypto(transaction.qty, transaction.coin)}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${transaction.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        transaction.status === 'Failed' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                            'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                        {transaction.status.toUpperCase()}
                    </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-1">
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                            <Calendar size={14} /> Date
                        </div>
                        <div className="text-white font-medium text-sm">{formatDateTime(transaction.date)}</div>
                    </div>

                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-1">
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                            <Activity size={14} /> Network
                        </div>
                        <div className="text-white font-medium text-sm">{transaction.network}</div>
                    </div>

                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-1 md:col-span-2">
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                            <CreditCard size={14} /> {isIncoming ? 'From' : 'To'}
                        </div>
                        <div className="text-white font-medium text-sm break-all">{transaction.recipientFull || transaction.recipient}</div>
                    </div>

                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-1 md:col-span-2">
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                            <Hash size={14} /> Transaction ID
                        </div>
                        <div className="text-white font-mono text-xs break-all">{transaction.id}</div>
                    </div>
                </div>

                {/* Financials (Fees etc) */}
                {!isIncoming && (
                    <div className="border-t border-white/10 pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Network Fee</span>
                            <span className="text-white">{formatCrypto(transaction.fee, transaction.coin)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Total Debited</span>
                            <span className="text-white font-bold">{formatCrypto(transaction.deb, transaction.coin)}</span>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 mt-2">
                    <button className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-slate-300 text-sm font-medium">
                        <Share2 size={16} /> Share Receipt
                    </button>
                    <button className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-slate-300 text-sm font-medium">
                        <Printer size={16} /> Print
                    </button>
                </div>

            </div>
        </Modal>
    )
}
