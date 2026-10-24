import { Variants } from "framer-motion";

// --- 1. Container Stagger ---
// Use this on parent lists (e.g., your grid of TokenCards) to stagger children
export const containerStagger: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05, // Delay between each item
            delayChildren: 0.1,
        },
    },
};

// --- 2. Card Entrance (Fade Up) ---
// Use this on individual TokenCards
export const fadeInUp: Variants = {
    hidden: {
        opacity: 0,
        y: 20,
        scale: 0.95
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
            mass: 0.9
        }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.2 }
    }
};

// --- 3. Content Expansion (Accordion) ---
// Perfect for your TokenCard detail section
export const accordionVariants: Variants = {
    collapsed: {
        height: 0,
        opacity: 0,
        transition: {
            height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }, // Apple-style ease
            opacity: { duration: 0.2 } // Fade out faster than closing
        }
    },
    expanded: {
        height: "auto",
        opacity: 1,
        transition: {
            height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
            opacity: { duration: 0.3, delay: 0.1 } // Delay fade in slightly
        }
    }
};

// --- 4. Number Ticker (Counter) ---
// Great for portfolio balance changes
export const numberTickerVariants: Variants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
};

// --- 5. Button/Interactive Tap ---
// Use on clickable cards or buttons
export const tapAnimation = {
    scale: 0.98,
    transition: { type: "spring", stiffness: 400, damping: 10 }
} as const;

export const hoverAnimation = {
    y: -2,
    transition: { type: "spring", stiffness: 300, damping: 20 }
} as const;

// --- 6. Modal / Overlay Entrance ---
export const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: "spring", duration: 0.4, bounce: 0.3 }
    },
    exit: { opacity: 0, scale: 0.9, y: 20 }
};

// --- 7. Cinematic: Thanos Reverse (Vaporize In) ---
// Cards form from dust
export const thanosReverse: Variants = {
    hidden: {
        opacity: 0,
        scale: 1.1,
        filter: 'blur(20px)',
        y: 10
    },
    visible: {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        y: 0,
        transition: {
            duration: 0.8,
            ease: "easeOut"
        }
    }
};

// --- 8. Cinematic: Speedometer Woosh ---
// Chart spins up like an engine starting
// --- 8. Cinematic: Speedometer Woosh ---
// Chart scales up like an engine starting
export const speedometerWoosh: Variants = {
    hidden: {
        scale: 0.8,
        opacity: 0
    },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 10,
            mass: 0.8,
            delay: 0.5 // Wait for cards approx
        }
    }
};

// --- 9. Cinematic: Text Fade In ---
// For chart labels
export const textFadeIn: Variants = {
    hidden: {
        opacity: 0,
        y: 10,
        scale: 0.9
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 15,
            mass: 0.5
        }
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        transition: { duration: 0.1 }
    }

};



// --- NEW: "ALIVE" LIQUID GRADIENT ---

// 1. The Style Helper: Creates a complex, oversized background
export const getLiquidGradientStyle = (color: string) => ({
    // We create 3 distinct splash zones that will blend together
    backgroundImage: `
        radial-gradient(circle at 20% 30%, ${color}40 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, ${color}40 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, ${color}20 0%, transparent 60%)
    `,
    // Make the background huge so we can move it around
    backgroundSize: "200% 200%",
    // Blend mode helps the colors mix luminously on the dark bg
    mixBlendMode: "plus-lighter" as const,
});

// 2. The Animation Variant: Slowly shifts the background position
export const liquidMovement: Variants = {
    noGlow: { opacity: 0 },
    // The "breathing" state when just sitting there
    idle: {
        opacity: 0.6,
        backgroundPosition: ["0% 0%", "100% 100%"], // Move diagonally
        scale: 1,
        transition: {
            backgroundPosition: {
                duration: 15, // Slow, continuous movement
                ease: "linear",
                repeat: Infinity,
                repeatType: "mirror" // Go back and forth smoothly
            }
        }
    },
    // The "active" state when hovering/expanded
    active: {
        opacity: 1,
        scale: 1.05, // Slight swell
        backgroundPosition: ["0% 0%", "100% 50%", "50% 100%", "0% 0%"], // More complex movement pattern
        transition: {
            opacity: { duration: 0.3 },
            scale: { duration: 0.3 },
            backgroundPosition: {
                duration: 20, // Slower, more complex path
                ease: "linear",
                repeat: Infinity,
            }
        }
    }
};