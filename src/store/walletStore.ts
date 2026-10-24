import { create } from 'zustand'

export interface BankAccount {
    id: string
    name: string
    icon: string // URL or Lucide icon name placeholder
    last4: string
    type: 'Bank' | 'Wallet'
}

interface WalletState {
    balance: number
    accounts: BankAccount[]
    activeAccountId: string | null

    // Actions
    setActiveAccount: (id: string) => void
    withdraw: (amount: number) => Promise<void>
}

const MOCK_ACCOUNTS: BankAccount[] = [
    { id: 'chase', name: 'Chase Bank', icon: '🏦', last4: '8842', type: 'Bank' },
    { id: 'wf', name: 'Wells Fargo', icon: '🏛️', last4: '1290', type: 'Bank' },
    { id: 'paypal', name: 'PayPal', icon: '🅿️', last4: 'user@gmail.com', type: 'Wallet' },
]

export const useWalletStore = create<WalletState>((set) => ({
    balance: 34520.50, // Available USD
    accounts: MOCK_ACCOUNTS,
    activeAccountId: 'chase',

    setActiveAccount: (id) => set({ activeAccountId: id }),
    withdraw: async (amount) => {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                set((state) => ({ balance: state.balance - amount }))
                resolve()
            }, 2000)
        })
    }
}))
