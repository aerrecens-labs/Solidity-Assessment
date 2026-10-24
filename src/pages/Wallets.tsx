import { useEffect, useMemo, useRef, useState } from 'react'
import { cryptoStore, type CryptoSymbol } from '../state/cryptoStore'
import { prices } from '../state/prices'
import { cryptoMeta } from '../state/cryptoMeta'
import { investmentWallet } from '../state/investmentWallet'
import { useCryptoStore } from '../state/useCryptoStore'
import { transactionsStore, type Transaction } from '../state/transactions'
import { TransactionsTable } from '../components/wallet/TransactionsTable'
import { InvestmentNotification } from '../components/common/InvestmentNotification'
import { motion, AnimatePresence } from 'framer-motion'
import { containerStagger, fadeInUp, thanosReverse } from '../utils/animations'
import { useUIStore } from '../state/uiStore'
import { Wallet, Send, ArrowDown, Landmark, Check, Settings, LogOut, ArrowRight, Zap, Lock as LockIcon } from 'lucide-react'
import { Toast, ToastType } from '../components/common/Toast'



// --- Spotlight Card (Premium UI) ---
const SpotlightCard = ({ children, className = "", onClick }: any) => {
  const divRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return
    const rect = divRef.current.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      onClick={onClick}
      className={`relative overflow-hidden border border-white/5 bg-[#1f1f22] ${className}`}
    >
      {/* The Moving Glow */}
      <div
        className="pointer-events-none absolute -inset-px transition duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />
      {/* Content sits above glow */}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  )
}

