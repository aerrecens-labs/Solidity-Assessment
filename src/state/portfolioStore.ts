import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type InvestmentType = 'DeFi' | 'Staking' | 'Liquidity' | 'Other'

export interface Investment {
    id: string
    name: string
    type: InvestmentType
    amount: number
    apy: number
    startDate: string
    status: 'Active' | 'Completed'
    protocol?: string
}

interface PortfolioState {
    investments: Investment[]
    addInvestment: (inv: Investment) => void
    updateInvestment: (id: string, updates: Partial<Investment>) => void
    removeInvestment: (id: string) => void
    getTotalInvested: () => number
    getTotalProjectedYield: () => number
}

export const usePortfolioStore = create<PortfolioState>()(
    persist(
        (set, get) => ({
            investments: [],

            addInvestment: (inv) => set((state) => ({
                investments: [inv, ...state.investments]
            })),

            updateInvestment: (id, updates) => set((state) => ({
                investments: state.investments.map(inv =>
                    inv.id === id ? { ...inv, ...updates } : inv
                )
            })),

            removeInvestment: (id) => set((state) => ({
                investments: state.investments.filter((i) => i.id !== id)
            })),

            getTotalInvested: () => {
                return get().investments.reduce((sum, item) => sum + item.amount, 0)
            },

            getTotalProjectedYield: () => {
                return get().investments.reduce((sum, item) => {
                    return sum + (item.amount * (item.apy / 100))
                }, 0)
            }
        }),
        {
            name: 'user-portfolio-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
