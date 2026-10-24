import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { formatUSD } from '../../utils/format'
import { InvestmentOption } from '../../data/mockDataEngine'
import RiskBadge from './RiskBadge'
import { ArrowRight, TrendingUp } from 'lucide-react'

interface InvestmentCardProps {
  option: InvestmentOption
  selectedAmount: number
  onSelect: (option: InvestmentOption) => void
}

export default function InvestmentCard({
  option,
  selectedAmount,
  onSelect
}: InvestmentCardProps) {
  const divRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return
    const rect = divRef.current.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const monthlyReturn = (selectedAmount * option.apy / 100) / 12
  const yearlyReturn = selectedAmount * option.apy / 100

  // Dynamic Color based on Risk or Type? Let's use Blue as default, modify as needed.
  const accentColor = '#6a7bff'

  return (
    <motion.div
      ref={divRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className="group relative rounded-2xl border border-white/10 bg-[#1f1f22] overflow-hidden"
    >
      {/* --- SPOTLIGHT EFFECT --- */}
      <div
        className="pointer-events-none absolute -inset-px transition duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(106, 123, 255, 0.15), transparent 40%)`,
        }}
      />

      <div className="relative z-10 p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#6a7bff]/20 to-[#67c8ff]/20 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(106,123,255,0.15)]">
              {option.icon}
            </div>
            <div>
              <h3 className="text-white font-bold text-xl tracking-tight">{option.name}</h3>
              <div className="mt-1">
                <RiskBadge risk={option.risk} />
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">APY</div>
            <div className="text-[#36c390] font-bold text-2xl flex items-center justify-end gap-1">
              <TrendingUp size={18} />
              {option.apy}%
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1 border-l-2 border-white/5 pl-3">
          {option.description}
        </p>

        {/* Projections Card */}
        <div className="bg-[#131313]/50 rounded-xl p-4 border border-white/5 mb-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-xs font-bold uppercase">Est. Monthly</span>
            <span className="text-white font-mono font-bold">{formatUSD(monthlyReturn)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-xs font-bold uppercase">Est. Yearly</span>
            <span className="text-[#36c390] font-mono font-bold">+{formatUSD(yearlyReturn)}</span>
          </div>
          {/* Progress Bar Visual */}
          <div className="w-full h-1 bg-white/5 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 w-3/4 opacity-50" />
          </div>
        </div>

        {/* Action */}
        <button
          onClick={() => onSelect(option)}
          className="w-full group/btn relative overflow-hidden bg-white text-[#0f1230] py-3.5 rounded-xl font-bold transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            Start Strategy <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
          </span>
        </button>
      </div>
    </motion.div>
  )
}