export default function Wallets() {
  const { showGradients, toggleProfile } = useUIStore()
  const [hideAmounts, setHideAmounts] = useState(false)

  type TabKey = 'balance' | 'send' | 'receive' | 'withdraw'
  const [activeTab, setActiveTab] = useState<TabKey>('balance')

  // Send tab state
  const [sendCoin, setSendCoin] = useState<string>('')
  const [sendNetwork, setSendNetwork] = useState<string>('')
  const [sendRecipient, setSendRecipient] = useState<string>('')
  const [sendQty, setSendQty] = useState<string>('')

  // Receive tab state
  const [recvCoin, setRecvCoin] = useState<string>('')
  const [recvNetwork, setRecvNetwork] = useState<string>('')
  const [recvLabel, setRecvLabel] = useState<string>('')
  const [recvAck, setRecvAck] = useState<boolean>(false)
  const [recvAddress, setRecvAddress] = useState<string>('')

  // Balance tab state (wallet balances and transfers)
  const [selectedWallet, setSelectedWallet] = useState<CryptoSymbol>(() => {
    const saved = localStorage.getItem('last_selected_wallet')
    return (saved as CryptoSymbol) || 'SEPOLIA_ETH'
  })
  const [wallet1Balance, setWallet1Balance] = useState<number>(cryptoStore.get(selectedWallet))
  const [investmentBalance, setInvestmentBalance] = useState<number>(investmentWallet.getBalance())
  const [showTransferWallet1, setShowTransferWallet1] = useState<boolean>(false)
  const [transferAmount, setTransferAmount] = useState<string>('')
  const [showInvest, setShowInvest] = useState<boolean>(false)
  const [investAmount, setInvestAmount] = useState<string>('') // USD amount for investment

  // Investment notification state
  const [showInvestmentNotification, setShowInvestmentNotification] = useState<boolean>(false)
  const [notificationAmount, setNotificationAmount] = useState<number>(0)
  const [notificationSourceWallet, setNotificationSourceWallet] = useState<string>('')

  const [transactions, setTransactions] = useState<Transaction[]>([])

  // Withdraw Page State
  const [withdrawAmount, setWithdrawAmount] = useState<string>('')
  const [selectedBank, setSelectedBank] = useState<string>('bank_1')
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [showConnectModal, setShowConnectModal] = useState<'upi' | 'paypal' | null>(null)

  const [savedBanks, setSavedBanks] = useState([
    { id: 'bank_1', name: 'Chase Bank', mask: '****8899', type: 'Checking', icon: '🏦' },
    { id: 'bank_2', name: 'Wells Fargo', mask: '****4522', type: 'Savings', icon: '🏛️' }
  ])
  const [showAddBank, setShowAddBank] = useState(false)
  const [newBank, setNewBank] = useState({ name: '', number: '', ifsc: '', type: 'Checking' })
  const [editingBankId, setEditingBankId] = useState<string | null>(null)

  // UPI & PayPal State
  const [upiId, setUpiId] = useState('')
  const [paypalEmail, setPaypalEmail] = useState('')

  // Toast State
  const [toast, setToast] = useState<{ open: boolean; message: string; type: ToastType }>({
    open: false,
    message: '',
    type: 'success'
  })

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ open: true, message, type })
  }

  // Subscribe to transaction updates
  useEffect(() => {
    setTransactions(transactionsStore.getAll())

    const unsubscribe = transactionsStore.subscribe((txs) => {
      setTransactions(txs)
    })

    return unsubscribe
  }, [])

  const quickMaxByCoin: Record<string, number> = useMemo(() => ({ BTC: 0.05, ETH: 0.8, USDT: 250, SOL: 12, BAT: 10, SEPOLIA_ETH: 10 }), [])

  // Save selected wallet to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('last_selected_wallet', selectedWallet)
  }, [selectedWallet])



  const parsedQty = useMemo(() => {
    const n = parseFloat((sendQty || '').replace(/,/g, ''))
    return Number.isFinite(n) ? n : 0
  }, [sendQty])

  const sendReady = !!sendCoin && !!sendNetwork && !!sendRecipient && parsedQty > 0
  const fee = sendReady ? parsedQty * 0.002 : 0
  const gst = sendReady ? fee * 0.18 : 0
  const deb = sendReady ? parsedQty + fee + gst : 0

  const fmt = (n: number) => {
    const s = Math.round(n * 1e8) / 1e8
    return s.toString()
  }
  const nowStr = () => {
    const d = new Date()
    const pad = (x: number) => String(x).padStart(2, '0')
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${pad(d.getDate())} ${months[d.getMonth()]} ${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  }
  const genId = () => `TX-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

  const handleEditBank = (bank: any) => {
    setEditingBankId(bank.id)
    setNewBank({
      name: bank.name,
      number: '',
      ifsc: '',
      type: bank.type
    })
    setShowAddBank(true)
  }

  const handleDeleteBank = (bankId: string) => {
    const newBanks = savedBanks.filter(b => b.id !== bankId)
    setSavedBanks(newBanks)
    if (selectedBank === bankId && newBanks.length > 0) {
      setSelectedBank(newBanks[0].id)
    } else if (newBanks.length === 0) {
      setSelectedBank('')
    }
  }

  // Investment notification handlers
  const handleShowInvestmentNotification = (amount: number, sourceWallet: string) => {
    setNotificationAmount(amount)
    setNotificationSourceWallet(sourceWallet)
    setShowInvestmentNotification(true)
  }

  const handleInvestNow = () => {
    setShowInvestmentNotification(false)
    window.location.href = `/app/investment?amount=${notificationAmount}&source=${notificationSourceWallet}%20Wallet`
  }

  const handleDismissNotification = () => {
    setShowInvestmentNotification(false)
  }

  const genRecvAddress = (coin: string, net: string) => {
    const prefix = coin === 'BTC' ? 'bc1' : coin === 'ETH' || coin === 'USDT' || coin === 'SEPOLIA_ETH' ? '0x' : 'addr_'
    return `${prefix}${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`.slice(0, 46)
  }

  const handleInternalTransfer = (): boolean => {
    const amt = parseFloat(transferAmount)
    if (!Number.isFinite(amt) || amt <= 0) { alert('Enter a valid amount'); return false }
    if (amt > wallet1Balance) { alert('Insufficient Wallet 1 balance'); return false }

    // Convert crypto to USD using price dictionary
    const cryptoPrice = prices.get(selectedWallet).price
    const usdValue = amt * cryptoPrice
    console.log(`HandleInternalTransfer: ${amt} ${selectedWallet} at $${cryptoPrice} = $${usdValue}`)
    console.log(`Crypto balance before: ${cryptoStore.get(selectedWallet)}`)

    investmentWallet.add(usdValue)
    cryptoStore.delta(selectedWallet, -amt)

    console.log(`Crypto balance after: ${cryptoStore.get(selectedWallet)}`)
    const transaction: Transaction = {
      id: genId(),
      date: nowStr(),
      coin: selectedWallet,
      network: 'Internal',
      qty: amt,
      fee: 0,
      gst: 0,
      deb: amt,
      recipient: 'Investment Wallet',
      recipientFull: `Sold ${amt} ${selectedWallet} for $${usdValue.toFixed(2)}`,
      self: true,
      status: 'Completed',
      type: 'transfer'
    }
    transactionsStore.add(transaction)
    setTransferAmount('')
    setShowTransferWallet1(false)
    return true
  }



  // FX: flying triangle
  const containerRef = useRef<HTMLDivElement | null>(null)
  const fxLayerRef = useRef<HTMLDivElement | null>(null)
  const wallet1IconRef = useRef<HTMLDivElement | null>(null)
  const investIconRef = useRef<HTMLDivElement | null>(null)
  const sweepingRef = useRef<boolean>(false)

  // Keep Wallet 1 balance synced from global store
  useEffect(() => {
    const unsub = cryptoStore.subscribeToBalances((bals) => {
      setWallet1Balance(bals[selectedWallet] ?? 0)
    })
    setWallet1Balance(cryptoStore.get(selectedWallet))
    return unsub
  }, [selectedWallet])

  // Keep investment balance synced from global store
  useEffect(() => {
    const unsub = investmentWallet.subscribe((balance) => {
      setInvestmentBalance(balance)
    })
    setInvestmentBalance(investmentWallet.getBalance())
    return unsub
  }, [])



  function triggerFly(
    fromEl: HTMLElement,
    toEl: HTMLElement | null,
    direction: 'right' | 'left',
    onArrive?: () => void,
  ) {
    if (!fxLayerRef.current || !toEl) {
      // If layer/target missing, run the callback immediately
      onArrive?.()
      return
    }
    const layer = fxLayerRef.current
    const layerRect = layer.getBoundingClientRect()
    const fromRect = fromEl.getBoundingClientRect()
    const toRect = toEl.getBoundingClientRect()
    const startX = fromRect.left + (direction === 'right' ? fromRect.width : 0) - layerRect.left
    const startY = fromRect.top + fromRect.height / 2 - layerRect.top
    const endX = toRect.left + toRect.width / 2 - layerRect.left
    const endY = toRect.top + toRect.height / 2 - layerRect.top
    const dx = endX - startX
    const dy = endY - startY

    const tri = document.createElement('div')
    tri.className = `fly-triangle ${direction === 'right' ? 'dir-right' : 'dir-left'}`
    tri.style.left = `${startX}px`
    tri.style.top = `${startY}px`
    tri.style.setProperty('--fx-x', `${dx}px`)
    tri.style.setProperty('--fx-y', `${dy}px`)
    layer.appendChild(tri)

    // Particle trail along the path
    const durationMs = 1200
    const startTime = performance.now()
    const trailTimer = setInterval(() => {
      const now = performance.now()
      const t = Math.min(1, (now - startTime) / durationMs)
      // Swirl offsets diminish over time
      const ampX = 22 * (1 - t)
      const ampY = 16 * (1 - t)
      const swirl = Math.sin(t * Math.PI * 3)
      const swirlY = Math.cos(t * Math.PI * 3)
      const x = startX + dx * t + (direction === 'right' ? ampX * swirl : -ampX * swirl)
      const y = startY + dy * t + ampY * swirlY

      const dot = document.createElement('div')
      dot.className = 'fly-trail'
      dot.style.left = `${x}px`
      dot.style.top = `${y}px`
      layer.appendChild(dot)
      setTimeout(() => dot.remove(), 1000)

      if (t >= 1) clearInterval(trailTimer)
    }, 50)

    tri.addEventListener('animationend', () => {
      // Apply balance changes right when the triangle arrives
      onArrive?.()
      const spark = document.createElement('div')
      spark.className = 'fly-spark'
      spark.style.left = `${startX + dx}px`
      spark.style.top = `${startY + dy}px`
      layer.appendChild(spark)
      setTimeout(() => { spark.remove() }, 2500)
      tri.remove()
    }, { once: true })
  }

  return (
    <>
      <motion.div
        className="wallet"
        initial="hidden"
        animate="visible"
        variants={containerStagger}
      >
        <div className="wallet-container" ref={containerRef}>
          <div className="wallet-fx-layer" ref={fxLayerRef} />
          {/* Topbar */}
          <motion.div className="wallet-topbar" variants={fadeInUp}>
            <div className="wallet-title">Wallet</div>
            <div className="wallet-status-bar">


              <div className="wallet-row my-2">
                <button className="wallet-icon-btn" title="Profile" onClick={toggleProfile}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="8" r="4" stroke="#b8bffa" strokeWidth="1.8" />
                    <path d="M4 20c2.5-4 13.5-4 16 0" stroke="#b8bffa" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>

                <button className="wallet-icon-btn" title="Hide/Show balances" onClick={() => setHideAmounts((v) => !v)} aria-pressed={hideAmounts}>
                  {hideAmounts ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M2 12s3.5-6 10-6c2.1 0 3.9.5 5.4 1.2" stroke="#b8bffa" strokeWidth="1.8" />
                      <path d="M22 12s-3.5 6-10 6c-2.1 0-3.9-.5-5.4-1.2" stroke="#b8bffa" strokeWidth="1.8" />
                      <path d="M3 21L21 3" stroke="#b8bffa" strokeWidth="1.8" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" stroke="#b8bffa" strokeWidth="1.8" />
                      <circle cx="12" cy="12" r="3" stroke="#b8bffa" strokeWidth="1.8" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          {/* Tabs - Pill Segmented Control */}
          <motion.div
            className="flex w-full bg-[#1b1f4a]/50 backdrop-blur-md p-1 rounded-full border border-white/5 gap-0 mb-6"
            variants={fadeInUp}
          >
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full transition-all duration-300 text-xs sm:text-sm font-medium relative group
                ${activeTab === 'balance'
                  ? 'bg-gradient-to-r from-[#6a7bff] to-[#67c8ff] text-white shadow-lg shadow-blue-500/25'
                  : 'text-[#8b90b2] hover:text-[#e9ecff] hover:bg-white/5'
                }`}
              onClick={() => setActiveTab('balance')}
            >
              <Wallet size={18} className={activeTab === 'balance' ? 'stroke-[2.5px]' : ''} />
              <span className={`hidden sm:inline ${activeTab === 'balance' ? 'font-bold' : ''}`}>Balance</span>
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full transition-all duration-300 text-xs sm:text-sm font-medium relative group
                ${activeTab === 'send'
                  ? 'bg-gradient-to-r from-[#6a7bff] to-[#67c8ff] text-white shadow-lg shadow-blue-500/25'
                  : 'text-[#8b90b2] hover:text-[#e9ecff] hover:bg-white/5'
                }`}
              onClick={() => setActiveTab('send')}
            >
              <Send size={18} className={activeTab === 'send' ? 'stroke-[2.5px]' : ''} />
              <span className={`hidden sm:inline ${activeTab === 'send' ? 'font-bold' : ''}`}>Send</span>
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full transition-all duration-300 text-xs sm:text-sm font-medium relative group
                ${activeTab === 'receive'
                  ? 'bg-gradient-to-r from-[#6a7bff] to-[#67c8ff] text-white shadow-lg shadow-blue-500/25'
                  : 'text-[#8b90b2] hover:text-[#e9ecff] hover:bg-white/5'
                }`}
              onClick={() => setActiveTab('receive')}
            >
              <ArrowDown size={18} className={activeTab === 'receive' ? 'stroke-[2.5px]' : ''} />
              <span className={`hidden sm:inline ${activeTab === 'receive' ? 'font-bold' : ''}`}>Receive</span>
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full transition-all duration-300 text-xs sm:text-sm font-medium relative group
                ${activeTab === 'withdraw'
                  ? 'bg-gradient-to-r from-[#6a7bff] to-[#67c8ff] text-white shadow-lg shadow-blue-500/25'
                  : 'text-[#8b90b2] hover:text-[#e9ecff] hover:bg-white/5'
                }`}
              onClick={() => setActiveTab('withdraw')}
            >
              <Landmark size={18} className={activeTab === 'withdraw' ? 'stroke-[2.5px]' : ''} />
              <span className={`hidden sm:inline ${activeTab === 'withdraw' ? 'font-bold' : ''}`}>Withdraw</span>
            </button>
          </motion.div>


          <AnimatePresence mode="wait">
            {activeTab === 'balance' && (
              <motion.div
                key="balance"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="wallet-grid">
                  {/* Left card */}
                  <section className="wallet-card">
                    <div className="wallet-card-header">
                      <div className="wallet-token-badge" aria-hidden="true">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                          <path d="M4 7a3 3 0 0 1 3-3h10a2 2 0 0 1 2 2v2h1a1 1 0 1 1 0 2H4V7Z" fill="#9ad0ff" />
                          <rect x="4" y="8" width="16" height="10" rx="3" fill="#5b7cfa" />
                        </svg>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        flex: 1,
                        justifyContent: 'space-between',
                        position: 'relative'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: 'linear-gradient(135deg, rgba(114,87,255,0.1) 0%, rgba(93,199,255,0.1) 100%)',
                          padding: '6px 12px',
                          borderRadius: '12px',
                          border: '1px solid rgba(255,255,255,0.1)',
                          width: '100%',
                          position: 'relative'
                        }}>
                          <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: cryptoMeta[selectedWallet]?.color || '#60a5fa',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: 'white'
                          }}>
                            {selectedWallet.charAt(0)}
                          </div>
                          <span style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#ffffff',
                            flex: 1
                          }}>
                            {cryptoMeta[selectedWallet]?.name || selectedWallet}
                          </span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.7 }}>
                            <path d="M6 9l6 6 6-6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <select
                            value={selectedWallet}
                            onChange={(e) => setSelectedWallet(e.target.value as CryptoSymbol)}
                            style={{
                              position: 'absolute',
                              opacity: 0,
                              width: '100%',
                              height: '100%',
                              cursor: 'pointer',
                              top: 0,
                              left: 0
                            }}
                          >
                            <option value="SEPOLIA_ETH">Sepolia-ETH Wallet</option>
                            <option value="BTC">BTC Wallet</option>
                            <option value="ETH">ETH Wallet</option>
                            <option value="USDT">USDT Wallet</option>
                            <option value="SOL">SOL Wallet</option>
                            <option value="BAT">BAT Wallet</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className={`wallet-balance ${hideAmounts ? 'hidden-amt' : ''}`} data-amount={fmt(wallet1Balance)}>
                      <div className="wallet-token-badge" aria-hidden="true" ref={wallet1IconRef}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                          <polygon points="12,31 21,19 3,19" fill="#ff6b6b" />
                          <polygon points="32,0 18,18 6,18" fill="#0fd0d0" />
                        </svg>
                      </div>
                      <div className="wallet-value">
                        <span className="num">{fmt(wallet1Balance)}</span>
                        <span className="unit">{selectedWallet}</span>
                      </div>
                    </div>

                    <div
                      className={`wallet-action wallet-action--to-invest ${showTransferWallet1 ? 'expanded' : ''}`}
                      onClick={!showTransferWallet1 ? () => setShowTransferWallet1(true) : undefined}
                      style={{ marginTop: '16px' }}
                    >
                      <div className="wallet-action-label center">
                        <span className="hidden sm:inline">TRANSFER TO INVESTMENT WALLET</span>
                        <span className="sm:hidden">TRANSFER</span>
                      </div>
                      <div className="wallet-action-body" onClick={(e) => e.stopPropagation()}>
                        <input className="wallet-action-input" placeholder={`Amount (${selectedWallet})`} inputMode="decimal" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} />
                        <button className="wallet-action-send tip-right" onClick={(e) => {
                          const btn = e.currentTarget as HTMLElement
                          const amt = parseFloat(transferAmount)
                          if (!Number.isFinite(amt) || amt <= 0 || amt > wallet1Balance) { alert('Enter a valid amount'); return }

                          // Convert crypto to USD using price dictionary
                          const cryptoPrice = prices.get(selectedWallet).price
                          const usdValue = amt * cryptoPrice

                          triggerFly(btn, investIconRef.current, 'right', () => {
                            investmentWallet.add(usdValue, `Transfer from ${selectedWallet} wallet`)
                            cryptoStore.delta(selectedWallet, -amt)

                            const transaction: Transaction = {
                              id: genId(),
                              date: nowStr(),
                              coin: selectedWallet,
                              network: 'Internal',
                              qty: amt,
                              fee: 0, // Mock fee
                              gst: 0,
                              deb: amt,
                              recipient: 'Investment Wallet',
                              recipientFull: `Sold ${amt} ${selectedWallet} for $${usdValue.toFixed(2)}`,
                              self: true,
                              status: 'Completed',
                              type: 'transfer'
                            }
                            transactionsStore.add(transaction)
                            setTransferAmount('')
                            setShowTransferWallet1(false)

                            // Show investment notification
                            handleShowInvestmentNotification(usdValue, selectedWallet)
                          })
                        }}>SEND</button>
                      </div>
                    </div>
                  </section>

                  {/* Right card */}
                  <section className="wallet-card">
                    <div className="wallet-card-header">
                      <div className="wallet-token-badge" aria-hidden="true">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                          <rect x="4" y="5" width="16" height="14" rx="3" stroke="#9ad0ff" strokeWidth="1.6" />
                          <path d="M7 9h10" stroke="#9ad0ff" strokeWidth="1.6" />
                        </svg>
                      </div>
                      <span>Investment Wallet</span>
                      <svg className="wallet-info" viewBox="0 0 24 24" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" stroke="#a9b2ff" strokeWidth="1.6" fill="none" />
                        <circle cx="12" cy="8" r="1.2" fill="#a9b2ff" />
                        <path d="M12 11v6" stroke="#a9b2ff" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </div>

                    <div className={`wallet-balance ${hideAmounts ? 'hidden-amt' : ''}`} data-amount={fmt(investmentBalance)}>
                      <div className="wallet-token-badge" aria-hidden="true" ref={investIconRef}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#F5BD02" strokeWidth="2" fill="none" />
                        </svg>
                      </div>
                      <div className="wallet-value">
                        <span className="num">${investmentBalance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
                        <span className="unit">USD</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 mt-4">
                      <div
                        className={`wallet-action wallet-action--to-invest ${showInvest ? 'expanded' : ''}`}
                        onClick={!showInvest ? () => setShowInvest(true) : undefined}
                      >
                        <div className="wallet-action-label center">INVEST AMOUNT</div>
                        <div className="wallet-action-body" onClick={(e) => e.stopPropagation()}>
                          <input className="wallet-action-input" placeholder="Amount (USD)" inputMode="decimal" value={investAmount} onChange={(e) => setInvestAmount(e.target.value)} />
                          <button className="wallet-action-send tip-right" onClick={(e) => {
                            const amt = parseFloat(investAmount)
                            if (!Number.isFinite(amt) || amt <= 0) { alert('Enter a valid USD amount'); return }
                            if (amt > investmentBalance) { alert('Insufficient investment balance'); return }

                            // Deduct amount from investment wallet
                            investmentWallet.subtract(amt, 'Invested in Platform')

                            // Add transaction record
                            const transaction: Transaction = {
                              id: genId(),
                              date: nowStr(),
                              coin: 'USD',
                              network: 'Investment',
                              qty: amt,
                              fee: 0,
                              gst: 0,
                              deb: amt,
                              recipient: 'Investment Platform',
                              recipientFull: `Invested $${amt.toFixed(2)} USD`,
                              self: true,
                              status: 'Completed',
                              type: 'investment'
                            }
                            transactionsStore.add(transaction)

                            // Clear form
                            setInvestAmount('')
                            setShowInvest(false)

                            // Navigate to investment page with selected amount
                            window.location.href = `/app/investment?amount=${amt}&source=Investment%20Wallet`
                          }}>INVEST</button>
                        </div>
                      </div>


                    </div>
                  </section>
                </div>

              </motion.div>
            )}

            {activeTab === 'send' && (
              <motion.div
                key="send"
                className="wallet-send"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="wallet-send-grid">
                  <section className="wallet-card" aria-labelledby="send-add-details">
                    <div id="send-add-details" className="wallet-card-header">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M3 20l18-8L3 6l4 6-4 8z" stroke="#cfd6ff" strokeWidth="1.6" strokeLinejoin="round" />
                      </svg>
                      <span>Add details to send crypto</span>
                    </div>

                    <div className="send-field">
                      <div className="send-label">Coin</div>
                      <div className="send-select-wrap">
                        <select className="send-select" aria-label="Select Coin" value={sendCoin} onChange={(e) => setSendCoin(e.target.value)}>
                          <option value="">Select Coin</option>
                          <option value="BTC">Bitcoin (BTC)</option>
                          <option value="ETH">Ethereum (ETH)</option>
                          <option value="USDT">Tether (USDT)</option>
                          <option value="BAT">Basic Attention Token (BAT)</option>
                          <option value="AUR">Aurora (AUR)</option>
                        </select>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="#b8bffa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                    </div>

                    <div className="send-field">
                      <div className="send-label">Network</div>
                      <div className="send-select-wrap">
                        <select className="send-select" aria-label="Select Network" value={sendNetwork} onChange={(e) => setSendNetwork(e.target.value)}>
                          <option value="">Select Network</option>
                          <option value="Bitcoin">Bitcoin</option>
                          <option value="Ethereum">Ethereum</option>
                          <option value="Polygon">Polygon</option>
                          <option value="BSC (BEP-20)">BSC (BEP-20)</option>
                        </select>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="#b8bffa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                    </div>

                    <div className="send-field">
                      <div className="send-label"><span>Recipient Address</span><span className="send-spacer" /><a className="send-link" href="#" onClick={(e) => { e.preventDefault(); alert('Add/View recipients (placeholder).') }}>ADD/VIEW</a></div>
                      <div className="send-select-wrap">
                        <select className="send-select" aria-label="Select Recipient" value={sendRecipient} onChange={(e) => setSendRecipient(e.target.value)}>
                          <option value="">Select Recipient Address</option>
                          <option value="0xA1...89fE">My Main Wallet (0xA1...89fE)</option>
                          <option value="0xB3...72c1">Cold Storage (0xB3...72c1)</option>
                          <option value="3J98t1Wp...">BTC P2SH (3J98t1Wp...)</option>
                        </select>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="#b8bffa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                    </div>

                    <div className="send-field">
                      <div className="send-label">Quantity</div>
                      <div className="send-grid-qty">
                        <input className="send-input" placeholder="Enter Quantity" inputMode="decimal" value={sendQty} onChange={(e) => setSendQty(e.target.value)} />
                        <div className="send-quick-row">
                          {['25', '50', '75', '100'].map(pct => (
                            <button key={pct} className="send-chip-btn" onClick={(e) => {
                              e.preventDefault()
                              const coin = sendCoin || 'BAT'
                              const max = quickMaxByCoin[coin] ?? 0
                              let q = 0
                              const p = parseInt(pct, 10)
                              q = max * (p / 100)
                              setSendQty(fmt(q))
                            }}>{pct === '100' ? 'MAX' : `${pct}%`}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>

                  <aside className="wallet-card">
                    <div className="send-summary-list">
                      <div className="send-sum-row"><div className="send-sum-label">You are Sending</div><div className="send-sum-val">{sendReady ? `${fmt(parsedQty)} ${sendCoin}` : '—'}</div></div>
                      <div className="send-sum-row"><div className="send-sum-label">Fees</div><div className="send-sum-val">{sendReady ? `${fmt(fee)} ${sendCoin}` : '—'}</div></div>
                      <div className="send-sum-row"><div className="send-sum-label">GST</div><div className="send-sum-val">{sendReady ? `${fmt(gst)} ${sendCoin}` : '—'}</div></div>
                      <div className="send-sum-row"><div className="send-sum-label">Qty to be debited</div><div className="send-sum-val">{sendReady ? `${fmt(deb)} ${sendCoin}` : '—'}</div></div>
                    </div>
                    <button className="send-cta" disabled={!sendReady} onClick={() => {
                      if (!sendReady) return
                      const self = /my|cold|self/i.test(sendRecipient)
                      const recLabel = sendRecipient
                      const recFull = sendRecipient

                      // Update crypto store - deduct the sent amount
                      cryptoStore.delta(sendCoin as CryptoSymbol, -deb)

                      const transaction: Transaction = {
                        id: genId(),
                        date: nowStr(),
                        coin: sendCoin,
                        network: sendNetwork,
                        qty: parsedQty,
                        fee, gst, deb,
                        recipient: recLabel,
                        recipientFull: recFull,
                        self,
                        status: 'Completed',
                        type: 'send'
                      }
                      transactionsStore.add(transaction)
                      setSendQty('')
                      alert('Transaction recorded (mock).')
                    }}>PROCEED TO SEND CRYPTO</button>
                  </aside>
                </div>

              </motion.div>
            )}

            {activeTab === 'receive' && (
              <motion.div
                key="receive"
                className="wallet-send"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="wallet-send-grid">
                  <section className="wallet-card" aria-labelledby="recv-add-details">
                    <div id="recv-add-details" className="wallet-card-header">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M3 20l18-8L3 6l4 6-4 8z" stroke="#cfd6ff" strokeWidth="1.6" strokeLinejoin="round" />
                      </svg>
                      <span>Enter details to view address</span>
                    </div>

                    <div className="send-field">
                      <div className="send-label">Coin</div>
                      <div className="send-select-wrap">
                        <select className="send-select" aria-label="Select Coin" value={recvCoin} onChange={(e) => setRecvCoin(e.target.value)}>
                          <option value="">Select Coin</option>
                          <option value="BTC">Bitcoin (BTC)</option>
                          <option value="ETH">Ethereum (ETH)</option>
                          <option value="USDT">Tether (USDT)</option>
                          <option value="BCH">Bitcoin Cash (BCH)</option>
                          <option value="AUR">Aurora (AUR)</option>
                        </select>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="#b8bffa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                    </div>

                    <div className="send-field">
                      <div className="send-label">Network</div>
                      <div className="send-select-wrap">
                        <select className="send-select" aria-label="Select Network" value={recvNetwork} onChange={(e) => setRecvNetwork(e.target.value)}>
                          <option value="">Select Network</option>
                          <option value="Bitcoin">Bitcoin</option>
                          <option value="Ethereum">Ethereum</option>
                          <option value="Polygon">Polygon</option>
                          <option value="Bitcoin Cash">Bitcoin Cash</option>
                        </select>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="#b8bffa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                    </div>

                    <div className="send-field">
                      <div className="send-label"><span>Address Label</span><span className="send-spacer" /><a className="send-link" href="#" onClick={(e) => { e.preventDefault(); const name = prompt('New label name'); if (name) setRecvLabel(name) }}>ADD</a></div>
                      <div className="send-select-wrap">
                        <select className="send-select" aria-label="Address Label" value={recvLabel} onChange={(e) => setRecvLabel(e.target.value)}>
                          <option value="">Select label</option>
                          <option value="My address">My address</option>
                          <option value="Trading wallet">Trading wallet</option>
                        </select>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="#b8bffa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                    </div>

                    {(recvCoin && recvNetwork) && (
                      <div className="recv-note">
                        <strong>Note</strong>
                        <div>Please only receive the selected coin on the selected network. We will not be able to recover tokens sent on a different network.</div>
                      </div>
                    )}
                  </section>

                  <aside className="wallet-card">
                    {!(recvCoin && recvNetwork) ? (
                      <div>
                        <div className="send-label" style={{ marginBottom: 6, fontSize: 18 }}>Add Details</div>
                        <div className="send-label" style={{ color: '#9aa0c7', fontWeight: 500 }}>Please select the coin and network details to view the crypto address.</div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#b7e48d', color: '#1a2b0d', display: 'grid', placeItems: 'center', fontWeight: 900 }}>₿</div>
                          <div>
                            <div style={{ fontWeight: 900, fontSize: 18 }}>Important Notice!</div>
                            <div className="send-label" style={{ color: '#9aa0c7' }}>Receive only the selected coin on the selected network.</div>
                          </div>
                        </div>

                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                          <input type="checkbox" checked={recvAck} onChange={(e) => setRecvAck(e.target.checked)} />
                          <span className="send-label" style={{ color: '#9aa0c7' }}>I am receiving <strong>{recvCoin || '—'}</strong> over <strong>{recvNetwork || '—'}</strong> Network</span>
                        </label>

                        <button className="send-cta" disabled={!recvAck} onClick={() => {
                          const addr = genRecvAddress(recvCoin, recvNetwork)
                          setRecvAddress(addr)
                          // record a view entry into common txs
                          const transaction: Transaction = {
                            id: genId(),
                            date: nowStr(),
                            coin: recvCoin,
                            network: recvNetwork,
                            qty: 0,
                            fee: 0,
                            gst: 0,
                            deb: 0,
                            recipient: '—',

                            recipientFull: 'Receive address viewed',
                            self: false,
                            status: 'Completed',
                            type: 'receive'
                          }
                          transactionsStore.add(transaction)
                        }}>ACKNOWLEDGE & VIEW ADDRESS</button>

                        {recvAddress && (
                          <div style={{ marginTop: 10 }}>
                            <div className="send-label" style={{ marginTop: 6 }}>Your deposit address</div>
                            <div className="recv-addr">{recvAddress}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </aside>
                </div>
              </motion.div>
            )}

            {/* ----------------- WITHDRAW TAB (REIMAGINED) ----------------- */}
            {/* ----------------- WITHDRAW TAB (Mobile-First Redesign) ----------------- */}
            {activeTab === 'withdraw' && (
              <motion.div
                key="withdraw"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-[1200px] mx-auto relative pb-24 lg:pb-0" // Added padding-bottom for mobile nav
              >
                {/* Ambient Glares */}
                {showGradients && (
                  <div className="absolute inset-0 pointer-events-none z-0 overflow-visible">
                    <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-blue-600/20 rounded-full blur-[120px] opacity-50" />
                    <div className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] bg-purple-600/20 rounded-full blur-[120px] opacity-50" />
                  </div>
                )}

                {/* MAIN CONTENT GRID */}
                {/* Mobile: Flex Column (Stack) | Desktop: Grid 12 Cols */}
                <div className="relative z-10 flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">

                  {/* --- SECTION 1: DESTINATION (Top on Mobile / Left on Desktop) --- */}
                  <div className="w-full lg:col-span-7 space-y-6">

                    {/* Mobile Header: "Where to?" */}
                    <div className="lg:hidden flex items-center justify-between mb-2">
                      <h2 className="text-2xl font-bold text-white">Withdraw</h2>
                      <button
                        onClick={() => {
                          setNewBank({ name: '', number: '', ifsc: '', type: 'Checking' })
                          setShowAddBank(true)
                        }}
                        className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20"
                      >
                        + Add Account
                      </button>
                    </div>

                    {/* Bank Selection Card */}
                    <section className="bg-gradient-to-br from-[#1a1f3d] to-[#13141b] border border-[#6a7bff]/20 rounded-3xl p-5 md:p-8 relative overflow-hidden shadow-2xl">
                      {/* Desktop Header */}
                      <div className="hidden lg:flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6a7bff] to-[#4f5eff] flex items-center justify-center text-white shadow-lg">
                            <Landmark size={22} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">Select Bank Account</h3>
                            <p className="text-[#8b90b2] text-sm">Choose destination</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setNewBank({ name: '', number: '', ifsc: '', type: 'Checking' })
                            setShowAddBank(true)
                          }}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6a7bff]/20 to-[#4f5eff]/20 hover:from-[#6a7bff] hover:to-[#4f5eff] border border-[#6a7bff]/50 transition-all"
                        >
                          + Link New
                        </button>
                      </div>

                      {/* Cards Stack/Grid */}
                      <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3">
                        {savedBanks.map((bank) => {
                          const isSelected = selectedBank === bank.id
                          return (
                            <div
                              key={bank.id}
                              onClick={() => setSelectedBank(bank.id)}
                              className={`
                    relative p-4 rounded-2xl border cursor-pointer transition-all duration-300 group flex items-center gap-4
                    ${isSelected
                                  ? (showGradients
                                    ? 'bg-gradient-to-r from-[#6a7bff]/20 to-[#1b1f4a] border-[#6a7bff] ring-1 ring-[#6a7bff]/50'
                                    : 'bg-[#6a7bff]/10 border-[#6a7bff]'
                                  )
                                  : 'bg-[#1b1f4a]/40 border-white/5 hover:bg-[#242655]'
                                }
                  `}
                            >
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner shrink-0 ${isSelected ? 'bg-[#0b0c10]' : 'bg-[#1f1f22]'}`}>
                                {bank.icon}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                  <h4 className={`font-bold text-base truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>{bank.name}</h4>
                                  {isSelected && <div className="text-blue-400 bg-blue-500/20 rounded-full p-1"><Check size={12} strokeWidth={3} /></div>}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0f1230] text-[#8b90b2] border border-white/5 uppercase">{bank.type}</span>
                                  <span className="text-xs text-slate-500 font-mono tracking-wider">•••• {bank.mask.slice(-4)}</span>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Instant Transfer (Mobile Optimized Row) */}
                      <div className="mt-6 pt-6 border-t border-[#6a7bff]/20">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm font-medium text-[#8b90b2]">Instant Transfer</span>
                          <span className="text-[10px] uppercase font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">Fast</span>
                        </div>

                        {/* Horizontal Scroll on Mobile for Methods */}
                        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar -mx-2 px-2 sm:grid sm:grid-cols-2 sm:overflow-visible sm:mx-0 sm:px-0">
                          {[
                            { id: 'upi', name: 'UPI', label: 'Instant', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 14L12 2L20 14H4Z" fill="#ff7f27" /><path d="M4 14L12 22L20 14H4Z" fill="#00baf2" /></svg> },
                            { id: 'paypal', name: 'PayPal', label: 'Connect', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M20.067 8.478c.492.3.844.768 1.054 1.405 0 0 .524 1.572.678 2.043.19.581-.237 1.041-1.054 1.041h-2.148l-.513 3.193c-.007.037-.024.068-.057.086a.2.2 0 0 1-.098.024h-2.31c-.133 0-.226-.122-.19-.25l.892-5.589-1.996-8.913a.465.465 0 0 1 .46-.576h2.95c.789 0 1.503.491 1.764 1.258l.618 2.378c.073.284.341.488.647.488h1.254c.481 0 .973-.085 1.411-.336.19-.109.288-.336.213-.54-.083-.223-.298-.363-.538-.363h-.043z" /></svg>, bg: 'bg-[#003087]' }
                          ].map((method) => {
                            const isSelected = selectedBank === method.id
                            return (
                              <button
                                key={method.id}
                                onClick={() => {
                                  if (method.id === 'upi' && !upiId) {
                                    setShowConnectModal('upi')
                                    return
                                  }
                                  if (method.id === 'paypal' && !paypalEmail) {
                                    setShowConnectModal('paypal')
                                    return
                                  }
                                  setSelectedBank(method.id)
                                }}
                                className={`
                          relative flex items-center gap-3 p-3 rounded-xl border transition-all min-w-[140px] sm:min-w-0 flex-1
                          ${isSelected
                                    ? (showGradients
                                      ? 'bg-gradient-to-r from-indigo-600/30 to-[#1b1f4a] border-indigo-500 ring-1 ring-indigo-500/50'
                                      : 'bg-indigo-600/20 border-indigo-500'
                                    )
                                    : 'bg-[#1b1f4a]/40 border-white/5 hover:bg-[#242655]'
                                  }
                        `}
                              >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${method.bg || 'bg-white'} ${!method.bg && 'text-black'}`}>
                                  {method.icon}
                                </div>
                                <div className="text-left">
                                  <div className="text-sm font-bold text-white">{method.name}</div>
                                  <div className="text-[10px] text-[#8b90b2]">
                                    {(method.id === 'upi' && upiId) ? upiId : (method.id === 'paypal' && paypalEmail) ? 'Connected' : method.label}
                                  </div>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* --- SECTION 2: AMOUNT (Bottom on Mobile / Right on Desktop) --- */}
                  <div className="w-full lg:col-span-5 h-full">
                    <section className="bg-gradient-to-br from-[#1a1f3d] to-[#13141b] border border-[#6a7bff]/20 rounded-3xl p-5 md:p-8 h-full flex flex-col relative overflow-hidden shadow-2xl">

                      <div className="flex justify-between items-center mb-6 relative z-10">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">💸</span>
                          <h3 className="text-lg font-bold text-white">Amount</h3>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setWithdrawAmount((investmentBalance * 0.5).toFixed(2))} className="text-[10px] font-bold bg-[#242655] text-[#8b90b2] px-3 py-1.5 rounded-lg hover:text-white transition-colors border border-white/5">50%</button>
                          <button onClick={() => setWithdrawAmount(investmentBalance.toFixed(2))} className="text-[10px] font-bold bg-[#6a7bff]/20 text-[#6a7bff] px-3 py-1.5 rounded-lg border border-blue-500/20">MAX</button>
                        </div>
                      </div>




                      {/* Input Box - BIG for Mobile */}
                      <div className="relative mb-6 relative z-10">
                        <div className="relative bg-[#0f1230] border border-[#6a7bff]/30 rounded-2xl p-4 flex flex-col justify-center h-28 focus-within:border-[#6a7bff] transition-colors">
                          <span className="text-[#8b90b2] text-xl font-light mb-1">$</span>
                          <input
                            type="number"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-transparent text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#6a7bff] outline-none placeholder-[#2a2c54] font-mono tracking-tight"
                          />
                          <div className="absolute right-4 top-4">
                            <span className="text-[10px] font-bold text-white bg-[#1a1c2e] px-2 py-1 rounded border border-white/5">USD</span>
                          </div>
                        </div>
                      </div>

                      {/* Breakdown List */}
                      <div className="bg-[#0f1016]/50 rounded-xl p-4 space-y-3 mb-6 border border-[#6a7bff]/10 relative z-10">
                        <div className="flex justify-between text-sm">
                          <span className="text-[#8b90b2]">Available</span>
                          <span className="text-white font-mono">${investmentBalance.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#8b90b2]">Fee (1%)</span>
                          <span className="text-[#ff6a6a] font-mono">-${((parseFloat(withdrawAmount) || 0) * 0.01).toFixed(2)}</span>
                        </div>
                        <div className="h-px bg-gradient-to-r from-transparent via-[#6a7bff]/50 to-transparent my-1" />
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-white font-bold">Receive</span>
                          <span className="text-2xl font-black text-[#6a7bff] font-mono">
                            ${((parseFloat(withdrawAmount) || 0) * 0.99).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>

                      {/* Confirm Button - Full Width */}
                      <button
                        disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || isWithdrawing}
                        onClick={() => {
                          const amt = parseFloat(withdrawAmount)
                          if (!amt) return

                          // Validation for UPI/PayPal
                          if (selectedBank === 'upi' && !upiId) {
                            showToast('Please enter a valid UPI ID', 'error')
                            return
                          }
                          if (selectedBank === 'paypal' && !paypalEmail) {
                            showToast('Please enter a PayPal email', 'error')
                            return
                          }

                          setIsWithdrawing(true)
                          setTimeout(() => {
                            investmentWallet.subtract(amt, 'Withdrawal')
                            setIsWithdrawing(false)
                            setWithdrawAmount('')

                            let dest = 'Bank Account'
                            if (selectedBank === 'upi') dest = `UPI (${upiId})`
                            else if (selectedBank === 'paypal') dest = `PayPal (${paypalEmail})`
                            else {
                              const b = savedBanks.find(x => x.id === selectedBank)
                              if (b) dest = `${b.name} (${b.mask})`
                            }

                            showToast(`Successfully withdrew $${amt.toFixed(2)} to ${dest}`, 'success')

                            // Reset optional fields
                            if (selectedBank === 'upi') setUpiId('')
                            if (selectedBank === 'paypal') setPaypalEmail('')

                          }, 1500)
                        }}
                        className={`
                w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all relative overflow-hidden group mt-auto z-10 shadow-lg
                ${!withdrawAmount
                            ? 'bg-[#1b1f4a] text-slate-500 cursor-not-allowed border border-white/5'
                            : 'bg-gradient-to-r from-[#6a7bff] to-[#22d3ee] text-white hover:scale-[1.02] active:scale-[0.98]'
                          }
             `}
                      >
                        {isWithdrawing ? (
                          <span className="animate-pulse">Processing...</span>
                        ) : (
                          <>Confirm <ArrowRight size={20} /></>
                        )}
                      </button>

                    </section>
                  </div>

                </div>
              </motion.div>
            )}

            {/* Generic Connect Modal (Reuse styles from Add Bank slightly) */}
            <AnimatePresence>
              {showConnectModal && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                >
                  <div className="absolute inset-0" onClick={() => setShowConnectModal(null)} />
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                    className="bg-[#1b1f4a] border border-[#6a7bff]/30 rounded-2xl p-8 w-full max-w-sm shadow-2xl relative z-10 flex flex-col items-center text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6a7bff] to-[#4f5eff] flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25">
                      {showConnectModal === 'upi'
                        ? <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M4 14L12 2L20 14H4Z" fill="white" /><path d="M4 14L12 22L20 14H4Z" fill="white" opacity="0.5" /></svg>
                        : <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M20.067 8.478c.492.3.844.768 1.054 1.405 0 0 .524 1.572.678 2.043.19.581-.237 1.041-1.054 1.041h-2.148l-.513 3.193c-.007.037-.024.068-.057.086a.2.2 0 0 1-.098.024h-2.31c-.133 0-.226-.122-.19-.25l.892-5.589-1.996-8.913a.465.465 0 0 1 .46-.576h2.95c.789 0 1.503.491 1.764 1.258l.618 2.378c.073.284.341.488.647.488h1.254c.481 0 .973-.085 1.411-.336.19-.109.288-.336.213-.54-.083-.223-.298-.363-.538-.363h-.043z" /></svg>
                      }
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2">Connect {showConnectModal === 'upi' ? 'UPI' : 'PayPal'}</h3>
                    <p className="text-[#8b90b2] text-sm mb-6">Enter your details to link this payment method for instant withdrawals.</p>

                    <div className="w-full text-left space-y-4 mb-6">
                      <div>
                        <label className="text-xs font-bold text-white uppercase tracking-wider mb-2 block">
                          {showConnectModal === 'upi' ? 'UPI ID' : 'PayPal Email'}
                        </label>
                        <input
                          autoFocus
                          className="w-full bg-[#0f1230] border border-[#2a2c54] rounded-xl p-4 text-white focus:border-[#6a7bff] outline-none transition-colors text-lg"
                          placeholder={showConnectModal === 'upi' ? 'username@oksbi' : 'you@example.com'}
                          value={showConnectModal === 'upi' ? upiId : paypalEmail}
                          onChange={e => showConnectModal === 'upi' ? setUpiId(e.target.value) : setPaypalEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (showConnectModal === 'upi' && !upiId) return
                        if (showConnectModal === 'paypal' && !paypalEmail) return

                        setSelectedBank(showConnectModal)
                        setShowConnectModal(null)
                        showToast(`Successfully connected ${showConnectModal === 'upi' ? 'UPI' : 'PayPal'}`, 'success')
                      }}
                      className="w-full py-4 bg-gradient-to-r from-[#6a7bff] to-[#4f5eff] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all active:scale-[0.98]"
                    >
                      Link Account
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showAddBank && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                >
                  <div className="absolute inset-0" onClick={() => setShowAddBank(false)} />
                  <motion.div
                    initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                    className="bg-[#1b1f4a] border border-[#2a2c54] rounded-2xl p-6 w-full max-w-md shadow-2xl relative z-10"
                  >
                    <h3 className="text-xl font-bold text-white mb-6">Link New Bank Account</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-[#8b90b2] mb-1.5 block">Bank Name</label>
                        <input
                          className="w-full bg-[#0f1230] border border-[#2a2c54] rounded-xl p-3 text-white focus:border-[#6a7bff] outline-none transition-colors"
                          placeholder="e.g. Bank of America"
                          value={newBank.name}
                          onChange={e => setNewBank({ ...newBank, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-[#8b90b2] mb-1.5 block">Account Number</label>
                        <input
                          className="w-full bg-[#0f1230] border border-[#2a2c54] rounded-xl p-3 text-white focus:border-[#6a7bff] outline-none transition-colors"
                          placeholder="XXXX-XXXX-XXXX"
                          type="password"
                          value={newBank.number}
                          onChange={e => setNewBank({ ...newBank, number: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-[#8b90b2] mb-1.5 block">IFSC Code</label>
                        <input
                          className="w-full bg-[#0f1230] border border-[#2a2c54] rounded-xl p-3 text-white focus:border-[#6a7bff] outline-none transition-colors uppercase"
                          placeholder="e.g. SBIN0001234"
                          value={newBank.ifsc}
                          onChange={e => setNewBank({ ...newBank, ifsc: e.target.value.toUpperCase() })}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-[#8b90b2] mb-1.5 block">Account Type</label>
                        <div className="flex gap-2">
                          {['Checking', 'Savings'].map(type => (
                            <button
                              key={type}
                              onClick={() => setNewBank({ ...newBank, type })}
                              className={`flex-1 py-2 rounded-lg text-sm border transition-colors
                                  ${newBank.type === type
                                  ? 'bg-[#6a7bff]/20 border-[#6a7bff] text-white'
                                  : 'bg-[#0f1230] border-transparent text-[#8b90b2] hover:bg-[#242655]'
                                }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-white/5 mt-6">
                        <button
                          onClick={() => setShowAddBank(false)}
                          className="flex-1 py-3 bg-[#0f1230] text-[#8b90b2] rounded-xl hover:text-white font-medium transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            if (!newBank.name || !newBank.number || !newBank.ifsc) {
                              alert('Please fill in all fields')
                              return
                            }

                            if (editingBankId) {
                              setSavedBanks(savedBanks.map(b =>
                                b.id === editingBankId
                                  ? { ...b, name: newBank.name, mask: `****${newBank.number.slice(-4)}`, type: newBank.type }
                                  : b
                              ))
                            } else {
                              setSavedBanks([...savedBanks, {
                                id: `bank_${Date.now()}`,
                                name: newBank.name,
                                mask: `****${newBank.number.slice(-4)}`,
                                type: newBank.type,
                                icon: '🏦'
                              }])
                            }

                            setNewBank({ name: '', number: '', ifsc: '', type: 'Checking' })
                            setEditingBankId(null)
                            setShowAddBank(false)
                          }}
                          className="flex-1 py-3 bg-[#6a7bff] text-white font-bold rounded-xl hover:bg-[#5b6ae0] transition-colors shadow-lg shadow-blue-500/20"
                        >
                          {editingBankId ? 'Save Changes' : 'Link Account'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>


            {/* Modern Transaction History */}
            <motion.div style={{ marginTop: '2rem' }} variants={fadeInUp}>
              <TransactionsTable transactions={transactions} />
            </motion.div>
          </AnimatePresence>

        </div>
      </motion.div>

      {/* Investment Notification */}
      <InvestmentNotification
        isVisible={showInvestmentNotification}
        amount={notificationAmount}
        sourceWallet={notificationSourceWallet}
        onInvest={handleInvestNow}
        onDismiss={handleDismissNotification}
      />

    </>
  )
}