import { useState, useEffect } from 'react'
import { useUIStore } from '../../state/uiStore'
import { Modal } from './Modal'
import {
    User, Mail, Shield, Smartphone, Key, LayoutDashboard, Settings,
    Activity, HelpCircle, LogOut, Copy, Eye, EyeOff, ChevronRight,
    CreditCard, Bell, Moon, Languages, AlertTriangle, FileText, ExternalLink,
    PieChart as PieChartIcon, Check, X, MapPin, Wallet, TrendingUp, Bitcoin
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'

// --- Mock Data ---
const LOGIN_HISTORY = [
    { id: 1, date: '2024-12-12 10:45 AM', device: 'Chrome (Win10)', ip: '192.168.1.1', location: 'New York, USA' },
    { id: 2, date: '2024-12-10 08:30 PM', device: 'iPhone 13', ip: '45.22.19.112', location: 'New York, USA' },
    { id: 3, date: '2024-12-08 09:15 AM', device: 'Chrome (Win10)', ip: '192.168.1.1', location: 'New York, USA' },
]

const ASSET_DATA = [
    { name: 'Bitcoin', value: 60, color: '#f7931a' },
    { name: 'Ethereum', value: 25, color: '#627eea' },
    { name: 'USDT', value: 10, color: '#26a17b' },
    { name: 'Altcoins', value: 5, color: '#e9ecff' },
]

type Tab = 'overview' | 'security' | 'preferences' | 'autosweep' | 'activity' | 'support'

import { cryptoMeta } from '../../state/cryptoMeta'
import type { CryptoSymbol } from '../../state/cryptoStore'
import { Switch, FormControlLabel, TextField, Box, Typography } from '@mui/material'

// Types for wallet-specific sweep settings
interface WalletSweepSettings {
    enabled: boolean
    threshold: string
}

interface WalletSweepSettingsMap {
    [wallet: string]: WalletSweepSettings
}

export const ProfileModal = () => {
    const { isProfileOpen, toggleProfile, showGradients, toggleGradients, enableAnimations, toggleAnimations, showCinematicIntro, toggleCinematicIntro } = useUIStore()
    const [activeTab, setActiveTab] = useState<Tab>('overview')
    const [hideBalance, setHideBalance] = useState(false)
    const [notifications, setNotifications] = useState({ email: true, push: false, price: true })
    const [hideAmounts, setHideAmounts] = useState(false) // Migrated from Settings

    // Wallet-specific sweep settings (Migrated)
    const [walletSweepSettings, setWalletSweepSettings] = useState<WalletSweepSettingsMap>(() => {
        const saved = localStorage.getItem('wallet_sweep_settings')
        return saved ? JSON.parse(saved) : {}
    })

    // Save sweep settings to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('wallet_sweep_settings', JSON.stringify(walletSweepSettings))
    }, [walletSweepSettings])

    const getSweepSettings = (wallet: CryptoSymbol) => {
        return walletSweepSettings[wallet] || { enabled: false, threshold: '' }
    }

    const setSweepSettings = (wallet: CryptoSymbol, settings: WalletSweepSettings) => {
        setWalletSweepSettings(prev => ({
            ...prev,
            [wallet]: settings
        }))
    }

    const availableWallets: CryptoSymbol[] = ['BTC', 'ETH', 'USDT', 'SOL', 'BAT', 'SEPOLIA_ETH']

    // Derived state
    const tabs: { id: Tab; label: string; icon: any }[] = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'preferences', label: 'Preferences', icon: Settings },
        { id: 'autosweep', label: 'Auto Sweep', icon: TrendingUp },
        { id: 'activity', label: 'Activity', icon: Activity },
        { id: 'support', label: 'Support', icon: HelpCircle },
    ]

    const Content = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {/* Profile Header Card */}
                        <div className="relative mb-6 p-6 rounded-2xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10 overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
                                <div className="w-24 h-24 rounded-full p-[2px] bg-gradient-to-tr from-blue-400 to-purple-500 shadow-xl shadow-blue-500/20">
                                    <div className="w-full h-full rounded-full bg-[#13141b] flex items-center justify-center overflow-hidden">
                                        <User size={40} className="text-slate-200" />
                                    </div>
                                </div>
                                <div className="text-center md:text-left flex-1">
                                    <h2 className="text-2xl font-bold text-white mb-1">Guest Manager</h2>
                                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-sm text-slate-400 mb-4">
                                        <span className="flex items-center gap-1"><Mail size={14} /> guest@cryptic.com</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-600" />
                                        <span>UID: 88291039</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        {/* Details Grid */}
                        <div className="flex flex-col gap-6">
                            {/* Identity */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-[#13141b] border border-white/5 p-5 rounded-2xl">
                                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                        <Shield size={18} className="text-blue-400" /> Account Status
                                    </h3>
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                                <Check size={18} strokeWidth={3} />
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">Active Account</p>
                                                <p className="text-slate-500 text-xs">Full Access</p>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded-lg border border-green-500/20">VERIFIED</span>
                                    </div>
                                </div>

                                <div className="bg-[#13141b] border border-white/5 p-5 rounded-2xl">
                                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                        <User size={18} className="text-purple-400" /> Personal Details
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-400 flex items-center gap-2"><Smartphone size={14} /> Phone</span>
                                            <span className="text-white font-medium">+1 (555) 123-4567</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-400 flex items-center gap-2"><Mail size={14} /> Email</span>
                                            <span className="text-white font-medium">guest@cryptic.com</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-400 flex items-center gap-2"><MapPin size={14} /> City</span>
                                            <span className="text-white font-medium">New York, USA</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Financial Accounts */}
                            <div className="bg-[#13141b] border border-white/5 p-5 rounded-2xl">
                                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                    <Wallet size={18} className="text-emerald-400" /> Financial Accounts
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Demat Account */}
                                    <div className="p-4 rounded-xl bg-gradient-to-br from-[#1a1c2e] to-[#0f1016] border border-white/5 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <TrendingUp size={40} />
                                        </div>
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
                                                <span className="font-bold text-xs">DM</span>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400">Demat Account</p>
                                                <p className="text-white font-bold">Zerodha</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="font-mono text-slate-300 text-sm">1208 **** **** 9932</div>
                                            <button className="text-xs text-blue-400 hover:text-white transition-colors">View Details</button>
                                        </div>
                                    </div>

                                    {/* Crypto Wallet */}
                                    <div className="p-4 rounded-xl bg-gradient-to-br from-[#1a1c2e] to-[#0f1016] border border-white/5 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <Bitcoin size={40} />
                                        </div>
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                                                <span className="font-bold text-xs">CW</span>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400">Primary Wallet</p>
                                                <p className="text-white font-bold">MetaMask</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="font-mono text-slate-300 text-sm truncate max-w-[120px]">0x71C...9A23</div>
                                            <div className="flex gap-2">
                                                <button className="p-1 hover:bg-white/10 rounded transition-colors text-slate-400 hover:text-white">
                                                    <Copy size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case 'security':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <h2 className="text-xl font-bold text-white mb-4">Security Center</h2>

                        {/* 2FA */}
                        <div className="bg-[#1a1c2e] p-4 rounded-xl border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg">
                                    <Smartphone size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">Two-Factor Authentication (2FA)</h4>
                                    <p className="text-slate-400 text-xs">Protect your account with Google Authenticator.</p>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-green-500/20 text-green-400 text-sm font-bold rounded-lg border border-green-500/20">Enabled</button>
                        </div>

                        {/* Anti-Phishing */}
                        <div className="bg-[#1a1c2e] p-4 rounded-xl border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-amber-500/20 text-amber-400 rounded-lg">
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">Anti-Phishing Code</h4>
                                    <p className="text-slate-400 text-xs">Verify official emails with your custom code.</p>
                                </div>
                            </div>
                            <button className="text-slate-300 hover:text-white text-sm font-medium">Configure</button>
                        </div>

                        {/* Login History */}
                        <div>
                            <h3 className="text-white font-bold mb-3 flex items-center gap-2 mt-6">
                                <Key size={16} className="text-slate-400" /> Recent Logins
                            </h3>
                            <div className="bg-[#13141b] rounded-xl border border-white/5 overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-white/5 text-slate-400 text-left">
                                        <tr>
                                            <th className="p-3 font-medium">Time</th>
                                            <th className="p-3 font-medium">Device</th>
                                            <th className="p-3 font-medium">Location</th>
                                            <th className="p-3 font-medium">IP</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-slate-300">
                                        {LOGIN_HISTORY.map(log => (
                                            <tr key={log.id}>
                                                <td className="p-3">{log.date}</td>
                                                <td className="p-3">{log.device}</td>
                                                <td className="p-3">{log.location}</td>
                                                <td className="p-3 font-mono text-xs text-slate-500">{log.ip}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-4 text-right">
                                <button className="text-red-400 text-sm font-bold hover:text-red-300 transition-colors">Logout All Devices</button>
                            </div>
                        </div>
                    </div>
                )

            case 'preferences':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300 pb-6">
                        {/* Appearance Section */}
                        <div>
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <Settings size={18} className="text-purple-400" /> Appearance & Behavior
                            </h3>
                            <div className="bg-[#1a1c2e] rounded-xl border border-white/5 divide-y divide-white/5">
                                <div className="p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-white font-medium">Show Card Gradients</p>
                                        <p className="text-xs text-slate-500">Enable colorful backgrounds for assets</p>
                                    </div>
                                    <button
                                        onClick={toggleGradients}
                                        className={`w-10 h-6 rounded-full relative transition-colors ${showGradients ? 'bg-purple-500' : 'bg-slate-600'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${showGradients ? 'left-[calc(100%-20px)]' : 'left-1'}`} />
                                    </button>
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-white font-medium">UI Animations</p>
                                        <p className="text-xs text-slate-500">Enable smooth transition effects</p>
                                    </div>
                                    <button
                                        onClick={toggleAnimations}
                                        className={`w-10 h-6 rounded-full relative transition-colors ${enableAnimations ? 'bg-purple-500' : 'bg-slate-600'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${enableAnimations ? 'left-[calc(100%-20px)]' : 'left-1'}`} />
                                    </button>
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-white font-medium">Cinematic Intro</p>
                                        <p className="text-xs text-slate-500">Arcade-style loading sequence</p>
                                    </div>
                                    <button
                                        onClick={toggleCinematicIntro}
                                        className={`w-10 h-6 rounded-full relative transition-colors ${showCinematicIntro ? 'bg-amber-500' : 'bg-slate-600'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${showCinematicIntro ? 'left-[calc(100%-20px)]' : 'left-1'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Privacy Section */}
                        <div>
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <EyeOff size={18} className="text-blue-400" /> Privacy
                            </h3>
                            <div className="bg-[#1a1c2e] rounded-xl border border-white/5 p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-white font-medium">Hide Amounts</p>
                                    <p className="text-xs text-slate-500">Blur sensitive financial data</p>
                                </div>
                                <button
                                    onClick={() => setHideAmounts(!hideAmounts)} // Note: This state is local to modal currently, ideally should be global if it affects other pages
                                    className={`w-10 h-6 rounded-full relative transition-colors ${hideAmounts ? 'bg-blue-500' : 'bg-slate-600'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${hideAmounts ? 'left-[calc(100%-20px)]' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>

                        {/* Auto Sweep Section - MOVED TO NEW TAB */}
                    </div>
                )

            case 'autosweep':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <TrendingUp size={24} className="text-emerald-400" /> Auto Sweep
                                </h2>
                                <p className="text-sm text-slate-400 mt-1">Automatically transfer excess funds to your investment wallet.</p>
                            </div>
                            {/* Global Toggle could go here */}
                        </div>

                        <div className="bg-[#1a1c2e] rounded-xl border border-white/5 divide-y divide-white/5 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {availableWallets.map(wallet => {
                                const settings = getSweepSettings(wallet)
                                const meta = cryptoMeta[wallet]
                                return (
                                    <div key={wallet} className="p-5 space-y-4 hover:bg-white/[0.02] transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <img src={meta?.icon} alt={meta?.name} className="w-10 h-10 rounded-full" />
                                                    {settings.enabled && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#1a1c2e]" />}
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold text-base">{meta?.name}</p>
                                                    <p className="text-xs text-slate-500 font-mono">{wallet} Wallet</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setSweepSettings(wallet, { ...settings, enabled: !settings.enabled })}
                                                className={`w-12 h-7 rounded-full relative transition-colors ${settings.enabled ? 'bg-emerald-500' : 'bg-slate-600'}`}
                                            >
                                                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${settings.enabled ? 'left-[calc(100%-24px)]' : 'left-1'}`} />
                                            </button>
                                        </div>

                                        <AnimatePresence>
                                            {settings.enabled && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pt-2 flex items-center gap-4 bg-[#13141b] p-3 rounded-lg border border-white/5">
                                                        <span className="text-sm text-slate-400 font-medium">Sweep Threshold:</span>
                                                        <div className="flex-1 flex items-center gap-2 bg-[#0b0e14] border border-white/10 rounded-md px-3 py-2 focus-within:border-emerald-500/50 transition-colors">
                                                            <input
                                                                type="number"
                                                                value={settings.threshold}
                                                                onChange={(e) => setSweepSettings(wallet, { ...settings, threshold: e.target.value })}
                                                                placeholder="0.00"
                                                                className="bg-transparent text-white w-full focus:outline-none font-mono text-sm"
                                                            />
                                                            <span className="text-xs text-slate-500 font-bold">{wallet}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-[10px] text-slate-500 mt-2 pl-1">
                                                        * Anything above <span className="text-white font-mono">{settings.threshold || '0'} {wallet}</span> will be moved to Vault.
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )

            case 'support':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">Activity Log</h2>
                            <button className="text-blue-400 text-sm hover:underline">Download CSV</button>
                        </div>
                        <div className="p-12 text-center border-2 border-dashed border-white/10 rounded-xl text-slate-500">
                            <Activity size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No recent activity found in the last 24h.</p>
                            <button className="mt-4 px-4 py-2 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition-colors">
                                View Full History
                            </button>
                        </div>

                    </div>
                )

            case 'support':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <h2 className="text-xl font-bold text-white mb-4">Support & Legal</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#1a1c2e] p-5 rounded-xl border border-white/5 hover:border-blue-500/50 transition-colors cursor-pointer group">
                                <HelpCircle size={32} className="text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                                <h3 className="text-white font-bold">Help Center</h3>
                                <p className="text-slate-400 text-sm mt-1">Browse guides and tutorials.</p>
                            </div>
                            <div className="bg-[#1a1c2e] p-5 rounded-xl border border-white/5 hover:border-purple-500/50 transition-colors cursor-pointer group">
                                <FileText size={32} className="text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                                <h3 className="text-white font-bold">Submit Ticket</h3>
                                <p className="text-slate-400 text-sm mt-1">Contact our support team.</p>
                            </div>
                        </div>

                        <div className="space-y-2 mt-6">
                            <a href="#" className="block p-3 rounded-lg hover:bg-white/5 text-slate-300 text-sm flex justify-between items-center group">
                                Terms of Service <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                            <a href="#" className="block p-3 rounded-lg hover:bg-white/5 text-slate-300 text-sm flex justify-between items-center group">
                                Privacy Policy <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                        </div>

                        <div className="pt-6 mt-6 border-t border-white/10">
                            <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2">
                                <AlertTriangle size={18} /> Danger Zone
                            </h3>
                            <button className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-sm font-bold transition-colors">
                                Delete Account
                            </button>
                        </div>
                    </div>
                )
        }
    }

    return (
        <Modal
            isOpen={isProfileOpen}
            onClose={toggleProfile}
            className="h-[85vh] md:h-[80vh] flex overflow-hidden lg:rounded-2xl rounded-xl border border-white/10 shadow-2xl"
            hideHeader
            noPadding
            maxWidth="w-[95vw] md:w-full max-w-5xl"
        >
            <div className="flex flex-col md:flex-row h-full overflow-hidden bg-[#0f1016]">
                {/* Sidebar */}
                <div className="w-full md:w-64 bg-[#0f1016] border-b md:border-b-0 md:border-r border-white/5 flex flex-col shrink-0 z-20">

                    {/* Brand / Header (Mobile Only) */}
                    <div className="md:hidden p-4 border-b border-white/5 flex items-center justify-between bg-[#0f1016]">
                        <h2 className="text-white font-bold font-metal tracking-wide">PROFILE</h2>
                        <button
                            onClick={toggleProfile}
                            className="p-1 rounded-full text-slate-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-2 md:p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto no-scrollbar items-center md:items-stretch whitespace-nowrap md:whitespace-normal">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-2 md:py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-[#6a7bff] text-white shadow-lg shadow-blue-500/25'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <tab.icon size={18} className="shrink-0" />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>

                    {/* Footer Actions (Sign Out) */}
                    <div className="p-4 border-t border-white/5 bg-[#0f1016]">
                        <button
                            onClick={toggleProfile}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
                        >
                            <LogOut size={16} /> <span className="hidden md:inline">Sign Out</span><span className="md:hidden">Logout</span>
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                {/* Main Content Area */}
                <div className="flex-1 bg-[#13141b] relative overflow-y-auto custom-scrollbar h-full">
                    {/* Decorative Background Glow */}
                    <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#1a1c2e] to-transparent pointer-events-none" />

                    <div className="p-4 md:p-8 relative z-10 pb-20 md:pb-8">
                        {/* Close Button Mobile Overlay? Or just rely on backdrop/swipe. Modal has close button usually? */}
                        {/* We hid the header, so we need a Close button for Mobile inside the content if needed.
                             But 'toggleProfile' on backdrop click works. Let's add a small desktop close button absolute positioned?
                             Or rely on standard UI. Let's keep it clean. */}
                        {Content()}
                    </div>
                </div>
            </div>
        </Modal>
    )
}
