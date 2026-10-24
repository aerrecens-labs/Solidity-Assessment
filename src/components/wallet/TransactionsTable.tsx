import { useState, useMemo, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronDown, Check } from 'lucide-react'
import { TransactionDetailModal } from './TransactionDetailModal'
import { StatusBadge } from './StatusBadge'
import { CopyableHash } from './CopyableHash'
import { formatDateTime, formatCrypto } from '../../utils/format'

// --- Types ---
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
  status: 'Completed' | 'Failed'
  type: 'transfer' | 'auto-sweep' | 'send' | 'receive' | 'investment'
}

interface TransactionsTableProps {
  transactions: Transaction[]
  className?: string
}

const statusFilters = ['All', 'Completed', 'Failed'] as const
const typeFilters = ['All', 'Transfer', 'Send', 'Receive', 'Investment'] as const

// --- Dropdown Component ---
const FilterDropdown = ({
  label,
  value,
  options,
  onChange
}: {
  label: string
  value: string
  options: readonly string[]
  onChange: (val: any) => void
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 })

  useEffect(() => {
    if (!isOpen) return
    const handleScrollOrResize = () => setIsOpen(false)
    window.addEventListener('scroll', handleScrollOrResize, true)
    window.addEventListener('resize', handleScrollOrResize)
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true)
      window.removeEventListener('resize', handleScrollOrResize)
    }
  }, [isOpen])

  const handleOpen = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setCoords({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width
      })
      setIsOpen(true)
    }
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => isOpen ? setIsOpen(false) : handleOpen()}
        className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${value !== 'All'
          ? 'bg-[#6a7bff]/10 border-[#6a7bff] text-[#6a7bff]'
          : 'bg-[#242655] border-[#2a2c54] text-[#8b90b2] hover:border-[#6a7bff]/50 hover:text-[#e9ecff]'
          }`}
      >
        <span className="text-sm font-medium whitespace-nowrap">{label}: <span className={value !== 'All' ? 'font-bold' : ''}>{value}</span></span>
        <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && createPortal(
        <div className="fixed inset-0 z-[9999] isolate">
          <div className="fixed inset-0 cursor-default" onClick={() => setIsOpen(false)} />
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.95 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute bg-[#1a1c40] border border-[#2a2c54] rounded-xl shadow-2xl overflow-hidden backdrop-blur-md"
              style={{ top: coords.top, left: coords.left, minWidth: '12rem' }}
            >
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => { onChange(option); setIsOpen(false) }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${value === option ? 'bg-[#6a7bff]/10 text-[#6a7bff] font-medium' : 'text-[#8b90b2] hover:bg-[#242655] hover:text-[#e9ecff]'}`}
                >
                  {option}
                  {value === option && <Check size={14} />}
                </button>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>,
        document.body
      )}
    </>
  )
}

