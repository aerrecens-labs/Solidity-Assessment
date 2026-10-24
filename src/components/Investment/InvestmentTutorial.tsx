import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Zap, TrendingUp } from 'lucide-react';

const InvestmentTutorial: React.FC = () => {
    const steps = [
        {
            icon: <Layers size={24} className="text-blue-400" />,
            title: "Select a Pack",
            description: "Choose a curated strategy that fits your risk profile."
        },
        {
            icon: <Zap size={24} className="text-yellow-400" />,
            title: "Allocate Funds",
            description: "Decide how much treasury capital to deploy."
        },
        {
            icon: <TrendingUp size={24} className="text-green-400" />,
            title: "Earn Yield",
            description: "Track performance in real-time on your dashboard."
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-8 overflow-hidden"
        >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

                <h3 className="text-gray-400 text-sm uppercase tracking-wider font-semibold mb-6">How it works</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-[28px] left-[16%] right-[16%] h-[2px] bg-white/10 z-0" />

                    {steps.map((step, index) => (
                        <div key={index} className="relative z-10 flex flex-col items-center text-center group">
                            <div className="w-14 h-14 rounded-full bg-[#1A1B23] border border-white/10 flex items-center justify-center mb-4 shadow-lg group-hover:border-blue-500/30 group-hover:shadow-blue-500/10 transition-all duration-300">
                                {step.icon}
                            </div>
                            <h4 className="text-white font-medium mb-1">{step.title}</h4>
                            <p className="text-sm text-gray-500 max-w-[200px]">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default InvestmentTutorial;
