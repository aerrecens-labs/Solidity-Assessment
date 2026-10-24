import { create } from 'zustand'
import { MARKET_DATA, MarketCoin } from '../data/appData'

// Re-exporting for compatibility, or we could update all consumers
export type Coin = MarketCoin

interface MarketState {
    coins: Coin[]
    searchQuery: string
    activeFilter: string
    selectedCoin: Coin | null // For the detail modal

    // Actions
    setSearchQuery: (query: string) => void
    setFilter: (filter: string) => void
    selectCoin: (coin: Coin | null) => void
    refreshPrices: () => void // Simulates live updates
}

export const useMarketStore = create<MarketState>((set) => ({
    coins: MARKET_DATA, // Initialize from central source
    searchQuery: '',
    activeFilter: 'ALL',
    selectedCoin: null,

    setSearchQuery: (query) => set({ searchQuery: query }),
    setFilter: (filter) => set({ activeFilter: filter }),
    selectCoin: (coin) => set({ selectedCoin: coin }),
    refreshPrices: () => set((state) => ({
        coins: state.coins.map(coin => ({
            ...coin,
            price: coin.price * (1 + (Math.random() * 0.02 - 0.01)), // Fluctuates +/- 1%
            change24h: coin.change24h + (Math.random() * 0.2 - 0.1) // Fluctuates +/- 0.1%
        }))
    }))
}))
