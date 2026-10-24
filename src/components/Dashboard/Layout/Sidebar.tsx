import React from 'react'
import { motion } from 'framer-motion'
import {
    Clock,
    BarChart2,
    TrendingUp,
    User,
    Settings,
    LogOut,
    Menu
} from 'lucide-react'
import { useDashboardStore } from '../../../store/dashboardStore'

export default function Sidebar() {
    const { currentView, setView, isSidebarOpen, toggleSidebar } = useDashboardStore()

    const NAV_ITEMS = [
        { id: 'QUICK', label: 'QuickTrade', icon: Clock },
        { id: 'EXCHANGE', label: 'Exchange', icon: BarChart2 },
        { id: 'FUTURES', label: 'Futures', icon: TrendingUp },
        { id: 'PROFILE', label: 'Profile', icon: User },
    ] as const

    return (
        <motion.div
            animate={{ width: isSidebarOpen ? 240 : 80 }}
            className="h-[calc(100vh-80px)] md:h-screen sticky top-0 flex flex-col bg-[#0b0e14] border-r border-white/5 z-40 transition-all duration-300"
        >
            {/* Toggle / Brand */}
            <div className="p-6 flex items-center justify-between border-b border-white/5 h-[80px]">
                {isSidebarOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-bold text-xl text-white tracking-wider">
                        ZEROTOONE
                    </motion.div>
                )}
                <button onClick={toggleSidebar} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
                    <Menu size={20} />
                </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 py-6 px-4 space-y-2">
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setView(item.id)}
                        className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all relative overflow-hidden group
                    ${currentView === item.id
                                ? 'bg-[#3b82f6] text-white shadow-lg shadow-blue-900/20'
                                : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
                    >
                        <item.icon size={22} className={currentView === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'} />

                        {isSidebarOpen && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="font-medium whitespace-nowrap"
                            >
                                {item.label}
                            </motion.span>
                        )}

                        {/* Active Glow */}
                        {currentView === item.id && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                        )}
                    </button>
                ))}
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-white/5 space-y-2">
                <button className="w-full flex items-center gap-4 p-3 rounded-xl text-slate-500 hover:bg-white/5 hover:text-white transition-colors">
                    <Settings size={22} />
                    {isSidebarOpen && <span>Settings</span>}
                </button>
                <button className="w-full flex items-center gap-4 p-3 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors">
                    <LogOut size={22} />
                    {isSidebarOpen && <span>Logout</span>}
                </button>
            </div>
        </motion.div>
    )
}
