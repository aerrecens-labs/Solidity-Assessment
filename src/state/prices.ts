import type { CryptoSymbol } from './cryptoStore'

export interface PriceData {
  price: number
  change24h: number // Percentage change
}

type Listener = (prices: Record<CryptoSymbol, PriceData>) => void

const LS_KEY = 'crypto_prices_v2'

function loadInitial(): Record<CryptoSymbol, PriceData> {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return JSON.parse(raw)
  } catch { }

  // Default fallbacks with some mock changes
  return {
    BTC: { price: 65000, change24h: 2.4 },
    ETH: { price: 3300, change24h: -1.2 },
    USDT: { price: 1, change24h: 0.01 },
    SOL: { price: 150, change24h: 5.6 },
    BAT: { price: 0.25, change24h: 0.5 },
    SEPOLIA_ETH: { price: 13, change24h: 0 },
  }
}

class PricesStore {
  private data: Record<CryptoSymbol, PriceData> = loadInitial()
  private listeners: Set<Listener> = new Set()
  private interval: any

  constructor() {
    this.startSimulation()
  }

  private persist() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(this.data)) } catch { }
  }

  getAll(): Record<CryptoSymbol, PriceData> { return { ...this.data } }

  get(symbol: CryptoSymbol): PriceData {
    return this.data[symbol] ?? { price: 0, change24h: 0 }
  }

  getPrice(symbol: CryptoSymbol): number {
    return this.get(symbol).price
  }

  set(symbol: CryptoSymbol, price: number, change24h?: number) {
    const current = this.data[symbol] || { price: 0, change24h: 0 }
    this.data[symbol] = {
      price,
      change24h: change24h ?? current.change24h
    }
    this.persist()
    this.emit()
  }

  subscribe(l: Listener) { this.listeners.add(l); return () => this.listeners.delete(l) }

  private emit() { const snap = this.getAll(); this.listeners.forEach(l => l(snap)) }

  private startSimulation() {
    // Simulate live market ticking every 5 seconds
    this.interval = setInterval(() => {
      let changed = false
      Object.keys(this.data).forEach((key) => {
        const symbol = key as CryptoSymbol
        if (symbol === 'USDT') return

        const current = this.data[symbol]
        const volatility = 0.002 // 0.2% movement per tick max
        const move = 1 + (Math.random() * volatility * 2 - volatility)

        // Update price
        const newPrice = current.price * move

        // Update 24h change slightly to look alive
        const changeDrift = (Math.random() - 0.5) * 0.1

        this.data[symbol] = {
          price: newPrice,
          change24h: current.change24h + changeDrift
        }
        changed = true
      })

      if (changed) {
        this.persist()
        this.emit()
      }
    }, 5000)
  }
}

export const prices = new PricesStore()

declare global { interface Window { cryptoPrices?: any } }
if (typeof window !== 'undefined') {
  window.cryptoPrices = {
    get: (s?: CryptoSymbol) => (s ? prices.get(s) : prices.getAll()),
    set: (s: CryptoSymbol, v: number, c?: number) => prices.set(s, v, c),
  }
}
