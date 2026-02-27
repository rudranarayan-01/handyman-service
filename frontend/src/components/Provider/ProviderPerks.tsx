import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Zap, ShieldCheck, HeartHandshake, type LucideIcon } from 'lucide-react';

interface Perk {
    title: string;
    desc: string;
    icon: LucideIcon;
    color: string;
    grid: string;
}

const perks: Perk[] = [
    {
        title: "Service based Payouts",
        desc: "Get your earnings credited directly to your bank account after each completed service.",
        icon: Wallet,
        color: "bg-emerald-500",
        grid: "md:col-span-2"
    },
    {
        title: "Instant Alerts",
        desc: "Real-time job notifications via SMS and App.",
        icon: Zap,
        color: "bg-orange-500",
        grid: "md:col-span-1"
    },
    {
        title: "Insurance Cover",
        desc: "Accidental insurance for all our active partners.",
        icon: ShieldCheck,
        color: "bg-indigo-500",
        grid: "md:col-span-1"
    },
    {
        title: "Work-Life Balance",
        desc: "You decide when you want to work. Turn on 'Online' mode only when you're ready.",
        icon: HeartHandshake,
        color: "bg-rose-500",
        grid: "md:col-span-2"
    }
];

interface ProviderPerksProps {
    isLoading?: boolean;
}

const ProviderPerks: React.FC<ProviderPerksProps> = ({ isLoading = false }) => {
    return (
        <div className="w-full max-w-3xl lg:max-w-4xl mx-auto px-4 mb-12">
            {/* Skeleton-style Grid Header */}
            <div className="flex items-center gap-6 mb-8">
                <div className="h-[1px] flex-1 bg-slate-200"></div>
                <span className="text-[11px] md:text-xs font-black uppercase tracking-[0.4em] text-slate-400 whitespace-nowrap">
                    Partner Benefits
                </span>
                <div className="h-[1px] flex-1 bg-slate-200"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                {isLoading ? (
                    // --- Skeleton Loader State ---
                    Array(4).fill(0).map((_, i) => (
                        <div key={i} className={`${i === 0 || i === 3 ? 'md:col-span-2' : 'md:col-span-1'} bg-slate-50 border border-slate-100 p-6 rounded-[2.5rem] h-[180px] animate-pulse`}>
                            <div className="w-12 h-12 bg-slate-200 rounded-2xl mb-4"></div>
                            <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
                            <div className="h-3 bg-slate-200 rounded w-full"></div>
                        </div>
                    ))
                ) : (
                    // --- Actual Content ---
                    perks.map((perk, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className={`${perk.grid} group relative overflow-hidden bg-white/70 backdrop-blur-sm border border-slate-100 p-6 md:p-8 rounded-[2.5rem] hover:shadow-2xl hover:shadow-indigo-100/50 hover:border-indigo-100 transition-all duration-500 flex flex-col justify-between min-h-[160px] md:min-h-[200px]`}
                        >
                            <div className="flex justify-between items-start relative z-10">
                                <div className={`${perk.color} p-3 md:p-4 rounded-2xl md:rounded-[1.5rem] text-white shadow-lg shadow-current/20 group-hover:scale-110 transition-transform duration-500`}>
                                    <perk.icon size={22} className="md:w-6 md:h-6" strokeWidth={2.5} />
                                </div>
                                <div className="text-[12px] md:text-sm font-black text-slate-200 group-hover:text-indigo-600 transition-colors tracking-tighter">
                                    {String(i + 1).padStart(2, '0')}
                                </div>
                            </div>

                            <div className="mt-6 relative z-10">
                                <h3 className="text-base md:text-xl font-black text-slate-900 tracking-tight leading-none group-hover:text-indigo-600 transition-colors">
                                    {perk.title}
                                </h3>
                                <p className="text-[12px] md:text-[14px] text-slate-500 font-medium leading-relaxed mt-2 md:mt-3 max-w-[280px] md:max-w-full">
                                    {perk.desc}
                                </p>
                            </div>
                            
                            {/* Decorative Background Element */}
                            <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${perk.color} opacity-[0.03] rounded-full blur-3xl group-hover:opacity-[0.08] transition-opacity`}></div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProviderPerks;