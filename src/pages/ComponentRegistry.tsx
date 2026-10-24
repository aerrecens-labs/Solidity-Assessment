import React from 'react'

// Common
import { InvestmentNotification } from '../components/common/InvestmentNotification'
import { Toast } from '../components/common/Toast'
// Wallet
import { BalanceCard } from '../components/wallet/BalanceCard'
import { InvestmentCard as WalletInvestmentCard } from '../components/wallet/InvestmentCard'
import { StatusBadge } from '../components/wallet/StatusBadge'
// Investment
import InvestmentCard from '../components/Investment/InvestmentCard'
import RiskBadge from '../components/Investment/RiskBadge'
import InvestmentOptions from '../components/Investment/InvestmentOptions'

// Trading
import CustomChart from '../components/Dashboard/Components/CustomChart'
import OrderBook from '../components/Dashboard/Components/OrderBook'
import TradeForm from '../components/Dashboard/Components/TradeForm'
import LeverageSlider from '../components/Dashboard/Components/LeverageSlider'
import ExchangeView from '../components/Dashboard/Views/ExchangeView'
import FuturesView from '../components/Dashboard/Views/FuturesView'

const MOCK_CANDLES = Array.from({ length: 50 }, (_, i) => ({
    time: Date.now() - (50 - i) * 60000 * 15,
    open: 64000 + Math.random() * 100,
    high: 64200 + Math.random() * 100,
    low: 63900 + Math.random() * 100,
    close: 64100 + Math.random() * 100,
    volume: Math.random() * 100
}))

const MOCK_INV_OPTIONS = [
    { id: '1', name: 'Stable Saver', risk: 'Low', apy: 4.5, icon: <span>🛡️</span>, description: 'Low risk stablecoin strategy.' },
    { id: '2', name: 'ETH Staking', risk: 'Medium', apy: 8.2, icon: <span>💎</span>, description: 'Liquid staking on Ethereum.' },
    { id: '3', name: 'Degen Farm', risk: 'High', apy: 24.5, icon: <span>🚀</span>, description: 'High risk LP farming.' }
]



// Placeholder for missing components or complex ones
const Placeholder = ({ name }: { name: string }) => (
    <div className="p-8 text-center border mr-auto ml-auto border-dashed border-zinc-700 rounded-xl bg-zinc-900/50">
        <p className="text-zinc-400">Preview not available for <code className="text-white">{name}</code></p>
        <p className="text-xs text-zinc-500 mt-2">Component requires complex context or state.</p>
    </div>
)

export const componentRegistry: Record<string, any> = {
    // --- COMMON ---
    'common/InvestmentNotification.tsx': {
        component: InvestmentNotification,
        props: {
            isVisible: true,
            amount: 1250,
            sourceWallet: 'Bitcoin Wallet',
            onInvest: () => alert('Invest Clicked'),
            onDismiss: () => alert('Dismiss Clicked')
        },
        container: 'relative h-[200px] w-full flex items-center justify-center'
    },
    'common/Toast.tsx': {
        component: Toast,
        props: {
            open: true,
            message: 'Transaction completed successfully',
            type: 'success',
            onClose: () => { }
        },
        container: 'relative h-32 w-full flex items-center justify-center'
    },

    // --- WALLET ---
    'wallet/BalanceCard.tsx': {
        component: BalanceCard,
        props: {
            title: 'Total Balance',
            amount: 12450.55,
            trend: 12.5,
            icon: 'BTC'
        },
        container: 'w-[350px]'
    },
    'wallet/StatusBadge.tsx': {
        component: StatusBadge,
        props: { status: 'Completed' },
        container: 'flex gap-4'
    },
    'wallet/InvestmentCard.tsx': {
        component: WalletInvestmentCard,
        props: {
            item: {
                id: '1',
                name: 'DeFi High Yield',
                amount: 5000,
                currentValue: 5250,
                roi: 5,
                type: 'staking'
            }
        },
        container: 'w-[400px]'
    },

    // --- INVESTMENT ---
    'Investment/InvestmentCard.tsx': {
        component: InvestmentCard,
        props: {
            title: 'Ethereum Staking',
            risk: 'Medium',
            minInvest: 100,
            apy: 5.2,
            tvl: '50M',
            description: 'Stake ETH to earn rewards on the Ethereum network.',
            onInvest: () => alert('Invest')
        },
        container: 'w-[350px]'
    },
    'Investment/RiskBadge.tsx': {
        component: RiskBadge,
        props: { level: 'High' },
        container: 'p-8'
    },
    'Investment/InvestmentOptions.tsx': {
        component: InvestmentOptions,
        props: {
            options: MOCK_INV_OPTIONS,
            selectedAmount: 10000,
            onOptionSelect: (opt: any) => alert(`Selected ${opt.name}`),
            onEditAmount: () => alert('Edit Amount')
        },
        container: 'w-full max-w-4xl'
    },

    // --- TRADING DASHBOARD ---
    'Dashboard/Components/CustomChart.tsx': {
        component: CustomChart,
        props: { data: MOCK_CANDLES, lastPrice: 64123.45 },
        container: 'w-full h-[400px]'
    },
    'Dashboard/Components/OrderBook.tsx': {
        component: OrderBook,
        props: { price: 64123.45 },
        container: 'w-[300px] h-[600px] bg-[#151926]'
    },
    'Dashboard/Components/TradeForm.tsx': {
        component: TradeForm,
        props: { price: 64123.45, type: 'SPOT' },
        container: 'w-[300px]'
    },
    'Dashboard/Components/LeverageSlider.tsx': {
        component: LeverageSlider,
        props: {},
        container: 'w-[300px] p-4 bg-[#151926]'
    },
    'Dashboard/Views/ExchangeView.tsx': {
        component: ExchangeView,
        props: {},
        container: 'w-full h-[800px]'
    },
    'Dashboard/Views/FuturesView.tsx': {
        component: FuturesView,
        props: {},
        container: 'w-full h-[800px]'
    }
}

export const getComponent = (file: string) => {
    return componentRegistry[file] || {
        component: () => <Placeholder name={file} />,
        props: {},
        container: 'w-full flex justify-center'
    }
}
