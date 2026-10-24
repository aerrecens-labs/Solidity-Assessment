import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Home,
    LayoutDashboard,
    Wallet,
    Layers,
    PieChart,
    TrendingUp,
    ShoppingBag,
    Landmark,
    ArrowRight,
    Map as MapIcon,
    FlaskConical,
    CircleDollarSign,
    FileCode,
    Construction,
    Ghost
} from 'lucide-react'

export default function SiteMap() {
    const navigate = useNavigate()

    const sections = [
        {
            heading: 'Core Experience',
            items: [
                {
                    title: 'Landing Page',
                    file: 'Landing.tsx',
                    path: '/',
                    icon: <Home size={20} className="text-blue-400" />,
                    desc: 'Public marketing homepage.'
                },
                {
                    title: 'Marketplace (Home)',
                    file: 'Dashboard.tsx', // Component acting as page
                    path: '/app/overview',
                    icon: <LayoutDashboard size={20} className="text-blue-400" />,
                    desc: 'Main Cinematic Marketplace & Pulse.'
                },
                {
                    title: 'Wallets',
                    file: 'Wallets.tsx',
                    path: '/app/wallets',
                    icon: <Wallet size={20} className="text-purple-400" />,
                    desc: 'Interactive wallet management.'
                },
            ]
        },
        {
            heading: 'Finance & Investment',
            items: [
                {
                    title: 'Portfolio (Main)',
                    file: 'Portfolio.tsx',
                    path: '/app/portfolio',
                    icon: <PieChart size={20} className="text-green-400" />,
                    desc: 'Asset allocation overview.'
                },
                {
                    title: 'Portfolio (Main)',
                    file: 'Portfolio.tsx',
                    path: '/app/portfolio',
                    icon: <PieChart size={20} className="text-green-400" />,
                    desc: 'Asset allocation overview.'
                },
                {
                    title: 'Investment Hub',
                    file: 'Investment.tsx',
                    path: '/app/investment',
                    icon: <TrendingUp size={20} className="text-amber-400" />,
                    desc: 'Investment strategies dashboard.'
                },
                {
                    title: 'Inv. Portfolio',
                    file: 'InvestmentPortfolio.tsx',
                    path: '/app/investment-portfolio',
                    icon: <Landmark size={20} className="text-indigo-400" />,
                    desc: 'Detailed investment performance.'
                },
                {
                    title: 'Inv. Detail',
                    file: 'InvestmentDetail.tsx',
                    path: '/app/investment-detail',
                    icon: <Layers size={20} className="text-indigo-300" />,
                    desc: 'Specific investment drill-down.'
                },
                {
                    title: 'Crypto Fund',
                    file: 'MutualFundDetail.tsx',
                    path: '/app/crypto-fund',
                    icon: <CircleDollarSign size={20} className="text-cyan-400" />,
                    desc: 'Mutual fund details page.'
                },
                {
                    title: 'Marketplace',
                    file: 'Marketplace.tsx',
                    path: '/app/trade/BTC',
                    icon: <ShoppingBag size={20} className="text-pink-400" />,
                    desc: 'Trading interface (Symbol param required).'
                },
            ]
        },
        {
            heading: 'Experimental & Dev',
            items: [
                {
                    title: 'Test Portfolio',
                    file: 'TestPortfolio.tsx',
                    path: '/app/test-portfolio',
                    icon: <FlaskConical size={20} className="text-orange-400" />,
                    desc: 'Sandbox for portfolio experiments.'
                },
                {
                    title: 'Crypto Test',
                    file: 'CryptoTest.tsx',
                    path: '/app/crypto-test',
                    icon: <FileCode size={20} className="text-slate-400" />,
                    desc: 'Backend/API integration test page.'
                },
                {
                    title: 'Wallet (Single)',
                    file: 'Wallet.tsx',
                    path: '/app/wallet',
                    icon: <Wallet size={20} className="text-slate-500" />,
                    desc: 'Single wallet view (legacy/dev).'
                },
                {
                    title: 'Wallet (Combined)',
                    file: 'WalletCombined.tsx',
                    path: '/app/wallet-combined',
                    icon: <Layers size={20} className="text-slate-500" />,
                    desc: 'Aggregate wallet view prototype.'
                },
            ]
        },
        {
            heading: 'Components: Investment',
            items: [
                { title: 'ConfirmationModal', file: 'Investment/ConfirmationModal.tsx', path: null, icon: <Layers size={20} className="text-slate-500" />, desc: 'Modal' },
                { title: 'Amount Input', file: 'Investment/InvestmentAmountInput.tsx', path: null, icon: <Layers size={20} className="text-slate-500" />, desc: 'Input' },
                { title: 'Inv. Card', file: 'Investment/InvestmentCard.tsx', path: null, icon: <Layers size={20} className="text-slate-500" />, desc: 'Card' },
                { title: 'Options List', file: 'Investment/InvestmentOptions.tsx', path: null, icon: <Layers size={20} className="text-slate-500" />, desc: 'List' },
                { title: 'Review Screen', file: 'Investment/InvestmentReview.tsx', path: null, icon: <Layers size={20} className="text-slate-500" />, desc: 'View' },
                { title: 'Tutorial', file: 'Investment/InvestmentTutorial.tsx', path: null, icon: <Layers size={20} className="text-slate-500" />, desc: 'Guide' },
                { title: 'Risk Badge', file: 'Investment/RiskBadge.tsx', path: null, icon: <Layers size={20} className="text-slate-500" />, desc: 'UI' },
                { title: 'Tour Overlay', file: 'Investment/TourOverlay.tsx', path: null, icon: <Layers size={20} className="text-slate-500" />, desc: 'UI' },
                { title: 'Tutorial Modal', file: 'Investment/TutorialModal.tsx', path: null, icon: <Layers size={20} className="text-slate-500" />, desc: 'Modal' },
                { title: 'Chart', file: 'InvestmentChart/InvestmentChart.tsx', path: null, icon: <PieChart size={20} className="text-slate-500" />, desc: 'Chart' },
            ]
        },
        {
            heading: 'Components: Wallet',
            items: [
                { title: 'Balance Card', file: 'wallet/BalanceCard.tsx', path: null, icon: <Wallet size={20} className="text-slate-500" />, desc: 'UI' },
                { title: 'Copy Hash', file: 'wallet/CopyableHash.tsx', path: null, icon: <FileCode size={20} className="text-slate-500" />, desc: 'Tool' },
                { title: 'Inv. Card', file: 'wallet/InvestmentCard.tsx', path: null, icon: <Wallet size={20} className="text-slate-500" />, desc: 'Card' },
                { title: 'Sparkline', file: 'wallet/Sparkline.tsx', path: null, icon: <TrendingUp size={20} className="text-slate-500" />, desc: 'Chart' },
                { title: 'Status Badge', file: 'wallet/StatusBadge.tsx', path: null, icon: <FileCode size={20} className="text-slate-500" />, desc: 'UI' },
                { title: 'TX Detail', file: 'wallet/TransactionDetailModal.tsx', path: null, icon: <Layers size={20} className="text-slate-500" />, desc: 'Modal' },
                { title: 'TX Table', file: 'wallet/TransactionsTable.tsx', path: null, icon: <Layers size={20} className="text-slate-500" />, desc: 'Table' },
                { title: 'Coin Display', file: 'CryptoPortfolio/CryptoPortfolio.tsx', path: null, icon: <PieChart size={20} className="text-slate-500" />, desc: 'UI' },
            ]
        },
        {
            heading: 'Components: Common & Layout',
            items: [
                { title: 'Main Layout', file: 'Layout/Layout.tsx', path: null, icon: <Layers size={20} className="text-slate-500" />, desc: 'Shell' },
                { title: 'Error Boundary', file: 'common/ErrorBoundary.tsx', path: null, icon: <Construction size={20} className="text-red-500" />, desc: 'System' },
                { title: 'Gooey Nav', file: 'common/GooeyNav.tsx', path: null, icon: <Layers size={20} className="text-slate-500" />, desc: 'Nav' },
                { title: 'Notification', file: 'common/InvestmentNotification.tsx', path: null, icon: <Ghost size={20} className="text-slate-500" />, desc: 'Toast' },
                { title: 'Modal', file: 'common/Modal.tsx', path: null, icon: <Layers size={20} className="text-slate-500" />, desc: 'UI' },
                { title: 'Profile', file: 'common/ProfileModal.tsx', path: null, icon: <Layers size={20} className="text-slate-500" />, desc: 'Modal' },
                { title: 'Toast', file: 'common/Toast.tsx', path: null, icon: <Ghost size={20} className="text-slate-500" />, desc: 'Toast' },
                { title: 'Rolling Num', file: 'RollingNumber.tsx', path: null, icon: <FileCode size={20} className="text-slate-500" />, desc: 'Anim' },
                { title: 'Token Card', file: 'TokenCard/TokenCard.tsx', path: null, icon: <Wallet size={20} className="text-slate-500" />, desc: 'Card' },
            ]
        },
        {
            heading: 'Trading Dashboard',
            items: [
                { title: 'Exchange View', file: 'Dashboard/Views/ExchangeView.tsx', path: null, icon: <LayoutDashboard size={20} className="text-slate-500" />, desc: 'Spot Trading UI' },
                { title: 'Futures View', file: 'Dashboard/Views/FuturesView.tsx', path: null, icon: <LayoutDashboard size={20} className="text-slate-500" />, desc: 'Perpetual Trading UI' },
                { title: 'Chart', file: 'Dashboard/Components/CustomChart.tsx', path: null, icon: <PieChart size={20} className="text-slate-500" />, desc: 'Interactive Chart' },
                { title: 'Order Book', file: 'Dashboard/Components/OrderBook.tsx', path: null, icon: <Layers size={20} className="text-slate-500" />, desc: 'Depth Display' },
                { title: 'Trade Form', file: 'Dashboard/Components/TradeForm.tsx', path: null, icon: <FileCode size={20} className="text-slate-500" />, desc: 'Order Entry' },
                { title: 'Leverage Slider', file: 'Dashboard/Components/LeverageSlider.tsx', path: null, icon: <TrendingUp size={20} className="text-slate-500" />, desc: 'Input' },
            ]
        },
        {
            heading: 'System & Unused',
            items: [
                {
                    title: 'Site Map',
                    file: 'SiteMap.tsx',
                    path: '/sitemap',
                    icon: <MapIcon size={20} className="text-white" />,
                    desc: 'This page.'
                },
                {
                    title: 'Coming Soon',
                    file: 'ComingSoon.tsx',
                    path: null,
                    icon: <Construction size={20} className="text-yellow-600" />,
                    desc: 'Placeholder page (Not Routed).'
                },
                {
                    title: 'Portfolio Crypto',
                    file: 'portfolio-crypto.tsx',
                    path: null,
                    icon: <Ghost size={20} className="text-gray-600" />,
                    desc: 'Legacy file (Not Routed).'
                },
            ]
        }
    ]

    // --- MODAL STATE ---
    const [selectedComponent, setSelectedComponent] = React.useState<string | null>(null)
    const [Renderer, setRenderer] = React.useState<any>(null)

    const handleComponentClick = (file: string) => {
        // Dynamically load from registry
        import('./ComponentRegistry').then(mod => {
            const { component: Comp, props, container } = mod.getComponent(file)
            setRenderer({ Comp, props, container, name: file })
            setSelectedComponent(file)
        })
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans selection:bg-blue-500/30">
            {/* --- COMPONENT PREVIEW MODAL --- */}
            {selectedComponent && Renderer && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setSelectedComponent(null)}>
                    <div
                        className="bg-[#18181b] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#131418]">
                            <div className="flex items-center gap-3">
                                <FileCode size={20} className="text-blue-400" />
                                <div>
                                    <h3 className="font-bold text-white text-sm">{Renderer.name}</h3>
                                    <p className="text-xs text-slate-400">Interactive Preview</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedComponent(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <span className="sr-only">Close</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Preview Area (Centered Canvas) */}
                        <div className="flex-1 overflow-auto bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-[#09090b] flex items-center justify-center p-8 min-h-[400px]">
                            <div className={`${Renderer.container || ''} transition-all duration-500`}>
                                <Renderer.Comp {...Renderer.props} />
                            </div>
                        </div>

                        {/* Footer (Props Inspector placeholder) */}
                        <div className="p-3 bg-[#0a0a0a] border-t border-white/5 text-[10px] font-mono text-slate-500 flex justify-between">
                            <span>Rendering with default mock props</span>
                            <span>Press ESC to close</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                {/* ... existing header ... */}
                <header className="mb-16 flex flex-col md:flex-row md:items-center gap-6 border-b border-white/5 pb-8">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-900/40 ring-1 ring-white/10">
                        <MapIcon size={32} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-white mb-2">
                            Project Atlas
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl">
                            Complete directory of all <code className="bg-white/10 px-1.5 py-0.5 rounded text-slate-300 text-base">src/pages</code> files and their access points.
                        </p>
                    </div>
                </header>

                <div className="space-y-16">
                    {sections.map((section) => (
                        <div key={section.heading} className="animate-fade-in-up">
                            <h2 className="text-xl font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-3">
                                <span className="w-8 h-[2px] bg-slate-700"></span>
                                {section.heading}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {section.items.map((item) => (
                                    <div
                                        key={item.title}
                                        onClick={() => {
                                            if (item.path) {
                                                navigate(item.path)
                                            } else if (section.heading.startsWith('Components')) {
                                                handleComponentClick(item.file)
                                            }
                                        }}
                                        className={`
                      group relative border rounded-xl p-5 transition-all duration-300
                      ${(item.path || section.heading.startsWith('Components'))
                                                ? 'bg-[#0f1014] border-white/5 hover:border-blue-500/30 hover:bg-[#15161c] hover:shadow-xl hover:shadow-blue-900/10 cursor-pointer'
                                                : 'bg-[#0a0a0a] border-white/5 opacity-60 cursor-not-allowed grayscale'}
                    `}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`p-2.5 rounded-lg ${(item.path || section.heading.startsWith('Components')) ? 'bg-white/5 group-hover:bg-white/10' : 'bg-white/5'}`}>
                                                {item.icon}
                                            </div>
                                            {item.path ? (
                                                <ArrowRight size={16} className="text-slate-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-1" />
                                            ) : section.heading.startsWith('Components') ? (
                                                <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 px-2 py-1 rounded group-hover:bg-blue-500 group-hover:text-white transition-colors">PREVIEW</span>
                                            ) : (
                                                <span className="text-[10px] font-bold bg-white/5 text-slate-500 px-2 py-1 rounded">NO ROUTE</span>
                                            )}
                                        </div>

                                        <h3 className="text-base font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                                            {item.title}
                                        </h3>
                                        <div className="font-mono text-[10px] text-slate-500 mb-3 break-all bg-black/30 inline-block px-1.5 py-0.5 rounded border border-white/5">
                                            {item.file}
                                        </div>

                                        <p className="text-xs text-slate-400 leading-relaxed border-t border-white/5 pt-3 mt-auto">
                                            {item.desc}
                                        </p>

                                        {item.path && (
                                            <div className="mt-3 text-[10px] text-blue-400/0 group-hover:text-blue-400 font-mono transition-all translate-y-2 group-hover:translate-y-0">
                                                {item.path}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
