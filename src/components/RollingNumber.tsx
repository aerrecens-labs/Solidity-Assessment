import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

export const RollingNumber = ({ value, prefix = '', suffix = '', delay = 0 }: { value: number, prefix?: string, suffix?: string, delay?: number }) => {
    const motionValue = useMotionValue(0)
    const rounded = useTransform(motionValue, (latest) => latest.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }))
    const hasAnimated = useRef(false)

    useEffect(() => {
        if (!hasAnimated.current) {
            // First load: Roll from 0
            const controls = animate(motionValue, value, {
                duration: 2,
                delay: delay,
                ease: "circOut"
            })
            hasAnimated.current = true
            return controls.stop
        } else {
            // Updates: Smooth transition from current to new
            const controls = animate(motionValue, value, {
                duration: 0.5,
                ease: "easeOut"
            })
            return controls.stop
        }
    }, [value, delay])

    return (
        <span className="inline-flex">
            {prefix}<motion.span>{rounded}</motion.span>{suffix}
        </span>
    )
}
