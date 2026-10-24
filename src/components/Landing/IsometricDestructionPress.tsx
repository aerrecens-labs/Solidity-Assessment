import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ==========================================
// 1. ISOMETRIC ASSETS 
// ==========================================

// Shared squish animation props (only scale and opacity - y is handled by parent)
const squishVariants = {
    moving: {
        scaleY: 1,
        scaleX: 1,
        opacity: 1
    },
    crushed: {
        scaleY: 0.1,
        scaleX: 1.3,
        opacity: 0.8
    }
}

const IsoHouse = () => (
    <g>
        <ellipse cx="0" cy="55" rx="35" ry="18" fill="black" opacity="0.5" />
        <path d="M-30 20 L-30 50 L0 65 L0 35 Z" fill="#475569" />
        <path d="M0 35 L0 65 L30 50 L30 20 Z" fill="#64748b" />
        <path d="M-35 20 L0 -5 L35 20 L0 35 Z" fill="#3b82f6" />
        <path d="M-35 20 L0 35 L0 40 L-35 25 Z" fill="#1d4ed8" />
        <path d="M5 45 L15 50 L15 60 L5 55 Z" fill="#facc15" />
        <path d="M-20 30 L-10 35 L-10 45 L-20 40 Z" fill="#93c5fd" />
    </g>
)

const IsoCar = () => (
    <g transform="translate(0, 10)">
        <ellipse cx="0" cy="45" rx="35" ry="15" fill="black" opacity="0.5" />
        <ellipse cx="-20" cy="45" rx="6" ry="8" fill="#1e293b" />
        <ellipse cx="20" cy="40" rx="6" ry="8" fill="#1e293b" />
        <path d="M-35 25 L-35 40 L0 50 L0 35 Z" fill="#b91c1c" />
        <path d="M0 35 L0 50 L35 40 L35 25 Z" fill="#ef4444" />
        <path d="M-35 25 L0 35 L35 25 L0 15 Z" fill="#f87171" />
        <path d="M-20 15 L0 5 L20 15 L0 25 Z" fill="#bae6fd" />
        <path d="M-20 15 L-20 25 L0 35 L0 25 Z" fill="#0ea5e9" />
    </g>
)

const IsoServer = () => (
    <g>
        <ellipse cx="0" cy="55" rx="30" ry="15" fill="black" opacity="0.5" />
        <path d="M-25 0 L-25 50 L0 60 L0 10 Z" fill="#334155" />
        <path d="M0 10 L0 60 L25 50 L25 0 Z" fill="#475569" />
        <path d="M-25 0 L0 -10 L25 0 L0 10 Z" fill="#64748b" />
        <circle cx="-10" cy="15" r="2" fill="#22c55e" />
        <circle cx="-10" cy="25" r="2" fill="#22c55e" />
        <circle cx="-10" cy="35" r="2" fill="#ef4444" />
        <path d="M5 20 L20 15" stroke="black" strokeWidth="1" opacity="0.3" />
        <path d="M5 30 L20 25" stroke="black" strokeWidth="1" opacity="0.3" />
        <path d="M5 40 L20 35" stroke="black" strokeWidth="1" opacity="0.3" />
    </g>
)

const IsoGold = () => (
    <g transform="translate(0, 10)">
        <ellipse cx="0" cy="45" rx="30" ry="15" fill="black" opacity="0.5" />
        <path d="M-25 20 L-25 40 L0 50 L0 30 Z" fill="#b45309" />
        <path d="M0 30 L0 50 L25 40 L25 20 Z" fill="#d97706" />
        <path d="M-25 20 L0 10 L25 20 L0 30 Z" fill="#fbbf24" />
        <path d="M-15 18 L-5 14" stroke="white" strokeWidth="2" opacity="0.5" />
    </g>
)

