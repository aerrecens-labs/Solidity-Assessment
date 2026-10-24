import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

export default function LeverageSlider() {
    const [leverage, setLeverage] = useState(20)

    // Calculate risk color
    const getRiskColor = (lev: number) => {
        if (lev <= 5) return 'text-emerald-400'
        if (lev <= 20) return 'text-[#3b82f6]'
        if (lev <= 50) return 'text-orange-400'
        return 'text-rose-500'
    }

    return (
        <div className="bg-[#13141b] rounded-xl border border-white/5 p-4 select-none">
            <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-bold text-slate-500 uppercase">Leverage</div>
                <div className={`font-mono font-bold text-lg ${getRiskColor(leverage)}`}>
                    {leverage}x
                </div>
            </div>

            {/* Slider Track */}
            <div className="relative h-6 flex items-center mb-6">
                <input
                    type="range"
                    min="1"
                    max="125"
                    step="1"
                    value={leverage}
                    onChange={(e) => setLeverage(parseInt(e.target.value))}
                    className="w-full absolute z-20 opacity-0 cursor-pointer"
                />

                {/* Visual Track */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden relative z-10">
                    <motion.div
                        className="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-rose-500"
                        style={{ width: `${(leverage / 125) * 100}%` }}
                    />
                </div>

                {/* Thumb */}
                <motion.div
                    className="absolute h-4 w-4 bg-white rounded-full shadow-[0_0_10px_white] z-10 pointer-events-none"
                    style={{ left: `calc(${(leverage / 125) * 100}% - 8px)` }}
                />

                {/* Marks */}
                <div className="absolute top-3 w-full flex justify-between text-[10px] text-slate-600 font-mono">
                    <span>1x</span>
                    <span>20x</span>
                    <span>50x</span>
                    <span>100x</span>
                    <span>125x</span>
                </div>
            </div>

            {/* Warning */}
            {leverage > 50 && (
                <div className="flex items-start gap-2 bg-rose-500/10 border border-rose-500/20 p-2 rounded-lg text-rose-400 text-[10px]">
                    <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                    <span>High leverage increases liquidation risk. Trade carefully.</span>
                </div>
            )}
        </div>
    )
}
