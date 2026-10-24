import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Check } from 'lucide-react';

interface TourStep {
    targetId: string;
    title: string;
    content: string;
}

interface TourOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    steps: TourStep[];
}

const TourOverlay: React.FC<TourOverlayProps> = ({ isOpen, onClose, steps }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    // Update target position on step change or resize
    useEffect(() => {
        if (!isOpen) return;

        const updatePosition = () => {
            const element = document.getElementById(steps[currentStep]?.targetId);
            if (element) {
                const rect = element.getBoundingClientRect();
                setTargetRect(rect);
                // Scroll into view if needed
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        };

        // Small delay to ensure DOM is ready/rendered
        const timeout = setTimeout(updatePosition, 100);
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition);

        return () => {
            clearTimeout(timeout);
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition);
        };
    }, [currentStep, isOpen, steps]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(curr => curr + 1);
        } else {
            onClose();
        }
    };

    if (!isOpen || !targetRect) return null;

    // Calculate tooltip position (prefer right, fallback to left or bottom)
    const isRightSpace = window.innerWidth - targetRect.right > 350;
    const isLeftSpace = targetRect.left > 350;
    const isBottomSpace = window.innerHeight - targetRect.bottom > 200;

    let tooltipStyle: React.CSSProperties = {};
    let arrowStyle: React.CSSProperties = {};

    if (isRightSpace) {
        tooltipStyle = { top: targetRect.top, left: targetRect.right + 20 };
        arrowStyle = { top: 20, left: -6, transform: 'rotate(45deg)' };
    } else if (isLeftSpace) {
        tooltipStyle = { top: targetRect.top, left: targetRect.left - 340 };
        arrowStyle = { top: 20, right: -6, transform: 'rotate(45deg)' };
    } else {
        // Default to bottom / centered if no side space
        tooltipStyle = { top: targetRect.bottom + 20, left: targetRect.left + (targetRect.width / 2) - 160 };
        arrowStyle = { top: -6, left: '50%', transform: 'translateX(-50%) rotate(45deg)' };
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] overflow-hidden">
                {/* Spotlight Effect using Box Shadow */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute shadow-[0_0_0_9999px_rgba(0,0,0,0.85)] rounded-2xl pointer-events-none border border-blue-500/30"
                    style={{
                        top: targetRect.top - 4,
                        left: targetRect.left - 4,
                        width: targetRect.width + 8,
                        height: targetRect.height + 8,
                    }}
                />

                {/* Tooltip Card */}
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="absolute w-[320px] bg-[#0f1230] border border-[#2a2c54] rounded-xl p-5 shadow-2xl z-[101]"
                    style={tooltipStyle}
                >
                    {/* Arrow */}
                    <div className="absolute w-3 h-3 bg-[#0f1230] border-l border-t border-[#2a2c54]" style={arrowStyle} />

                    <div className="relative">
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-[10px] text-white">
                                    {currentStep + 1}
                                </span>
                                {steps[currentStep].title}
                            </h3>
                            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                                <X size={16} />
                            </button>
                        </div>

                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            {steps[currentStep].content}
                        </p>

                        <div className="flex items-center justify-between">
                            <div className="flex gap-1.5">
                                {steps.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentStep ? 'bg-blue-500' : 'bg-white/10'
                                            }`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={handleNext}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all"
                            >
                                {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                                {currentStep === steps.length - 1 ? <Check size={14} /> : <ChevronRight size={14} />}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default TourOverlay;
