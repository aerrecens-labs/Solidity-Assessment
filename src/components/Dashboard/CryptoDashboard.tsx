import { useDashboardStore } from '../../store/dashboardStore'
import QuickTradeView from './Views/QuickTradeView'
import OrdersView from './Views/OrdersView'
import ExchangeView from './Views/ExchangeView'
import FuturesView from './Views/FuturesView'
import MarketView from './Views/MarketView'
import TreasuryView from './Views/TreasuryView'

export default function CryptoDashboard() {
    const { currentView } = useDashboardStore()

    // View Switcher logic
    const renderView = () => {
        switch (currentView) {
            case 'MARKET':
                return <MarketView />
            case 'TREASURY':
                return <TreasuryView />
            case 'QUICK':
                return <QuickTradeView />
            case 'EXCHANGE':
                return <ExchangeView />
            case 'FUTURES':
                return <FuturesView />
            case 'ORDERS':
                return <OrdersView />
            default:
                return <MarketView />
        }
    }

    return (
        <div className="h-full w-full bg-[#0b0e14] text-slate-200 flex flex-col overflow-hidden">
            <div className="flex-1 relative overflow-hidden flex flex-col">
                {renderView()}
            </div>
        </div>
    )
}