// --- Main "Escalator" Component ---
export const TransactionsTable = ({ transactions, className = '' }: TransactionsTableProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<typeof statusFilters[number]>('All')
  const [typeFilter, setTypeFilter] = useState<typeof typeFilters[number]>('All')
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = searchTerm === '' ||
        tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.recipient.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'All' || tx.status === statusFilter
      const matchesType = typeFilter === 'All' ||
        (typeFilter === 'Transfer' && (tx.type === 'transfer' || tx.type === 'auto-sweep')) ||
        (typeFilter === 'Send' && tx.type === 'send') ||
        (typeFilter === 'Receive' && tx.type === 'receive') ||
        (typeFilter === 'Investment' && tx.type === 'investment')
      return matchesSearch && matchesStatus && matchesType
    })
  }, [transactions, searchTerm, statusFilter, typeFilter])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      // THE CONTAINER: Fixed height (600px). Nothing leaves this box.
      className={`bg-[#1b1f4a] border border-[#2a2c54] rounded-2xl shadow-lg flex flex-col h-[600px] overflow-hidden ${className}`}
    >
      {/* --- SECTION 1: THE CONTROLS (Fixed Top) --- */}
      <div className="shrink-0 p-4 sm:p-6 bg-[#1b1f4a] z-30">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-[#e9ecff] tracking-wide">Transaction History</h3>
              <span className="px-2 py-1 rounded bg-[#242655] text-xs font-medium text-[#8b90b2]">{filteredTransactions.length}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b90b2] group-focus-within:text-[#6a7bff] transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search ID or Recipient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0f1230] border border-[#2a2c54] text-[#e9ecff] pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-[#6a7bff] focus:ring-1 focus:ring-[#6a7bff] transition-all placeholder:text-[#5f6485]"
              />
            </div>

            <div className="flex gap-3 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
              <FilterDropdown label="Type" value={typeFilter} options={typeFilters} onChange={setTypeFilter} />
              <FilterDropdown label="Status" value={statusFilter} options={statusFilters} onChange={setStatusFilter} />
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 2: THE "DECK" (Fixed Headers) --- */}
      {/* This creates the 'ceiling' that rows slide under. 
          We separate the THEAD from the TBODY physically. */}
      <div className="shrink-0 bg-[#242655] border-y border-[#2a2c54] z-20 shadow-lg relative">
        <div className="w-full grid grid-cols-[1.5fr_1fr_1.5fr_1fr_0.5fr_1fr_1fr] px-6 py-3">
          <div className="text-xs sm:text-sm font-semibold text-[#8b90b2]">Date & Time</div>
          <div className="text-xs sm:text-sm font-semibold text-[#8b90b2]">Total Qty</div>
          <div className="text-xs sm:text-sm font-semibold text-[#8b90b2]">Recipient</div>
          <div className="text-xs sm:text-sm font-semibold text-[#8b90b2]">Network</div>
          <div className="text-xs sm:text-sm font-semibold text-[#8b90b2]">Self</div>
          <div className="text-xs sm:text-sm font-semibold text-[#8b90b2]">Status</div>
          <div className="text-right text-xs sm:text-sm font-semibold text-[#8b90b2]">TxID</div>
        </div>

        {/* Shadow Overlay to create depth underneath */}
        <div className="absolute -bottom-4 left-0 right-0 h-4 bg-gradient-to-b from-[#1b1f4a]/50 to-transparent pointer-events-none z-10" />
      </div>

      {/* --- SECTION 3: THE "ESCALATOR" (Scrollable Body) --- */}
      <div className="grow overflow-y-auto custom-scrollbar relative bg-[#1b1f4a]">
        <div className="w-full">
          <AnimatePresence>
            {filteredTransactions.map((tx, index) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ delay: index * 0.05 }}
                // Grid columns must match the Header Grid exactly
                className="grid grid-cols-[1.5fr_1fr_1.5fr_1fr_0.5fr_1fr_1fr] px-6 py-4 border-b border-[#2a2c54] hover:bg-[#242655]/50 transition-colors group items-center cursor-pointer"
                onClick={() => setSelectedTx(tx)}
              >
                <div className="whitespace-nowrap">
                  <div className="text-sm font-medium text-[#e9ecff]">{formatDateTime(tx.date).split(',')[0]}</div>
                  <div className="text-xs text-[#8b90b2]">{formatDateTime(tx.date).split(',')[1] || ''}</div>
                </div>

                <div className="whitespace-nowrap">
                  <span className="text-sm font-bold text-[#e9ecff]">{formatCrypto(tx.qty, tx.coin)}</span>
                </div>

                <div className="whitespace-nowrap overflow-hidden">
                  <div className="flex flex-col">
                    <span className="text-sm text-[#e9ecff] truncate pr-2">{tx.recipient}</span>
                    <span className="text-xs text-[#8b90b2] truncate">{tx.recipientFull}</span>
                  </div>
                </div>

                <div className="whitespace-nowrap">
                  <span className="text-sm text-[#e9ecff]">{tx.network}</span>
                </div>

                <div className="whitespace-nowrap">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.self ? 'bg-[#36c390]/20 text-[#36c390]' : 'bg-[#e9ecff]/20 text-[#e9ecff]'}`}>
                    {tx.self ? <Check size={14} /> : '-'}
                  </div>
                </div>

                <div className="whitespace-nowrap">
                  <StatusBadge status={tx.status} />
                </div>

                <div className="whitespace-nowrap text-right">
                  <CopyableHash hash={tx.id} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="p-8 text-center text-[#8b90b2] h-full flex items-center justify-center">
            No transactions found confirming your criteria.
          </div>
        )}
      </div>

      <TransactionDetailModal
        isOpen={!!selectedTx}
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
      />
    </motion.div>
  )
}