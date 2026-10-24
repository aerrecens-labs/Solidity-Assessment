import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, TrendingUp, ArrowRight, Sparkles } from 'lucide-react'

interface InvestmentNotificationProps {
  isVisible: boolean
  amount: number
  sourceWallet: string
  onInvest: () => void
  onDismiss: () => void
}

export const InvestmentNotification: React.FC<InvestmentNotificationProps> = ({
  isVisible,
  amount,
  sourceWallet,
  onInvest,
  onDismiss
}) => {
  const [isHovered, setIsHovered] = useState(false)

  // Auto-dismiss logic with pause-on-hover
  useEffect(() => {
    if (isVisible && !isHovered) {
      const timer = setTimeout(() => {
        onDismiss()
      }, 8000) // 8 seconds
      return () => clearTimeout(timer)
    }
  }, [isVisible, isHovered, onDismiss])

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* ================= MOBILE: DYNAMIC ISLAND ================= */}
          <motion.div
            initial={{ y: -100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -100, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed top-4 left-4 right-4 z-[9999] sm:hidden flex justify-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="bg-[#0b0c10]/95 backdrop-blur-xl border border-white/10 rounded-full pl-1.5 pr-1.5 py-1.5 shadow-2xl shadow-black/50 flex items-center justify-between w-full max-w-[360px] relative overflow-hidden">

              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

              {/* Left: Icon & Context */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20">
                  <Sparkles size={18} className="text-white fill-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest leading-none mb-0.5">Opportunity</span>
                  <span className="text-sm font-medium text-white leading-none">
                    Invest <span className="font-bold text-white">${amount.toFixed(0)}</span>?
                  </span>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={onInvest}
                  className="bg-white text-black text-xs font-bold px-4 py-2.5 rounded-full hover:bg-slate-200 transition-colors active:scale-95"
                >
                  Yes
                </button>
                <button
                  onClick={onDismiss}
                  className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* ================= DESKTOP: GLASS TOAST ================= */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-6 right-6 z-[9999] hidden sm:block w-[380px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative bg-[#13141b]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-1 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden group">

              {/* Glowing Border Gradient */}
              <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-amber-500/20 via-transparent to-transparent pointer-events-none" />

              <div className="bg-[#0b0c10]/60 rounded-xl p-5 relative z-10">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2 text-amber-400">
                    <TrendingUp size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Smart Suggestion</span>
                  </div>
                  <button onClick={onDismiss} className="text-slate-500 hover:text-white transition-colors">
                    <X size={16} />
                  </button>
                </div>

                {/* Content */}
                <div className="mb-5">
                  <p className="text-slate-300 text-sm leading-relaxed">
                    You just moved funds from <span className="text-white font-semibold">{sourceWallet}</span>.
                    <br />
                    Put that <span className="text-white font-bold">${amount.toFixed(2)}</span> to work instantly?
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={onInvest}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-sm font-bold py-2.5 rounded-lg shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <Sparkles size={14} fill="currentColor" /> Invest Now
                  </button>
                  <button
                    onClick={onDismiss}
                    className="px-4 py-2.5 rounded-lg border border-white/10 text-slate-400 text-sm font-medium hover:bg-white/5 hover:text-white transition-colors"
                  >
                    Later
                  </button>
                </div>
              </div>

              {/* Progress Bar (Visual Timer) */}
              {!isHovered && (
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 8, ease: 'linear' }}
                  className="absolute bottom-0 left-0 h-1 bg-amber-500/50 z-20"
                />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}