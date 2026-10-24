import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useDashboardStore } from '../store/dashboardStore'
import { ArrowRight, BarChart3, Shield, Zap, Wallet, TrendingUp, Lock, CheckCircle2, Activity } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import IsometricDestructionPress from '../components/Landing/IsometricDestructionPress'

// Animations
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { staggerChildren: 0.15 }
}

// DESTRUCTION CONVEYOR BELT - The Sword of God 🔨💥
function BurningMoneyCounter() {
  const LOSS_PER_SECOND = 31.70
  const [moneyLost, setMoneyLost] = useState(1234567890)

  // Items that get SMASHED (universal understanding)
  const items = ['🏠', '🚗', '☕', '🍔', '📱', '💻', '🎮', '👟']
  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const [isSmashing, setIsSmashing] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number, x: number, y: number }>>([])

  // Real-world comparisons
  const comparisons = [
    { label: '≈ 28K Coffee Cups', unit: 'per hour' },
    { label: '≈ 6.7M Netflix Subscriptions', unit: 'per year' },
    { label: '≈ 68K Grocery Runs', unit: 'per day' },
    { label: '≈ 1,000 Apartments Rent', unit: 'per month' }
  ]
  const [comparisonIndex, setComparisonIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMoneyLost(prev => prev + LOSS_PER_SECOND)

      // Trigger SMASH!
      setIsSmashing(true)

      // Particle explosion
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200
      }))
      setParticles(newParticles)

      setTimeout(() => {
        setIsSmashing(false)
        setCurrentItemIndex(prev => (prev + 1) % items.length)
        setParticles([])
      }, 500)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const compInterval = setInterval(() => {
      setComparisonIndex(prev => (prev + 1) % comparisons.length)
    }, 5000)

    return () => clearInterval(compInterval)
  }, [])

  return (
    <div className="relative">
      <div className="text-center p-12 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-800/70 border border-slate-700/50 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-red-500/5 via-transparent to-transparent opacity-50" />

        <div className="relative z-10">
          <div className="text-xs uppercase tracking-[0.3em] text-slate-400 font-mono mb-6">
            Capital Destroyed Every Second
          </div>

          {/* Big counter */}
          <div className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-6 font-mono tabular-nums tracking-tight">
            ${moneyLost.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </div>

          {/* CONVEYOR BELT DESTRUCTION ZONE 🔨💥 */}
          <div className="mb-6 relative h-32 flex items-center justify-center">
            {/* Conveyor Belt */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded overflow-hidden">
              <motion.div
                className="h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)]"
                animate={{ x: [0, -20] }}
                transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
              />
            </div>

            {/* Item on belt (gets DESTROYED) */}
            <motion.div
              className="text-6xl relative"
              animate={{
                scale: isSmashing ? [1, 0.8, 0] : 1,
                rotate: isSmashing ? [0, -10, 10, 0] : 0,
              }}
              transition={{ duration: 0.5 }}
            >
              {items[currentItemIndex]}
            </motion.div>

            {/* Hammer */}
            <motion.div
              className="absolute text-5xl"
              style={{ top: -20, left: '50%', marginLeft: -25 }}
              animate={{
                y: isSmashing ? [0, 60, 0] : 0,
                rotate: isSmashing ? [0, -20, 0] : 0
              }}
              transition={{ duration: 0.5 }}
            >
              🔨
            </motion.div>

            {/* Particle explosion */}
            {particles.map(particle => (
              <motion.div
                key={particle.id}
                className="absolute w-2 h-2 bg-orange-500 rounded-full"
                style={{ left: '50%', top: '50%' }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: particle.x,
                  y: particle.y,
                  opacity: 0,
                  scale: 0
                }}
                transition={{ duration: 0.5 }}
              />
            ))}
          </div>

          {/* Loss indicator */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm text-red-400 font-mono">
              +${LOSS_PER_SECOND}/sec
            </span>
          </div>

          {/* Real-world comparison */}
          <motion.div
            key={comparisonIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-base text-emerald-400 font-bold mb-6"
          >
            {comparisons[comparisonIndex].label} {comparisons[comparisonIndex].unit}
          </motion.div>

          <div className="text-xs text-slate-500 max-w-md mx-auto">
            Based on $20B+ in idle DAO treasuries losing 5% potential APY
          </div>
        </div>
      </div>
    </div>
  )
}

// Animated Counter Component  
function AnimatedCounter({ end, duration = 2, suffix = '' }: { end: number, duration?: number, suffix?: string }) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          let start = 0
          const increment = end / (duration * 60)
          const timer = setInterval(() => {
            start += increment
            if (start >= end) {
              setCount(end)
              clearInterval(timer)
            } else {
              setCount(Math.floor(start))
            }
          }, 1000 / 60)

          return () => clearInterval(timer)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [end, duration, hasAnimated])

  return (
    <div ref={ref} className="tabular-nums">
      {count}{suffix}
    </div>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const { deposit } = useDashboardStore()

  const handleStartSimulation = () => {
    deposit('usdt', 100000)
    deposit('btc', 1.5)
    deposit('usd', 25000)

    setTimeout(() => {
      navigate('/app/overview')
    }, 500)
  }

  return (
    <div className="bg-[#0b0c10] text-slate-200 min-h-screen font-sans overflow-x-hidden selection:bg-purple-500/30">

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex flex-col items-center justify-start pt-16 sm:pt-24 lg:pt-28 pb-12 sm:pb-16 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none" style={{ clipPath: 'inset(0)' }}>
          <motion.div
            className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-gradient-to-br from-purple-600/25 via-pink-500/15 to-blue-600/25 rounded-full blur-[140px]"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-gradient-to-tl from-cyan-500/25 via-blue-600/15 to-purple-500/25 rounded-full blur-[140px]"
            animate={{ scale: [1.2, 1, 1.2], rotate: [45, 0, 45] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            { Icon: Zap, color: 'text-yellow-400/40', size: 48, top: '20%', left: '10%', delay: 0 },
            { Icon: Shield, color: 'text-emerald-400/40', size: 64, top: '15%', right: '15%', delay: 0.8 },
            { Icon: TrendingUp, color: 'text-blue-400/40', size: 56, bottom: '25%', left: '8%', delay: 1.5 },
            { Icon: Lock, color: 'text-purple-400/40', size: 40, bottom: '30%', right: '10%', delay: 0.3 },
            { Icon: BarChart3, color: 'text-pink-400/40', size: 72, top: '40%', right: '5%', delay: 1.2 },
          ].map((item, i) => (
            <motion.div
              key={i}
              className={`absolute ${item.color}`}
              style={{ top: item.top, left: item.left, right: item.right, bottom: item.bottom }}
              animate={{ y: [-20, 20, -20], rotate: [-5, 5, -5] }}
              transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: item.delay }}
            >
              <item.Icon size={item.size} strokeWidth={1.5} />
            </motion.div>
          ))}
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            {/* Demo Mode Badge */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-slate-800/60 border border-slate-700/50 backdrop-blur-sm text-xs font-mono mb-6 sm:mb-8 text-purple-300 shadow-lg shadow-purple-900/20"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
              DEMO MODE · MVP · EARLY ACCESS
            </motion.div>

            <h1 className="text-3xl sm:text-4xl nexus-7:text-5xl ipad-std:text-6xl xga:text-7xl hd-720:text-7xl fhd:text-8xl qhd:text-9xl font-black font-metal tracking-tight text-white mb-3 sm:mb-4 ipad-std:mb-5 fhd:mb-6 drop-shadow-2xl">
              CRYPTIC
            </h1>

            <p className="text-xs sm:text-sm nexus-7:text-base ipad-std:text-lg xga:text-xl fhd:text-2xl qhd:text-3xl text-slate-300 max-w-2xl mx-auto mb-4 sm:mb-6 ipad-std:mb-7 fhd:mb-8 leading-relaxed font-light px-4">
              Automated treasury management for DAOs.<br className="hidden ipad-std:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 font-bold">
                Turn idle capital into yield.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 ipad-std:mb-10 fhd:mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartSimulation}
                className="px-5 sm:px-6 nexus-7:px-7 ipad-std:px-8 fhd:px-10 py-2.5 sm:py-3 ipad-std:py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg ipad-std:rounded-xl text-white font-bold text-sm nexus-7:text-base ipad-std:text-lg fhd:text-xl qhd:text-2xl shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all flex items-center gap-2 group relative overflow-hidden border border-purple-400/20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                <Wallet size={18} className="relative z-10 sm:w-5 sm:h-5 fhd:w-6 fhd:h-6" />
                <span className="relative z-10">Initialize Wallet</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 fhd:w-6 fhd:h-6 group-hover:translate-x-1 transition-transform relative z-10" />
              </motion.button>
            </div>
          </motion.div>

          {/* Dashboard Preview with "Simulation" Label */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mx-auto max-w-5xl rounded-xl sm:rounded-2xl border border-purple-500/20 shadow-[0_0_30px_rgba(139,92,246,0.2)] bg-gradient-to-br from-[#1a1e2e] to-[#151926] p-2 sm:p-3 lg:p-4 overflow-hidden relative"
          >
            {/* Simulation Watermark */}
            <div className="absolute top-4 right-4 z-20 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-mono text-blue-300 backdrop-blur-sm">
              SIMULATION
            </div>

            <div className="aspect-[16/9] bg-gradient-to-br from-slate-900 via-slate-800 to-black rounded-xl flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(96,165,250,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(96,165,250,0.08)_1px,transparent_1px)] bg-[size:40px_40px]" />

              <motion.div
                className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />

              <div className="absolute top-8 left-8 opacity-30">
                <div className="flex gap-1 items-end h-12">
                  {[40, 60, 45, 70, 55, 80, 65].map((h, i) => (
                    <motion.div
                      key={i}
                      className="w-2 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t"
                      style={{ height: `${h}%` }}
                      animate={{ height: [`${h}%`, `${h * 0.8}%`, `${h}%`] }}
                      transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                    />
                  ))}
                </div>
              </div>

              <div className="text-center relative z-10">
                <BarChart3 size={80} className="mx-auto text-blue-500/60 mb-6" strokeWidth={1.5} />
                <span className="text-slate-400 font-mono text-base tracking-widest uppercase">Active Trading Dashboard</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Gradient Fade */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-[#0a0a0b] pointer-events-none z-20" />
      </section>


      {/* --- THE PROBLEM: DESTRUCTION VISUALIZATION --- */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#0a0a0b] relative">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div {...fadeInUp} className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-xl sm:text-2xl nexus-7:text-3xl ipad-std:text-4xl xga:text-5xl fhd:text-6xl qhd:text-7xl font-bold text-white mb-2 sm:mb-3 ipad-std:mb-4 tracking-tight">The Problem</h2>
            <p className="text-xs sm:text-sm nexus-7:text-base ipad-std:text-lg fhd:text-xl qhd:text-2xl text-slate-300 max-w-3xl mx-auto px-4 mb-8">
              DAOs manage <span className="text-purple-400 font-bold">$20B+</span> in treasuries, yet millions sit idle.
            </p>
          </motion.div>

          {/* ISOMETRIC INDUSTRIAL DESTRUCTION PRESS */}
          <motion.div {...fadeInUp} className="max-w-4xl mx-auto mb-8">
            <IsometricDestructionPress />

            {/* The Ticker Below */}
            <div className="text-center mt-8">
              <div className="text-xs uppercase tracking-[0.3em] text-red-500/70 font-mono mb-3">
                Total Capital Destroyed
              </div>
              <div className="text-5xl sm:text-6xl font-mono font-black text-white tabular-nums tracking-tighter">
                ${(1234567890).toLocaleString()}
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid grid-cols-1 nexus-7:grid-cols-2 xga:grid-cols-3 gap-4 sm:gap-6 ipad-std:gap-8 max-w-5xl mx-auto mb-8 sm:mb-10 ipad-std:mb-12"
          >
            {[
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: '$1B+ Lost Annually',
                desc: 'If just 5% of DAO funds stay idle, communities lose $1B in potential yield per year.',
                bgColor: 'from-red-500/15 to-pink-500/10',
                iconColor: 'text-red-400',
                borderColor: 'border-red-500/20 hover:border-red-400/40',
                pulseColor: 'group-hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]'
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: '$500+ Gas Fees',
                desc: 'Manual DeFi operations cost $50-$500 per transaction in dead fees.',
                bgColor: 'from-amber-500/15 to-yellow-500/10',
                iconColor: 'text-amber-400',
                borderColor: 'border-amber-500/20 hover:border-amber-400/40',
                pulseColor: 'group-hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]'
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Millions in Errors',
                desc: 'Wrong addresses and manual mistakes have cost DAOs millions. Automation = Safety.',
                bgColor: 'from-blue-500/15 to-cyan-500/10',
                iconColor: 'text-blue-400',
                borderColor: 'border-blue-500/20 hover:border-blue-400/40',
                pulseColor: 'group-hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ scale: 1.03 }}
                className={`p-6 rounded-xl bg-gradient-to-br ${item.bgColor} border-2 ${item.borderColor} transition-all duration-300 group ${item.pulseColor}`}
              >
                <div className={`mb-4 ${item.iconColor}`}>{item.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-6 text-center">Who This Affects</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: 'DAO Treasurers', desc: 'Manual, high-risk multisig operations' },
                { label: 'Token Holders', desc: 'Value loss from idle treasury funds' },
                { label: 'Web3 Foundations', desc: 'Need to extend runway efficiently' }
              ].map((user, i) => (
                <div key={i} className="p-4 rounded-lg bg-slate-800/30 border border-purple-500/10">
                  <div className="font-bold text-purple-400 text-sm mb-1">{user.label}</div>
                  <div className="text-xs text-slate-400">{user.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>


      {/* THE SOLUTION */}
      <section className="relative py-16 sm:py-20 ipad-std:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl ipad-std:text-5xl font-black text-white mb-6">
              The <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">Solution</span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto">
              An intelligent, autonomous treasury management system that <span className="text-purple-400 font-semibold">maximizes yield</span>,
              {' '}<span className="text-blue-400 font-semibold">minimizes risk</span>, and operates <span className="text-green-400 font-semibold">24/7</span> without human intervention.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 ipad-std:gap-12"
          >
            {[
              {
                icon: <Activity className="w-10 h-10" />,
                title: 'Automated Yield Optimization',
                desc: 'AI-powered algorithms continuously scan DeFi protocols to find the best yields while managing risk automatically.',
                features: ['Real-time protocol monitoring', 'Auto-rebalancing', 'Multi-chain support'],
                gradient: 'from-purple-500/20 to-pink-500/10',
                iconColor: 'text-purple-400',
                border: 'border-purple-500/30'
              },
              {
                icon: <Shield className="w-10 h-10" />,
                title: 'Security-First Architecture',
                desc: 'Multi-signature wallets, smart contract audits, and real-time risk monitoring keep your treasury safe.',
                features: ['Multi-sig controls', 'Audit trail', 'Emergency shutoff'],
                gradient: 'from-blue-500/20 to-cyan-500/10',
                iconColor: 'text-blue-400',
                border: 'border-blue-500/30'
              },
              {
                icon: <BarChart3 className="w-10 h-10" />,
                title: 'Complete Transparency',
                desc: 'Every transaction, every decision, every movement is logged and visible to your community in real-time.',
                features: ['Live dashboard', 'Full history', 'On-chain verification'],
                gradient: 'from-green-500/20 to-emerald-500/10',
                iconColor: 'text-green-400',
                border: 'border-green-500/30'
              },
              {
                icon: <Zap className="w-10 h-10" />,
                title: 'Zero Manual Work',
                desc: 'Set your strategy once, and let the system handle everything else. No more 3AM multisig ceremonies.',
                features: ['Automated execution', 'Smart scheduling', 'Gas optimization'],
                gradient: 'from-amber-500/20 to-yellow-500/10',
                iconColor: 'text-amber-400',
                border: 'border-amber-500/30'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`p-6 sm:p-8 rounded-2xl bg-gradient-to-br ${item.gradient} border-2 ${item.border} backdrop-blur-sm transition-all duration-300 hover:shadow-2xl`}
              >
                <div className={`${item.iconColor} mb-4`}>{item.icon}</div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-300 mb-4">{item.desc}</p>
                <ul className="space-y-2">
                  {item.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-slate-400">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-green-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative py-16 sm:py-20 ipad-std:py-24 px-4 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl ipad-std:text-5xl font-black text-white mb-6">
              How It <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">Works</span>
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Four simple steps to transform your DAO treasury from idle to optimized
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            {[
              {
                step: '01',
                title: 'Connect Wallet',
                desc: 'Link your DAO multisig wallet securely',
                icon: <Wallet className="w-8 h-8" />,
                color: 'from-blue-500 to-cyan-500'
              },
              {
                step: '02',
                title: 'Set Strategy',
                desc: 'Define risk tolerance and yield targets',
                icon: <BarChart3 className="w-8 h-8" />,
                color: 'from-purple-500 to-pink-500'
              },
              {
                step: '03',
                title: 'Auto-Deploy',
                desc: 'System finds and executes best opportunities',
                icon: <Zap className="w-8 h-8" />,
                color: 'from-amber-500 to-orange-500'
              },
              {
                step: '04',
                title: 'Track & Grow',
                desc: 'Monitor performance and compound returns',
                icon: <TrendingUp className="w-8 h-8" />,
                color: 'from-green-500 to-emerald-500'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="relative"
              >
                <div className="relative p-6 rounded-2xl bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 group">
                  <div className={`absolute top-4 right-4 text-6xl font-black bg-gradient-to-br ${item.color} text-transparent bg-clip-text opacity-20 group-hover:opacity-30 transition-opacity`}>
                    {item.step}
                  </div>
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${item.color} text-white mb-4`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- CTA FOOTER --- */}
      <section className="py-40 relative text-center bg-gradient-to-b from-[#0a0a0b] to-[#0b0c10]">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-5xl md:text-8xl font-black text-white mb-10 font-metal tracking-wider">
              JOIN THE BETA
            </h2>
            <p className="text-2xl text-slate-300 mb-16 font-light max-w-3xl mx-auto">
              Initialize your treasury workspace with demo liquidity and start trading.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="px-12 py-6 bg-white text-black rounded-xl font-bold text-2xl shadow-2xl hover:shadow-white/30 transition-all"
            >
              Launch Dashboard
            </motion.button>
          </motion.div>
        </div>

        <div className="mt-32 text-slate-600 text-base font-mono uppercase tracking-widest">
          © 2026 Cryptic. All Rights Reserved.
        </div>
      </section>
    </div>
  )
}
