import React from 'react'
import { X, ChevronRight, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'


// Custom Toggle if headlessui is not installed or preferred to keep it simple
const Toggle = ({ enabled, onChange }: { enabled: boolean, onChange: (val: boolean) => void }) => (
    <div
        onClick={() => onChange(!enabled)}
        className={`w-9 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${enabled ? 'bg-[#2962ff]' : 'bg-[#434651]'}`}
    >
        <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${enabled ? 'translate-x-4' : 'translate-x-0'}`} />
    </div>
)

interface GlobalPreferencesDrawerProps {
    isOpen: boolean
    onClose: () => void
}

export default function GlobalPreferencesDrawer({ isOpen, onClose }: GlobalPreferencesDrawerProps) {
    const [marginAutoTopUp, setMarginAutoTopUp] = React.useState(false)

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed top-0 right-0 bottom-0 w-[400px] bg-[#1e222d] shadow-2xl z-[101] flex flex-col font-sans border-l border-[#2a2e39]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-[#2a2e39]">
                            <h2 className="text-lg font-bold text-[#d1d4dc]">Global Preferences</h2>
                            <button onClick={onClose} className="p-1 text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#2a2e39] rounded transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">

                            {/* Margin Auto Top-up */}
                            <div className="bg-[#2a2e39]/30 rounded-lg p-4 border border-[#2a2e39] hover:border-[#2962ff]/50 transition-colors">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-3 border border-[#d1d4dc]/50 rounded-sm" /> {/* Decorative icon */}
                                        <span className="text-sm font-bold text-[#d1d4dc]">Margin Auto Top-up</span>
                                    </div>
                                    <Toggle enabled={marginAutoTopUp} onChange={setMarginAutoTopUp} />
                                </div>
                                <p className="text-[11px] text-[#787b86] leading-relaxed">
                                    Automatically adds margin when your ratio goes above 70% to prevent liquidation. The amount depends on leverage.
                                </p>
                            </div>

                            {/* Order Type */}
                            <div className="bg-[#2a2e39]/30 rounded-lg p-4 border border-[#2a2e39] hover:border-[#2962ff]/50 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 border-l-2 border-t-2 border-[#d1d4dc]/50" /> {/* Decorative icon */}
                                        <span className="text-sm font-bold text-[#d1d4dc]">Order Type</span>
                                    </div>
                                    <button className="flex items-center gap-2 px-3 py-1.5 bg-[#2a2e39] rounded text-xs font-bold text-[#d1d4dc] hover:bg-[#363a45] transition-colors">
                                        Limit <ChevronDown size={14} />
                                    </button>
                                </div>
                                <p className="text-[11px] text-[#787b86] leading-relaxed">
                                    Set a default order type to simplify and speed up your trading.
                                </p>
                            </div>

                            {/* Keyboard Shortcuts */}
                            <div className="bg-[#2a2e39]/30 rounded-lg p-4 border border-[#2a2e39] hover:border-[#2962ff]/50 transition-colors group cursor-pointer">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-3 border border-[#d1d4dc]/50 rounded-[2px] flex items-center justify-center">
                                            <div className="w-2 h-px bg-[#d1d4dc]/50" />
                                        </div>
                                        <span className="text-sm font-bold text-[#d1d4dc] group-hover:text-[#2962ff] transition-colors">Keyboard Shortcuts</span>
                                    </div>
                                    <ChevronRight size={16} className="text-[#787b86] group-hover:text-[#2962ff] transition-colors" />
                                </div>
                                <p className="text-[11px] text-[#787b86] leading-relaxed">
                                    Boost your trading speed with simple, intuitive keyboard actions.
                                </p>
                            </div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
