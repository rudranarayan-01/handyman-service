import React, { useRef } from 'react';
import {
    ShieldCheck, Zap,
    ArrowRight, Star,
    Smartphone, Calendar, CheckCircle2,
    Sparkles
} from 'lucide-react';
import { AnimatedBeam } from './ui/animated-beam';
import Reviews from './Reviews';

// --- 2. Bento Services Grid ---
const AnimatedBento: React.FC = () => {
    return (
        <section className="py-12 px-4 md:px-6 max-w-6xl mx-auto bg-white flex flex-col items-center">
            {/* Header */}
            <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4 px-2">
                <div className="space-y-1 text-left">
                    <div className="flex items-center gap-2 text-indigo-600">
                        <Sparkles size={16} className="animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Our Hub</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter leading-none">
                        Popular <span className="text-indigo-600">Categories</span>
                    </h2>
                </div>
                <button className="group flex items-center gap-2 bg-slate-100 text-slate-900 px-5 py-2.5 rounded-xl font-bold text-xs transition-all hover:bg-slate-900 hover:text-white active:scale-95">
                    View All
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[550px] w-full">
                {/* Cards remain same as your logic... */}
                <div className="md:col-span-2 md:row-span-2 bg-[#0f172a] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 relative overflow-hidden group cursor-pointer shadow-xl border border-slate-200 min-h-[300px]">
                    <img src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-all duration-1000" alt="Cleaning" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
                    <div className="relative z-20 h-full flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <span className="bg-white/10 backdrop-blur-md text-white text-[9px] font-black px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest">Hot</span>
                                <span className="bg-indigo-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1"><ShieldCheck size={10} /> Certified</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-100 leading-tight">Expert <br /> <span className="text-indigo-400">Deep</span> Cleaning</h2>
                        </div>
                        <span className="w-fit bg-white text-slate-900 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-300 hover:text-black transition-all shadow-lg mt-8">Book Now</span>
                    </div>
                </div>

                <div className="md:col-span-2 bg-slate-100 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 relative overflow-hidden group cursor-pointer shadow-lg border border-slate-200 min-h-[180px]">
                    <img src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-700" alt="AC" />
                    <div className="relative z-10 flex justify-between items-start">
                        <div><h2 className="text-2xl font-black text-slate-900 italic tracking-tighter">AC Revive</h2><p className="text-indigo-600 font-bold text-[10px] mt-1 uppercase tracking-widest">Upto 30% OFF</p></div>
                        <div className="bg-white p-2 rounded-xl text-indigo-600 shadow-sm"><Zap size={20} fill="currentColor" /></div>
                    </div>
                    <div className="mt-8 flex items-center gap-2 relative z-10">
                        <div className="h-1 w-6 bg-indigo-600 rounded-full group-hover:w-12 transition-all"></div>
                        <span className="text-slate-900 font-black text-[10px] uppercase tracking-widest">Fast Track Service</span>
                    </div>
                </div>

                <div className="bg-[#fff7ed] rounded-[2rem] md:rounded-[2.5rem] p-6 flex flex-col justify-between group cursor-pointer transition-all duration-500 hover:bg-orange-50 border border-orange-100 relative overflow-hidden min-h-[180px]">
                    <div className="flex justify-between items-start">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md group-hover:bg-orange-600 group-hover:text-white transition-all"><Star size={18} fill="currentColor" /></div>
                        <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=200&auto=format&fit=crop" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md group-hover:scale-110 transition-transform" alt="chef" />
                    </div>
                    <div className="mt-4"><h3 className="font-black text-slate-800 text-lg tracking-tighter leading-none">Home <br />Chef</h3><p className="text-orange-600 text-[9px] font-black uppercase mt-1">Healthy Meals</p></div>
                </div>

                <div className="bg-[#eff6ff] rounded-[2rem] md:rounded-[2.5rem] p-6 flex flex-col justify-between group cursor-pointer transition-all duration-500 hover:bg-blue-50 border border-blue-100 relative overflow-hidden min-h-[180px]">
                    <div className="flex justify-between items-start">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md group-hover:bg-blue-600 group-hover:text-white transition-all"><Calendar size={18} /></div>
                    </div>
                    <div className="mt-4"><h3 className="font-black text-slate-800 text-lg tracking-tighter leading-none">Expert <br />Plumber</h3><p className="text-blue-600 text-[9px] font-black uppercase mt-1">Instant Repair</p></div>
                </div>
            </div>
        </section>
    );
};

