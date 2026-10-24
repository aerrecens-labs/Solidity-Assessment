export interface WalletTransaction {
  id: string
  type: 'deposit' | 'withdrawal' | 'invest' | 'divest'
  amount: number
  date: string
  description: string
}

type Listener = (balance: number, transactions: WalletTransaction[]) => void

const LS_KEY_BALANCE = 'investment_wallet_balance_v1'
const LS_KEY_TRANSACTIONS = 'investment_wallet_transactions_v1'

function loadInitialBalance(): number {
  try {
    const raw = localStorage.getItem(LS_KEY_BALANCE)
    if (raw) return JSON.parse(raw)
  } catch { }
  return 0
}

function loadInitialTransactions(): WalletTransaction[] {
  try {
    const raw = localStorage.getItem(LS_KEY_TRANSACTIONS)
    if (raw) return JSON.parse(raw)
  } catch { }
  return []
}

class InvestmentWalletStore {
  private balance: number = loadInitialBalance()
  private transactions: WalletTransaction[] = loadInitialTransactions()
  private listeners: Set<Listener> = new Set()

  private persist() {
    try {
      localStorage.setItem(LS_KEY_BALANCE, JSON.stringify(this.balance))
      localStorage.setItem(LS_KEY_TRANSACTIONS, JSON.stringify(this.transactions))
    } catch { }
  }

  getBalance(): number {
    return this.balance
  }

  getTransactions(): WalletTransaction[] {
    return this.transactions
  }

  setBalance(amount: number) {
    this.balance = Math.max(0, amount)
    this.persist()
    this.emit()
  }

  add(amount: number, description: string = 'Deposit') {
    this.balance += amount
    this.addTransaction({
      type: 'deposit',
      amount,
      description
    })
    this.persist()
    this.emit()
  }

  subtract(amount: number, description: string = 'Withdrawal') {
    if (this.balance < amount) {
      console.warn('Insufficient funds')
      return false
    }
    this.balance = Math.max(0, this.balance - amount)
    this.addTransaction({
      type: description.toLowerCase().includes('invest') ? 'invest' : 'withdrawal',
      amount,
      description
    })
    this.persist()
    this.emit()
    return true
  }

  // Direct divestment (selling investment adds to wallet)
  divest(amount: number, description: string = 'Divestment') {
    this.balance += amount
    this.addTransaction({
      type: 'divest',
      amount,
      description
    })
    this.persist()
    this.emit()
  }

  private addTransaction(tx: Omit<WalletTransaction, 'id' | 'date'>) {
    const newTx: WalletTransaction = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      ...tx
    }
    this.transactions = [newTx, ...this.transactions]
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    // Initial call
    listener(this.balance, this.transactions)
    return () => this.listeners.delete(listener)
  }

  private emit() {
    this.listeners.forEach((l) => l(this.balance, this.transactions))
  }
}

export const investmentWallet = new InvestmentWalletStore()

// Dev helper
declare global { interface Window { investmentBalance?: any } }
if (typeof window !== 'undefined') {
  window.investmentBalance = {
    get: () => investmentWallet.getBalance(),
    set: (v: number) => investmentWallet.setBalance(v),
    add: (v: number) => investmentWallet.add(v),
    subtract: (v: number) => investmentWallet.subtract(v),
  }
}
