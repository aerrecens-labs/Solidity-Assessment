import { Network, Shield, BarChart3 } from 'lucide-react'
import React from 'react'

export interface Protocol {
    name: string
    type: string
    allocation: string
}

export interface InvestmentOption {
    id: string
    name: string
    apy: number
    risk: 'Low' | 'Medium' | 'High'
    description: string
    icon?: React.ReactNode
    type?: string // For compatibility
}

// Investment Options Configuration
export const INVESTMENT_OPTIONS: InvestmentOption[] = [
    {
        id: 'defi',
        name: 'DeFi Protocols',
        apy: 8.5,
        risk: 'Medium',
        description: 'Earn yield through decentralized finance protocols like lending, borrowing, and yield farming. Medium volatility with moderate risk exposure.',
        type: 'DeFi'
    },
    {
        id: 'staking',
        name: 'Crypto Staking',
        apy: 5.2,
        risk: 'Low',
        description: 'Stake your cryptocurrency assets to earn passive income through validator rewards. Lower volatility with reduced risk exposure.',
        type: 'Staking'
    },
    {
        id: 'liquidity',
        name: 'Liquidity Mining',
        apy: 12.3,
        risk: 'High',
        description: 'Provide liquidity to decentralized exchanges and earn trading fees. High volatility with significant risk exposure.',
        type: 'Liquidity'
    }
]

// Mock Performance Data Generators
export const getPerformanceData = (baseValue = 1000, volatility = 0.1) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']
    let currentValue = baseValue

    return months.map(date => {
        const change = (Math.random() - 0.4) * volatility // Slight upward bias
        currentValue = currentValue * (1 + change)
        return { date, value: Math.round(currentValue) }
    })
}

// Mock Holdings Data
export const HOLDINGS_DATA: Protocol[] = [
    { name: 'Uniswap V3 USDC/ETH', type: 'Liquidity Pool', allocation: '18.5%' },
    { name: 'Aave USDT Lending', type: 'Lending', allocation: '15.2%' },
    { name: 'Compound ETH Staking', type: 'Staking', allocation: '12.8%' },
    { name: 'Curve 3Pool LP', type: 'Liquidity Pool', allocation: '11.4%' },
    { name: 'Yearn USDC Vault', type: 'Yield Farming', allocation: '9.7%' },
    { name: 'Lido Staked ETH', type: 'Liquid Staking', allocation: '8.4%' },
    { name: 'Balancer 80/20', type: 'Liquidity Pool', allocation: '7.1%' },
]

export const getHoldingsForType = (type: string) => {
    // Simple randomization for variety based on type
    return HOLDINGS_DATA.sort(() => 0.5 - Math.random()).slice(0, 5)
}

export const getRandomManager = () => {
    const managers = [
        { name: 'Alex Chen', role: 'DeFi Capital', exp: '8 Years', aum: '$2.4B', return: '+156%' },
        { name: 'Sarah Wu', role: 'Yield Ops', exp: '6 Years', aum: '$1.1B', return: '+98%' },
        { name: 'Mike Ross', role: 'Alpha Strategies', exp: '10 Years', aum: '$4.2B', return: '+210%' },
    ]
    return managers[Math.floor(Math.random() * managers.length)]
}