// CRUSHED / JUNK VERSION - Chaotic pile of debris
const GenericJunk = () => (
    <g>
        {/* Main pile base - mound shape */}
        <ellipse cx="0" cy="10" rx="45" ry="12" fill="#334155" opacity="0.6" />

        {/* Jagged debris pieces sticking out at random angles */}
        <path d="M-35 6 L-30 -2 L-25 4 L-28 8 Z" fill="#475569" opacity="0.8" />
        <path d="M-20 3 L-15 -5 L-12 2 L-16 6 Z" fill="#64748b" opacity="0.7" />
        <path d="M-8 5 L-3 -8 L2 -2 L-2 7 Z" fill="#1e293b" opacity="0.75" />
        <path d="M5 4 L12 -6 L18 0 L10 8 Z" fill="#475569" opacity="0.8" />
        <path d="M22 6 L28 -3 L32 3 L26 9 Z" fill="#334155" opacity="0.7" />
        <path d="M-15 8 L-10 2 L-5 7 L-12 10 Z" fill="#64748b" opacity="0.6" />
        <path d="M8 7 L15 1 L20 6 L12 11 Z" fill="#1e293b" opacity="0.65" />

        {/* Additional small fragments */}
        <rect x="-25" y="5" width="8" height="3" fill="#475569" opacity="0.6" transform="rotate(-25 -21 6.5)" />
        <rect x="15" y="4" width="6" height="2.5" fill="#64748b" opacity="0.55" transform="rotate(15 18 5.25)" />
        <rect x="-5" y="6" width="10" height="2" fill="#334155" opacity="0.5" transform="rotate(-10 0 7)" />

        {/* Dark/burnt pieces */}
        <path d="M-18 7 L-14 4 L-10 8 L-16 9 Z" fill="#1e1e1e" opacity="0.7" />
        <path d="M10 8 L14 5 L18 9 L12 10 Z" fill="#2d2d2d" opacity="0.65" />

        {/* Small detail bits */}
        <circle cx="-8" cy="8" r="1.5" fill="#ef4444" opacity="0.6" />
        <circle cx="6" cy="9" r="1" fill="#94a3b8" opacity="0.5" />
        <circle cx="20" cy="7" r="1.2" fill="#475569" opacity="0.6" />
    </g>
)

const ASSET_LIST = [IsoHouse, IsoCar, IsoServer, IsoGold]
const ASSET_VALUES = ["-$450,000", "-$85,000", "-$25,000", "-$31.70"]

// ==========================================
// 2. THE MAIN COMPONENT
// ==========================================

