import Footer from '@/components/Footer'
import Header from '@/components/Header'
import JoinPartner from '@/components/Provider/JoinProvider'
import ProviderPerks from '@/components/Provider/ProviderPerks'
import { motion } from 'framer-motion'
import { Home, ChevronRight, UserPlus, Info, ShieldCheck } from 'lucide-react'

const ProviderPage = () => {
  return (
    <div>
        <Header/>
        <ProviderHeader/>
        <ProviderPerks/>
        <JoinPartner/>
        <Footer/>
    </div>
  )
}

export default ProviderPage



interface ProviderHeaderProps {
    isLoading?: boolean;
}

const ProviderHeader: React.FC<ProviderHeaderProps> = ({ isLoading = false }) => {
    if (isLoading) {
        return (
            <div className="w-full max-w-3xl lg:max-w-4xl mx-auto px-4 pt-10 pb-6 animate-pulse">
                <div className="h-4 bg-slate-100 w-32 rounded-md mb-6"></div>
                <div className="flex justify-between items-end border-b border-slate-100 pb-8">
                    <div className="space-y-3">
                        <div className="h-3 bg-slate-100 w-24 rounded-full"></div>
                        <div className="h-10 bg-slate-100 w-64 rounded-xl"></div>
                    </div>
                    <div className="h-12 bg-slate-100 w-32 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl lg:max-w-4xl mx-auto px-4 pt-10 pb-6">
            {/* 1. Enhanced Breadcrumbs */}
            <nav className="flex items-center gap-2 mb-8">
                <div className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer group">
                    <div className="p-1.5 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                        <Home size={14} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.15em]">Home</span>
                </div>
                <ChevronRight size={14} className="text-slate-300" />
                <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50/50 px-3 py-1.5 rounded-lg border border-indigo-100/50">
                    <ShieldCheck size={14} />
                    <span className="text-[11px] font-black uppercase tracking-[0.15em]">Join as Partner</span>
                </div>
            </nav>

            {/* 2. Main Title & Status Badge */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </div>
                        <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">Onboarding System Active</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[0.85]">
                        Partner <span className="text-indigo-600 italic">Application</span>
                    </h1>
                    <p className="text-slate-400 text-xs md:text-sm font-medium mt-4">
                        Fill in your professional details to start your journey.
                    </p>
                </div>

                {/* Progress Badge */}
                <div className="flex items-center gap-4 bg-white border border-slate-100 p-2 pr-5 rounded-[1.5rem] self-start md:self-auto shadow-xl shadow-slate-200/40">
                    <div className="w-12 h-12 bg-slate-900 text-indigo-400 rounded-2xl flex items-center justify-center">
                        <UserPlus size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-tighter leading-none mb-1">Step 01 of 02</span>
                        <span className="text-[12px] text-slate-400 font-bold whitespace-nowrap">Profile & Verification</span>
                    </div>
                </div>
            </div>

            {/* 3. Refined Notification Bar */}
            <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mt-8 flex items-center gap-4 bg-slate-50 border border-slate-100 p-5 rounded-[2rem]"
            >
                <div className="shrink-0 w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                    <Info size={18} />
                </div>
                <p className="text-[12px] md:text-[13px] text-slate-500 leading-relaxed font-medium">
                    <span className="font-bold text-slate-900">Document Notice:</span> Please ensure your Identity Documents match your legal name to avoid 
                    <span className="text-rose-500 font-bold italic ml-1 text-[11px] uppercase">Review Rejection.</span>
                </p>
            </motion.div>
        </div>
    );
};

