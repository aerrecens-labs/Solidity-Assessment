import React, { useState } from 'react'
import { X, Check, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'

interface ChartSettingsModalProps {
    isOpen: boolean
    onClose: () => void
}

const TABS = [
    { id: 'symbol', label: 'Symbol', icon: <div className="w-3 h-3 border border-[#787b86] rounded-sm" /> },
    { id: 'status', label: 'Status line', icon: <div className="w-3 h-3 flex flex-col gap-0.5"><div className="h-px w-full bg-[#787b86]" /><div className="h-px w-2/3 bg-[#787b86]" /></div> },
    { id: 'scales', label: 'Scales', icon: <div className="w-3 h-3 border-l border-b border-[#787b86]" /> },
    { id: 'canvas', label: 'Canvas', icon: <div className="w-3 h-3 border border-dashed border-[#787b86]" /> },
]

export default function ChartSettingsModal({ isOpen, onClose }: ChartSettingsModalProps) {
    const [activeTab, setActiveTab] = useState('scales')

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-[600px] h-[550px] bg-[#1e222d] rounded-lg shadow-2xl border border text-[#d1d4dc] flex flex-col overflow-hidden font-sans"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2e39] shrink-0">
                    <span className="text-lg font-medium text-[#d1d4dc]">Chart settings</span>
                    <button onClick={onClose} className="text-[#787b86] hover:text-[#d1d4dc] transition-colors"><X size={20} /></button>
                </div>

                {/* Body */}
                <div className="flex flex-1 min-h-0">
                    {/* Sidebar */}
                    <div className="w-[160px] flex flex-col py-2 border-r border-[#2a2e39] shrink-0">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-6 py-2.5 text-sm transition-colors text-left
                                ${activeTab === tab.id ? 'bg-[#2a2e39] text-[#2962ff]' : 'text-[#d1d4dc] hover:bg-[#2a2e39]'}`}
                            >
                                <span className={activeTab === tab.id ? 'text-[#2962ff]' : 'text-[#787b86]'}>{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-[#2a2e39]">
                        <div className="p-6">
                            {activeTab === 'symbol' && (
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-[#787b86] uppercase tracking-wider mb-2">Candles</h3>
                                    <div className="space-y-3">
                                        <Checkbox label="Body" checked colorBox="#089981" colorBox2="#F23645" />
                                        <Checkbox label="Borders" checked colorBox="#089981" colorBox2="#F23645" />
                                        <Checkbox label="Wick" checked colorBox="#089981" colorBox2="#F23645" />
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-[#2a2e39] space-y-3">
                                        <Checkbox label="Last price line" checked colorBox="#2962ff" />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'status' && (
                                <div className="space-y-6">
                                    {/* Group 1 */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <Checkbox label="Symbol" checked readOnly />
                                        </div>
                                        <div className="pl-7 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Checkbox label="Title" />
                                                <Dropdown value="Description" />
                                            </div>
                                            <Checkbox label="Open market status" checked />
                                            <Checkbox label="OHLC values" checked />
                                            <Checkbox label="Bar change values" checked />
                                            <Checkbox label="Volume" />
                                        </div>
                                    </div>

                                    {/* Group 2 */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-4 mt-6">
                                            <Checkbox label="Indicators" checked />
                                        </div>
                                        <div className="pl-7 space-y-3">
                                            <Checkbox label="Titles" checked />
                                            <Checkbox label="Arguments" checked />
                                            <Checkbox label="Values" checked />
                                            <div className="flex items-center justify-between py-1">
                                                <Checkbox label="Background" checked />
                                                <div className="w-32 h-1 bg-[#2962ff]/30 rounded-full overflow-hidden relative cursor-pointer">
                                                    <div className="absolute top-0 bottom-0 left-0 w-1/2 bg-[#2962ff] rounded-full" />
                                                    <div className="absolute top-1/2 -mt-1.5 left-1/2 w-3 h-3 bg-[#d1d4dc] rounded-full shadow-sm" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'scales' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xs text-[#787b86] uppercase mb-3">Labels on Price Scale</h3>
                                        <div className="space-y-3">
                                            <Checkbox label="Symbol name" />
                                            <div className="flex justify-between items-center">
                                                <Checkbox label="Symbol last price" checked />
                                                <Dropdown value="Value according to scale" />
                                            </div>
                                            <Checkbox label="High and low price" />
                                            <Checkbox label="Indicators name" />
                                            <Checkbox label="Indicators value" checked />
                                            <Checkbox label="No overlapping" checked />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-[#2a2e39]">
                                        <h3 className="text-xs text-[#787b86] uppercase mb-3">Price Scale</h3>
                                        <div className="space-y-3">
                                            <Checkbox label="Countdown to bar close" />
                                            <Checkbox label="Plus button" />
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-[#d1d4dc] ml-7">Scale modes (A and L)</span>
                                                <Dropdown value="Visible on mouse over" />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <Checkbox label="Lock price to bar ratio" />
                                                <input type="text" disabled value="61.7852225" className="w-32 bg-[#2a2e39] border border-[#2a2e39] rounded px-2 py-1 text-sm text-[#787b86]" />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-[#d1d4dc]">Scales placement</span>
                                                <Dropdown value="Auto" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-[#2a2e39]">
                                        <h3 className="text-xs text-[#787b86] uppercase mb-3">Time Scale</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-[#d1d4dc]">Date format</span>
                                                <Dropdown value="29 Sep '97" />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-[#d1d4dc]">Time hours format</span>
                                                <Dropdown value="24-hours" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'canvas' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xs text-[#787b86] uppercase mb-3">Chart Basic Styles</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-[#d1d4dc]">Background</span>
                                                <div className="flex gap-2">
                                                    <Dropdown value="Solid" />
                                                    <ColorBox color="#1e222d" />
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-[#d1d4dc]">Grid lines</span>
                                                <div className="flex gap-2">
                                                    <Dropdown value="Vert and horz" />
                                                    <ColorBox color="#2a2e39" />
                                                    <ColorBox color="#2a2e39" />
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <Checkbox label="Session breaks" />
                                                <div className="flex gap-2">
                                                    <ColorBox color="#2962ff" />
                                                    <div className="w-8 h-6 border border-[#2a2e39] rounded flex items-center justify-center">
                                                        <div className="w-4 h-px bg-[#787b86]" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-[#d1d4dc]">Crosshair</span>
                                                <div className="flex gap-2">
                                                    <ColorBox color="#787b86" />
                                                    <div className="w-8 h-6 border border-[#2a2e39] rounded flex items-center justify-center">
                                                        <div className="w-4 h-px border-b border-dashed border-[#787b86]" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <Checkbox label="Watermark" />
                                                <ColorBox color="#2a2e39" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-[#2a2e39]">
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-[#d1d4dc]">Text</span>
                                                <div className="flex gap-2">
                                                    <ColorBox color="#787b86" />
                                                    <Dropdown value="12" />
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-[#d1d4dc]">Lines</span>
                                                <ColorBox color="#2a2e39" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-[#2a2e39]">
                                        <h3 className="text-xs text-[#787b86] uppercase mb-3">Buttons</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-[#d1d4dc]">Navigation</span>
                                                <Dropdown value="Visible on mouse over" />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-[#d1d4dc]">Pane</span>
                                                <Dropdown value="Visible on mouse over" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-[#2a2e39] flex justify-between items-center shrink-0">
                    <div className="relative group">
                        <button className="px-4 py-2 text-sm text-[#d1d4dc] hover:bg-[#2a2e39] rounded border border-[#2a2e39] flex items-center gap-2">
                            Template <ChevronDown size={14} />
                        </button>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-6 py-2 text-sm text-[#d1d4dc] hover:bg-[#2a2e39] rounded border border-[#2a2e39] transition-colors">Cancel</button>
                        <button onClick={onClose} className="px-6 py-2 text-sm text-white bg-[#2962ff] hover:bg-[#1e53e5] rounded transition-colors">Ok</button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

// Reusable Components
const Checkbox = ({ label, checked = false, readOnly = false, colorBox, colorBox2 }: { label: string, checked?: boolean, readOnly?: boolean, colorBox?: string, colorBox2?: string }) => (
    <div className="flex items-center justify-between group">
        <label className={`flex items-center gap-3 cursor-pointer ${readOnly ? '' : 'hover:opacity-80'}`}>
            <div className={`w-4 h-4 rounded-[3px] border flex items-center justify-center transition-colors
                ${checked ? 'bg-[#2962ff] border-[#2962ff]' : 'border-[#434651] bg-transparent'}`}>
                {checked && <Check size={12} className="text-white" strokeWidth={3} />}
            </div>
            <span className="text-sm text-[#d1d4dc]">{label}</span>
        </label>

        {(colorBox || colorBox2) && (
            <div className="flex gap-2">
                {colorBox && <div className="w-8 h-6 rounded border border-[#2a2e39]" style={{ backgroundColor: colorBox }} />}
                {colorBox2 && <div className="w-8 h-6 rounded border border-[#2a2e39]" style={{ backgroundColor: colorBox2 }} />}
            </div>
        )}
    </div>
)

const Dropdown = ({ value }: { value: string }) => (
    <div className="flex items-center justify-between gap-2 px-2 py-1 bg-[#1e222d] border border-transparent hover:border-[#2a2e39] hover:bg-[#2a2e39] rounded cursor-pointer min-w-[80px] group transition-colors">
        <span className="text-sm text-[#d1d4dc]">{value}</span>
        <ChevronDown size={14} className="text-[#787b86] group-hover:text-[#d1d4dc]" />
    </div>
)

const ColorBox = ({ color }: { color: string }) => (
    <div className="w-8 h-6 rounded border border-[#2a2e39]" style={{ backgroundColor: color }} />
)
