import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
    isOpen: boolean
    message: string
    type?: ToastType
    onClose: () => void
    duration?: number
}

const icons = {
    success: <CheckCircle2 className="w-6 h-6 text-white" />,
    error: <XCircle className="w-6 h-6 text-white" />,
    warning: <AlertCircle className="w-6 h-6 text-white" />,
    info: <Info className="w-6 h-6 text-white" />
}

const bgColors = {
    success: 'bg-emerald-500/90 shadow-emerald-500/20',
    error: 'bg-red-500/90 shadow-red-500/20',
    warning: 'bg-amber-500/90 shadow-amber-500/20',
    info: 'bg-blue-500/90 shadow-blue-500/20'
}

export const Toast = ({ isOpen, message, type = 'success', onClose, duration = 4000 }: ToastProps) => {
    useEffect(() => {
        if (isOpen && duration > 0) {
            const timer = setTimeout(onClose, duration)
            return () => clearTimeout(timer)
        }
    }, [isOpen, duration, onClose])

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -100, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className={`fixed top-6 left-1/2 -translate-x-1/2 z-[99999] flex items-center gap-4 px-6 py-4 rounded-2xl shadow-xl backdrop-blur-md border border-white/20 min-w-[320px] max-w-[90vw] ${bgColors[type]}`}
                >
                    <div className="shrink-0">
                        {icons[type]}
                    </div>
                    <p className="flex-1 text-white font-medium text-sm leading-snug">
                        {message}
                    </p>
                    <button
                        onClick={onClose}
                        className="shrink-0 p-1 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <XCircle className="w-5 h-5 text-white/80" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    )
}
