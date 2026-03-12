import Footer from '@/components/Footer'
import Header from '@/components/Header'
import JoinPartner from '@/components/Provider/JoinProvider'
import ProviderPerks from '@/components/Provider/ProviderPerks'
import { motion } from 'framer-motion'
import { Home, ChevronRight, UserPlus, Info, ShieldCheck, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

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



const ProviderHeader: React.FC<{ isLoading?: boolean }> = ({ isLoading = false }) => {
    const navigate = useNavigate();
    if (isLoading) {
        return (
            <div className="w-full bg-slate-900 pt-20 pb-32 animate-pulse">
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="h-4 bg-white/10 w-32 rounded-md mb-6"></div>
                    <div className="h-16 bg-white/10 w-2/3 rounded-2xl mb-4"></div>
                    <div className="h-4 bg-white/10 w-1/2 rounded-md"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* 1. DARK HERO SECTION (Matching Blog Aesthetic) */}
            <div className="w-full bg-[#030712] pt-12 pb-24 mt-20 relative overflow-hidden">
                {/* Background Decor - Subtle Glows */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-600/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4" />

                <div className="max-w-[1200px] mx-auto px-6 relative z-10">
                    {/* Breadcrumbs - Light Mode for Dark BG */}
                    <nav className="flex items-center gap-2 mb-10" onClick={()=>navigate('/')}>
                        <div className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer group">
                            <Home size={14} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Home</span>
                        </div>
                        <ChevronRight size={12} className="text-slate-600" />
                        <div className="flex items-center gap-2 text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
                            <ShieldCheck size={12} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Partner Portal</span>
                        </div>
                    </nav>

                    {/* Main Content Area */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                        <div className="space-y-6 max-w-2xl">
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full"
                            >
                                <Sparkles size={14} className="text-indigo-400 animate-pulse" />
                                <span className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.25em]">Join the Elite 1%</span>
                            </motion.div>

                            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.85]">
                                Insights for <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 italic">Modern Partners.</span>
                            </h1>

                            <p className="text-slate-400 text-sm md:text-lg font-medium max-w-lg leading-relaxed">
                                Redefining professional home care in India through expert guides and verified success stories.
                            </p>
                        </div>

                        {/* Progress Badge - Floating Style */}
                        <motion.div 
                            whileHover={{ y: -5 }}
                            className="bg-white p-1 rounded-[2.5rem] shadow-2xl shadow-indigo-500/20 flex items-center pr-8 gap-4"
                        >
                            <div className="w-16 h-16 bg-slate-900 text-indigo-400 rounded-[2rem] flex items-center justify-center shadow-inner">
                                <UserPlus size={24} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-black text-slate-950 uppercase tracking-tighter">Onboarding</span>
                                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
                                </div>
                                <span className="text-sm font-black text-slate-400 block leading-none">Step 01 <span className="text-slate-900">/ 02</span></span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* 2. STATS BAR TRANSITION (Matches Blog Bottom Bar) */}
            <div className="max-w-[1100px] mx-auto px-4 -mt-12 relative z-20">
                <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 p-2 md:p-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                        { label: "Vetted Pros", val: "10k+", icon: <CheckCircle2 size={16}/> },
                        { label: "Expert Partners", val: "500+", icon: <Sparkles size={16}/> },
                        { label: "Cities Covered", val: "15+", icon: <Home size={16}/> },
                        { label: "Avg. Rating", val: "4.9/5", icon: <Sparkles size={16}/> }
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col items-center justify-center py-6 rounded-[2rem] hover:bg-slate-50 transition-colors group">
                            <span className="text-2xl font-black text-slate-900 tracking-tighter mb-1 group-hover:text-indigo-600 transition-colors">{stat.val}</span>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. REFINED NOTICE AREA */}
            <div className="max-w-[1100px] mx-auto px-6 mt-12">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col md:flex-row items-center gap-6 bg-indigo-50/50 border border-indigo-100/50 p-6 rounded-[2.5rem]"
                >
                    <div className="shrink-0 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-50">
                        <Info size={20} />
                    </div>
                    <div className="text-center md:text-left">
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                            <span className="font-black text-slate-900 uppercase text-[10px] tracking-widest block mb-1">Document Notice</span>
                            Please ensure your Identity Documents match your legal name to avoid 
                            <span className="text-rose-500 font-black italic ml-1 text-[11px] uppercase tracking-tighter">Review Rejection.</span>
                        </p>
                    </div>
                    <button className="md:ml-auto group flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-indigo-600 active:scale-95">
                        Read Guide <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            </div>
        </div>
    );
};