export default function IsometricDestructionPress() {
    const [cycleState, setCycleState] = useState<'ingress' | 'wait' | 'crush' | 'egress'>('ingress')
    const [assetIndex, setAssetIndex] = useState(0)
    const [isCrushed, setIsCrushed] = useState(false) // Track if asset has been crushed

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>

        const runLoop = () => {
            setIsCrushed(false) // Reset for new asset
            setCycleState('ingress')
            timeout = setTimeout(() => {
                setCycleState('wait')
                timeout = setTimeout(() => {
                    setCycleState('crush')
                    setIsCrushed(true) // Mark as crushed!
                    timeout = setTimeout(() => {
                        setCycleState('egress')
                        timeout = setTimeout(() => {
                            setAssetIndex((prev) => (prev + 1) % ASSET_LIST.length)
                            runLoop()
                        }, 1300) // MATCH ANIMATION DURATION (1.2s + buffer)
                    }, 400)
                }, 100)
            }, 1000)
        }

        runLoop()
        return () => clearTimeout(timeout)
    }, [])

    const CurrentAsset = ASSET_LIST[assetIndex]
    const CurrentValue = ASSET_VALUES[assetIndex]

    return (
        <div className="w-full h-56 sm:h-72 relative flex items-center justify-center overflow-hidden select-none">

            {/* Screen Shake Wrapper */}
            <motion.div
                className="relative w-full max-w-3xl h-full flex items-center justify-center"
                animate={cycleState === 'crush' ? { y: [0, 8, -4, 2, 0] } : { y: 0 }}
                transition={{ duration: 0.2 }}
            >
                <svg viewBox="0 0 800 350" className="w-full h-full drop-shadow-2xl">

                    <defs>
                        <linearGradient id="floorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0f172a" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
                        </linearGradient>
                        <radialGradient id="lavaGlow" cx="0.5" cy="0.2">
                            <stop offset="0%" stopColor="#ff6b00" stopOpacity="1" />
                            <stop offset="40%" stopColor="#ff4500" stopOpacity="0.8" />
                            <stop offset="70%" stopColor="#d32f2f" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#1a0000" stopOpacity="0.9" />
                        </radialGradient>
                    </defs>

                    {/* --- LAVA PIT (below belt edge - where gravity takes objects) --- */}
                    <g transform="translate(730, 320)">
                        {/* Pit opening - positioned below belt */}
                        <ellipse cx="0" cy="0" rx="70" ry="30" fill="url(#lavaGlow)" />

                        {/* Bubbling lava effect */}
                        <motion.ellipse
                            cx="-20" cy="0" rx="15" ry="8" fill="#ff6b00" opacity="0.7"
                            animate={{ scaleY: [1, 1.4, 1], opacity: [0.7, 0.9, 0.7] }}
                            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                        />
                        <motion.ellipse
                            cx="25" cy="2" rx="12" ry="6" fill="#ff4500" opacity="0.6"
                            animate={{ scaleY: [1, 1.3, 1], opacity: [0.6, 0.8, 0.6] }}
                            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", delay: 0.6 }}
                        />

                        {/* Glow rings */}
                        <motion.ellipse
                            cx="0" cy="0" rx="72" ry="32" fill="none" stroke="#ff6b00" strokeWidth="2" opacity="0.4"
                            animate={{ opacity: [0.4, 0.7, 0.4], scaleX: [1, 1.05, 1], scaleY: [1, 1.05, 1] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        />

                        {/* Heat distortion effect */}
                        <motion.ellipse
                            cx="0" cy="-10" rx="60" ry="15" fill="#ff4500" opacity="0.2"
                            animate={{ opacity: [0.2, 0.4, 0.2], y: [-10, -15, -10] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.3 }}
                        />
                    </g>

                    {/* --- LAYER 1: THE CONVEYOR BELT --- */}
                    <path d="M50 250 L750 250 L700 300 L0 300 Z" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                    <path d="M0 300 L700 300 L700 320 L0 320 Z" fill="#020617" />

                    <g clipPath="url(#beltClip)">
                        <defs>
                            <clipPath id="beltClip">
                                <path d="M50 250 L750 250 L700 300 L0 300 Z" />
                            </clipPath>
                        </defs>
                        <motion.g
                            animate={{ x: cycleState === 'wait' || cycleState === 'crush' ? 0 : [0, 200] }}
                            transition={{ repeat: Infinity, duration: cycleState === 'ingress' || cycleState === 'egress' ? 1.5 : 10000, ease: "linear" }}
                        >
                            {[...Array(12)].map((_, i) => (
                                <path key={i} d={`M${-200 + (i * 100)} 250 L${-250 + (i * 100)} 300`} stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                            ))}
                        </motion.g>
                    </g>

                    {/* --- LAYER 2: THE ASSET OR JUNK --- */}
                    <motion.g
                        key={assetIndex}
                        initial={{ x: -200, y: 230, opacity: 1 }} // Spawn ALREADY ON BELT
                        animate={{
                            x: cycleState === 'ingress' ? 375 : cycleState === 'egress' ? 740 : 375, // Slide past edge
                            y: cycleState === 'egress' && isCrushed ? [230, 230, 450] : 230, // Stay flat, THEN fall
                        }}
                        transition={{
                            x: {
                                duration: cycleState === 'ingress' ? 1 : cycleState === 'egress' ? 1.2 : 0, // Slower egress for better visual
                                ease: "linear"
                            },
                            y: {
                                duration: cycleState === 'egress' ? 1.2 : 0,
                                times: [0, 0.85, 1], // Slide for 85% of time, then FALL
                                ease: "circIn" // Accelerate down
                            }
                        }}
                    >
                        {/* Conditionally render either intact asset or junk */}
                        <motion.g
                            style={{ originY: 1, originX: 0.5 }}
                            variants={squishVariants}
                            animate={cycleState === 'crush' ? 'crushed' : 'moving'}
                            transition={{ duration: 0.1, type: "spring", stiffness: 300 }}
                        >
                            {isCrushed ? (
                                <motion.g
                                    initial={{ filter: "none", y: 15 }} // FIX: Push down 15px to stop floating
                                    animate={{
                                        filter: cycleState === 'egress' ? ["none", "none", "sepia(1) saturate(5) hue-rotate(-50deg) drop-shadow(0 0 20px #ff4500)"] : "none",
                                        scale: cycleState === 'egress' ? [1, 1, 0.8] : 1,
                                        y: 15 // Maintain offset
                                    }}
                                    transition={{
                                        duration: 1.2,
                                        times: [0, 0.85, 1] // Sync burning with falling
                                    }}
                                >
                                    <GenericJunk />
                                </motion.g>
                            ) : <CurrentAsset />}
                        </motion.g>
                    </motion.g>

                    {/* --- LAYER 3: DUST PARTICLES --- */}
                    <AnimatePresence>
                        {cycleState === 'crush' && (
                            <motion.g transform="translate(375, 270)">
                                {[...Array(6)].map((_, i) => (
                                    <motion.rect
                                        key={i}
                                        x={0} y={0} width={6} height={6} fill="#94a3b8"
                                        initial={{ scale: 0, x: 0, y: 0 }}
                                        animate={{
                                            scale: 0,
                                            x: (Math.random() - 0.5) * 150,
                                            y: -20 - Math.random() * 50,
                                            opacity: 0
                                        }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                    />
                                ))}
                            </motion.g>
                        )}
                    </AnimatePresence>

                    {/* --- LAYER 4: THE MACHINE --- */}

                    {/* Piston Rod */}
                    <motion.rect
                        x="355" width="40" fill="#64748b"
                        initial={{ y: 0, height: 150 }}
                        animate={{
                            y: cycleState === 'crush' ? 80 : 0,
                            height: cycleState === 'crush' ? 200 : 150
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    />

                    {/* Crusher Head */}
                    <motion.g
                        initial={{ y: 150 }}
                        animate={{ y: cycleState === 'crush' ? 280 : 150 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                        <path d="M310 0 L440 0 L440 40 L310 40 Z" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                        <path d="M310 0 L340 -30 L470 -30 L440 0 Z" fill="#334155" />
                        <motion.rect
                            x="315" y="30" width="120" height="6"
                            animate={{ fill: cycleState === 'crush' ? '#ef4444' : '#1e293b' }}
                        />
                    </motion.g>

                    <path d="M250 -100 L310 -100 L310 350 L250 320 Z" fill="#0f172a" />
                    <path d="M250 320 L250 350 L750 350 L750 320 Z" fill="url(#floorGradient)" opacity="0.5" />

                    {/* --- LAYER 5: FLOATING TEXT (WITH RANDOM POSITION) --- */}
                    <AnimatePresence mode='wait'>
                        {cycleState === 'crush' && (
                            <motion.text
                                key={assetIndex}
                                initial={{
                                    opacity: 0,
                                    scale: 0.5,
                                    x: 380 + (Math.random() - 0.5) * 100,
                                    y: 220 + (Math.random() - 0.5) * 80
                                }}
                                animate={{ opacity: 1, y: 150, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                fill="#f87171"
                                fontSize="32"
                                fontFamily="monospace"
                                fontWeight="bold"
                                style={{ textShadow: "0px 0px 20px rgba(239, 68, 68, 0.6)" }}
                            >
                                {CurrentValue}
                            </motion.text>
                        )}
                    </AnimatePresence>

                </svg>
            </motion.div>
        </div>
    )
}
