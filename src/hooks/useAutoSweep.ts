import { useEffect } from 'react'
import { useDashboardStore } from '../store/dashboardStore'
import { cryptoStore, type CryptoSymbol } from '../state/cryptoStore'

// Helper to get settings (using same localStorage key as ProfileModal)
const getSweepSettings = () => {
    try {
        return JSON.parse(localStorage.getItem('wallet_sweep_settings') || '{}')
    } catch {
        return {}
    }
}

export const useAutoSweep = () => {
    const { addNotification } = useDashboardStore()

    useEffect(() => {
        const interval = setInterval(() => {
            const settings = getSweepSettings()

            // Iterate over all settings keys (e.g. BTC, ETH, BAT, SEPOLIA_ETH)
            Object.entries(settings).forEach(([key, config]: [string, any]) => {
                if (config?.enabled && config?.threshold) {
                    const symbol = key as CryptoSymbol
                    const threshold = parseFloat(config.threshold)
                    // Get balance from the comprehensive cryptoStore
                    const balance = cryptoStore.get(symbol)

                    if (balance > threshold) {
                        const sweepAmount = balance - threshold

                        // Prevent tiny dust sweeps (logic varies by token value, but simplifed > 0)
                        if (sweepAmount > 0) {
                            // Execute Sweep: Deduct from wallet
                            cryptoStore.delta(symbol, -sweepAmount, 'Auto Sweep to Vault')

                            // Notify User
                            addNotification('INFO', `Auto Sweep: Moved ${sweepAmount.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${symbol} to Vault`)

                            // NOTE: In a real app, we would add this 'sweepAmount' to an Investment/Vault store.
                            // For this mock, removing it from the active wallet satisfies the "threshold" logic.
                        }
                    }
                }
            })

        }, 10000) // Check every 10 seconds

        return () => clearInterval(interval)
    }, [addNotification])
}
