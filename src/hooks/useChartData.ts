import { useState, useEffect, useRef } from 'react'
import { MARKET_DATA } from '../data/appData'

export interface Candle {
    time: number
    open: number
    high: number
    low: number
    close: number
    volume: number
}

// Generate initial history
const generateHistory = (count: number, symbol: string): Candle[] => {
    const coin = MARKET_DATA.find(c => symbol.includes(c.symbol))
    let price = coin ? coin.price : 100.00 // Default to 100 if unknown
    const data: Candle[] = []
    const now = Date.now()

    for (let i = count; i > 0; i--) {
        const time = now - i * 60 * 1000 // 1m intervals
        const volatility = price * 0.002
        const change = (Math.random() - 0.5) * volatility

        const open = price
        const close = price + change
        const high = Math.max(open, close) + Math.random() * volatility * 0.5
        const low = Math.min(open, close) - Math.random() * volatility * 0.5
        const volume = Math.random() * 50 + 10

        data.push({
            time,
            open,
            high,
            low,
            close,
            volume
        })
        price = close
    }
    return data
}

export function useChartData(symbol: string = 'BTC/USDT') {
    const [data, setData] = useState<Candle[]>([])
    const [lastPrice, setLastPrice] = useState(0)

    // Initial Load
    useEffect(() => {
        const history = generateHistory(100, symbol)
        setData(history)
        setLastPrice(history[history.length - 1].close)
    }, [symbol])

    // Live Ticker Simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setData(prev => {
                if (prev.length === 0) return prev

                const lastCandle = { ...prev[prev.length - 1] }
                const now = Date.now()
                const volatility = lastCandle.close * 0.0005
                const change = (Math.random() - 0.5) * volatility

                // Update or New Candle logic (Simplified: Update last candle for simulation)
                // In a real app, we'd check time boundaries

                const newPrice = lastCandle.close + change

                lastCandle.close = newPrice
                lastCandle.high = Math.max(lastCandle.high, newPrice)
                lastCandle.low = Math.min(lastCandle.low, newPrice)
                lastCandle.volume += Math.random() * 2

                setLastPrice(newPrice)

                // Return new array with simulated "live" update (Keep last 200 points to prevent lag)
                const newData = [...prev.slice(0, -1), lastCandle]
                if (newData.length > 200) return newData.slice(-200)
                return newData
            })
        }, 1000) // 1s ticks

        return () => clearInterval(interval)
    }, [])

    // Derived Stats
    const stats = {
        price: lastPrice,
        change: data.length > 0 ? ((lastPrice - data[0].open) / data[0].open) * 100 : 0,
        high: Math.max(...data.map(d => d.high)),
        low: Math.min(...data.map(d => d.low)),
        volume: data.reduce((acc, d) => acc + d.volume, 0)
    }

    return { data, lastPrice, stats }
}
