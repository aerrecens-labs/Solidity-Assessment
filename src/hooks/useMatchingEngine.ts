import { useEffect, useRef } from 'react'
import { useDashboardStore } from '../store/dashboardStore'

export const useMatchingEngine = () => {
    const { processPriceUpdate, currentPrice } = useDashboardStore()
    const priceRef = useRef(currentPrice)

    // Simulate price movement
    useEffect(() => {
        // Sync ref with store initially
        priceRef.current = currentPrice

        const interval = setInterval(() => {
            const volatility = 0.0005 // 0.05% moves
            const change = 1 + (Math.random() * volatility * 2 - volatility)
            const newPrice = priceRef.current * change

            priceRef.current = newPrice
            processPriceUpdate(newPrice)
        }, 1000)

        return () => clearInterval(interval)
    }, []) // Run once on mount
}
