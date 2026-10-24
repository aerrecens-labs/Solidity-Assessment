import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Zap, Shield, TrendingUp } from 'lucide-react';

interface TutorialModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const slides = [
    {
        icon: <Zap size={48} className="text-yellow-400" />,
        title: "Instant Diversification",
        description: "Select a curated CryptoPack to instantly diversify your portfolio across top-performing DeFi protocols, staking pools, and yield farms.",
        color: "from-yellow-500/20 to-orange-500/20"
    },
    {
        icon: <Shield size={48} className="text-blue-400" />,
        title: "Professional Management",
        description: "Each pack is managed by expert fund managers who rebalance assets daily to maximize returns and minimize risk.",
        color: "from-blue-500/20 to-indigo-500/20"
    },
    {
        icon: <TrendingUp size={48} className="text-green-400" />,
        title: "Earn Passive Yield",
        description: "Sit back and watch your wealth grow. Track your performance in real-time and withdraw your funds whenever you like.",
        color: "from-green-500/20 to-emerald-500/20"
    }
];

const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(curr => curr + 1);
        } else {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-lg bg-[#1b1f4a] border border-[#2a2c54] rounded-2xl overflow-hidden shadow-2xl"
                >
                    {/* Background Glow */}
                    <div className={`absolute top-0 left-0 w-full h-48 bg-gradient-to-b ${slides[currentSlide].color} blur-3xl opacity-50 transition-colors duration-500`} />

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors z-10"
                    >
                        <X size={20} />
                    </button>

                    <div className="relative z-10 p-8 pt-12 text-center">
                        <motion.div
                            key={currentSlide}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-center"
                        >
                            <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-lg backdrop-blur-md">
                                {slides[currentSlide].icon}
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-4">
                                {slides[currentSlide].title}
                            </h2>

                            <p className="text-gray-400 leading-relaxed mb-8 min-h-[80px]">
                                {slides[currentSlide].description}
                            </p>
                        </motion.div>

                        <div className="flex items-center justify-between mt-4">
                            {/* Dots Indicator */}
                            <div className="flex gap-2">
                                {slides.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-blue-500 w-6' : 'bg-white/20'
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={nextSlide}
                                className="flex items-center gap-2 px-6 py-3 bg-white text-[#0f1230] font-bold rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                {currentSlide === slides.length - 1 ? 'Start Investing' : 'Next'}
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default TutorialModal;