// --- 3. Process Flow Component (Centered Fix) ---
const ProcessFlow: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const ref0 = useRef<HTMLDivElement>(null)
    const ref1 = useRef<HTMLDivElement>(null)
    const ref2 = useRef<HTMLDivElement>(null)
    const stepRefs = [ref0, ref1, ref2]

    const steps = [
        { icon: Smartphone, title: "Select Service", desc: "Choose from 50+ services", color: "text-orange-500 bg-orange-50" },
        { icon: Calendar, title: "Slot reserved", desc: "Quick schedule of experts", color: "text-indigo-500 bg-indigo-50" },
        { icon: CheckCircle2, title: "Pro Arrives", desc: "Service done at your door", color: "text-emerald-500 bg-emerald-50" }
    ]

    return (
        <section className="py-16 md:py-24 px-4 md:px-6 bg-white rounded-[2.5rem] md:rounded-[4rem] my-10 max-w-360 mx-auto shadow-sm border border-slate-50 flex flex-col items-center">
            {/* Header - Centered */}
            <div className="text-center mb-16 md:mb-20">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 italic leading-none">Simple 3-Step Booking</h2>
                <div className="h-1.5 w-20 md:w-24 bg-indigo-600 mx-auto mt-6 rounded-full"></div>
            </div>

            {/* Steps Container - justify-center for desktop balance */}
            <div
                ref={containerRef}
                className="relative w-full flex flex-col md:flex-row justify-center items-center md:items-start gap-12 md:gap-16 lg:gap-24"
            >
                {steps.map((item, i) => (
                    <div key={i} className="flex flex-col items-center text-center relative z-10 group w-full max-w-[260px]">
                        <div
                            ref={stepRefs[i]}
                            className={`${item.color} w-20 h-20 md:w-24 md:h-24 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center mb-6 md:mb-8 shadow-xl shadow-slate-100 group-hover:-translate-y-2 transition-transform duration-500`}
                        >
                            <item.icon className="w-8 h-8 md:w-9 md:h-9" strokeWidth={2.5} />
                        </div>
                        <h4 className="text-lg md:text-xl font-black text-slate-900 mb-2 md:mb-3 tracking-tight">{item.title}</h4>
                        <p className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest leading-relaxed max-w-[200px]">{item.desc}</p>
                    </div>
                ))}

                {/* Beams */}
                <div className="hidden md:block">
                    <AnimatedBeam
                        duration={3}
                        containerRef={containerRef}
                        fromRef={ref0}
                        toRef={ref1}
                        gradientStartColor="#f97316"
                        gradientStopColor="#6366f1"
                        pathColor="#f97316"
                        pathOpacity={0.2}
                        pathWidth={2}
                    />
                    <AnimatedBeam
                        duration={3}
                        containerRef={containerRef}
                        fromRef={ref1}
                        toRef={ref2}
                        gradientStartColor="#6366f1"
                        gradientStopColor="#10b981"
                        pathColor="#6366f1"
                        pathOpacity={0.2}
                        pathWidth={2}
                    />
                </div>
            </div>
        </section>
    )
}

const HomePageExtraComponents: React.FC = () => {
    return (
        <div className="space-y-6 md:space-y-10 overflow-x-hidden">
            <AnimatedBento />
            <Reviews />
            <ProcessFlow />
        </div>
    );
};

export default HomePageExtraComponents;
