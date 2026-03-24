import React, { useRef } from 'react';
import {
    ShieldCheck, Zap, ArrowRight, Star,
    Calendar, Sparkles, User,
    Smartphone,
    CheckCircle2,
    MousePointer2,
    Clock
} from 'lucide-react';
import Reviews from './Reviews';
import { AnimatedBeam } from './ui/animated-beam';

const AnimatedBento: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const div1Ref = useRef<HTMLDivElement>(null);

    return (
        <section className="py-12 px-4 md:px-6 max-w-300 mx-auto bg-white overflow-hidden">
            {/* Header Area - Optimized for 360px+ */}
            <div className="w-full flex flex-col md:flex-row justify-between items-center mb-10 gap-6 text-center md:text-left">
                <div className="space-y-2">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-indigo-600">
                        <div className="px-2 py-0.5 rounded-full bg-indigo-50 flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">2.4k Pros Online</span>
                        </div>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-[0.85]">
                        Popular <span className="text-indigo-600">Categories</span>
                    </h2>
                </div>

                {/* Floating Interaction Hint (Hidden on tiny screens) */}
                <div className="hidden lg:flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                    <MousePointer2 size={16} className="text-slate-400 animate-bounce" />
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hover cards to explore</p>
                </div>
            </div>

            {/* Main Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 w-full">

                {/* 1. PRIMARY HERO CARD (Cleaning) */}
                <div className="md:col-span-2 md:row-span-2 bg-slate-900 rounded-[2.5rem] p-8 relative overflow-hidden group cursor-pointer shadow-2xl border border-slate-800 min-h-[350px]">
                    <img
                        src="https://res.cloudinary.com/dnz67rxu0/image/upload/v1772955694/qqr7axdursts7qoknwwp.jpg"
                        className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 group-hover:rotate-1 transition-all duration-1000"
                        alt="Deep Cleaning"
                        loading='lazy'
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>

                    <div className="relative z-20 h-full flex flex-col justify-between">
                        <div className="flex flex-wrap gap-2">
                            <span className="bg-indigo-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-lg">
                                <ShieldCheck size={10} /> Top Rated
                            </span>
                            <span className="bg-white/10 backdrop-blur-md text-white text-[9px] font-black px-3 py-1 rounded-full border border-white/20 uppercase tracking-widest">
                                Best Seller
                            </span>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-black text-white leading-[0.85] tracking-tighter">
                                Expert <br /> <span className="text-indigo-400">Deep</span> <br /> Cleaning
                            </h2>
                            <button className="flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-400 transition-all active:scale-95 shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
                                Book Now <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. AC SERVICE CARD (Animated interaction) */}
                <div className="md:col-span-2 bg-gray-800/90 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group cursor-pointer shadow-[0_20px_50px_rgba(30,27,75,0.4)] border border-indigo-500/30 min-h-[260px]">

                    {/* 1. DYNAMIC BACKGROUND IMAGE - High Tech Blend */}
                    <img
                        src="https://res.cloudinary.com/dnz67rxu0/image/upload/v1772956240/oxvdwbx3iufe4yteyrmt.jpg"
                        className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[2s] mix-blend-overlay"
                        alt="AC Service"
                        loading='lazy'
                    />

                    {/* 2. MULTI-LAYERED GRADIENT OVERLAYS */}
                    {/* Deep Indigo base to keep it dark and sexy */}
                    <div className="absolute inset-0 bg-linear-to-br from-indigo-200/10 via-indigo-400/10 to-transparent z-0" />

                    {/* Animated Airflow Shimmer */}
                    <div className="absolute inset-0 opacity-30 group-hover:opacity-60 transition-opacity duration-700 z-10">
                        <div className="absolute top-0 left-[-100%] w-[200%] h-full bg-[linear-gradient(110deg,transparent_35%,rgba(103,232,249,0.2)_50%,transparent_65%)] animate-[shimmer_5s_infinite] skew-x-[-20deg]" />
                    </div>

                    {/* 3. TOP CONTENT - Improved Hierarchy */}
                    <div className="relative z-20 flex justify-between items-start">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 bg-indigo-500/20 backdrop-blur-xl border border-indigo-400/30 px-3 py-1.5 rounded-full shadow-inner">
                                <div className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-300 shadow-[0_0_10px_#67e8f9]"></span>
                                </div>
                                <span className="text-[10px] font-black text-cyan-100 uppercase tracking-[0.2em]">Active Now</span>
                            </div>

                            <h3 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter leading-[0.8] drop-shadow-2xl">
                                AC <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">REVIVE</span>
                            </h3>
                            <p className="text-blue-200 font-bold text-[10px] md:text-xs uppercase tracking-[0.4em] opacity-70 ml-1">
                                Pro Refresh 2026
                            </p>
                        </div>

                        {/* Zap Icon with "Energy Field" */}
                        <div className="relative">
                            <div className="absolute -inset-4 bg-cyan-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="w-16 h-16 bg-white/5 backdrop-blur-2xl rounded-[1.8rem] flex items-center justify-center text-white border border-white/20 rotate-12 group-hover:rotate-0 group-hover:scale-110 group-hover:bg-indigo-500/30 transition-all duration-500 shadow-2xl">
                                <Zap size={32} fill="currentColor" className="text-cyan-300 group-hover:text-white transition-colors" />
                            </div>
                        </div>
                    </div>

                    {/* 4. BOTTOM CONTENT - Glassmorphism Refresh */}
                    <div className="mt-14 flex flex-col md:flex-row items-end md:items-center justify-between relative z-20 gap-6">
                        <div className="flex items-center gap-4 bg-black/20 backdrop-blur-md p-2 rounded-2xl border border-white/5">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-800 bg-slate-800 overflow-hidden ring-2 ring-indigo-500/20 hover:scale-110 hover:z-30 transition-all">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="user" loading='lazy' />
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-indigo-800 bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white shadow-xl">
                                    +120
                                </div>
                            </div>
                            <p className="text-[9px] font-bold text-blue-100/80 uppercase tracking-widest leading-tight">
                                Verified <br /> Bookings
                            </p>
                        </div>

                        <div className="group-hover:translate-y-[-5px] transition-transform duration-500">
                            <div className="bg-gradient-to-br from-indigo-500/30 to-blue-600/10 backdrop-blur-2xl border border-white/10 p-4 rounded-[2rem] shadow-2xl">
                                <p className="text-white font-black text-3xl md:text-4xl tracking-tighter leading-none">
                                    UPTO <span className="text-cyan-300 drop-shadow-[0_0_15px_rgba(103,232,249,0.5)]">30%</span> OFF
                                </p>
                                <div className="flex items-center justify-end gap-2 mt-2">
                                    <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-cyan-500" />
                                    <p className="text-cyan-200/70 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                        <Clock size={12} className="animate-pulse" /> Final Slots
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Custom Animation Styles */}
                    <style>{`
        @keyframes shimmer {
            0% { transform: translateX(-100%) skewX(-20deg); }
            100% { transform: translateX(200%) skewX(-20deg); }
        }
    `}</style>
                </div>

                {/* 3. CHEF CARD */}
                <div className="md:col-span-1 bg-slate-200 rounded-[2.5rem] relative overflow-hidden group cursor-pointer shadow-xl border border-orange-100 min-h-[220px]">
                    {/* Optimized Cloudinary Image Background */}
                    <img
                        src="https://res.cloudinary.com/dnz67rxu0/image/upload/v1774159058/photo-1556910103-1c02745aae4d_j3cfk9.jpg"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        alt="Private Chef"
                        loading='lazy'
                    />

                    {/* Dark Overlay Gradient - Makes text "pop" regardless of image brightness */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent group-hover:from-orange-900/80 transition-colors duration-500"></div>

                    <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg text-white group-hover:bg-orange-500 group-hover:text-white transition-all border border-white/20">
                                <Star size={24} fill="currentColor" />
                            </div>
                            <div className="bg-orange-600 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest animate-pulse">
                                New
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="font-black text-white text-2xl tracking-tighter leading-tight group-hover:translate-x-1 transition-transform">
                                Private <br /> Chef
                            </h3>
                            <div className="flex items-center gap-1.5 mt-2 bg-black/30 w-fit px-2 py-1 rounded-lg backdrop-blur-sm border border-white/10">
                                <Clock size={12} className="text-orange-400" />
                                <p className="text-orange-400 text-[9px] font-black uppercase tracking-widest">
                                    Healthy & Fresh
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. PLUMBER CARD - BEAM INTEGRATION AREA */}
                <div ref={containerRef} className="md:col-span-1 bg-blue-50 rounded-[2.5rem] p-6 flex flex-col justify-between group cursor-pointer relative overflow-hidden transition-all duration-700 border border-blue-100 shadow-sm min-h-[220px]">

                    {/* --- BACKGROUND IMAGE (Optimized) --- */}
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUzVc7P6VgDrWcASNGbraUngW_UA83GBvmrQ&s"
                        className="absolute inset-0 w-full h-full object-cover opacity-90  group-hover:scale-110 transition-all duration-1000 ease-out"
                        alt="Plumbing Service"
                        loading='lazy'
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent group-hover:from-blue-80/20 transition-colors duration-500"></div>


                    {/* --- ANIMATED WATER RIPPLE (CSS-only Eye Candy) --- */}
                    <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl group-hover:bg-blue-500/30 group-hover:-translate-x-10 group-hover:-translate-y-10 transition-all duration-1000" />

                    {/* --- TOP ROW --- */}
                    <div className="flex justify-between items-start relative z-10">
                        <div ref={div1Ref} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 border border-blue-50">
                            <Calendar size={24} />
                        </div>
                        <div className="flex items-center gap-1.5 bg-blue-600 text-white text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg translate-y-[-4px] group-hover:translate-y-0 transition-transform">
                            <div className="w-1 h-1 bg-white rounded-full animate-ping" />
                            Active
                        </div>
                    </div>

                    {/* --- BOTTOM TEXT SECTION (Glassmorphism) --- */}
                    <div className="mt-6 relative z-10">
                        <div className="bg-white/40 backdrop-blur-md p-3 -m-3 rounded-[1.5rem] border border-white/20 inline-block w-full">
                            <h3 className="font-black text-slate-900 text-xl tracking-tighter leading-none transition-colors group-hover:text-blue-700">
                                Expert <br /> Plumber
                            </h3>
                            <div className="flex items-center gap-1 mt-2">
                                <CheckCircle2 size={12} className="text-blue-600 animate-bounce" />
                                <p className="text-blue-600 text-[9px] font-black uppercase tracking-widest">
                                    Instant Repair
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Added: Trust/Feature Bar (Mobile Optimized for w-360) */}

        </section>
    );
};

const TrustMarquee = () => {
    const items = [
        { label: "Vetted Pros", icon: <User size={20} /> },
        { label: "No Hidden Costs", icon: <ShieldCheck size={20} /> },
        { label: "Insured Work", icon: <Sparkles size={20} /> },
        { label: "Fast Booking", icon: <Zap size={20} /> },
        { label: "24/7 Support", icon: <CheckCircle2 size={20} /> },
    ];

    // We double the array to ensure a seamless loop
    const marqueeItems = [...items, ...items];

    return (
        <div className="mt-12 w-full overflow-hidden border-y border-slate-100 bg-slate-50/50 py-6">
            <div className="flex w-max animate-marquee-infinite">
                {marqueeItems.map((f, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-4 px-8 md:px-16 border-r border-slate-200 last:border-none"
                    >
                        <div className="text-indigo-600 bg-white p-2.5 rounded-xl shadow-sm ring-1 ring-slate-200">
                            {f.icon}
                        </div>
                        <span className="text-xs md:text-sm font-black text-slate-700 uppercase tracking-[0.15em] whitespace-nowrap">
                            {f.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* --- INJECTED CSS FOR ANIMATION --- */}
            <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-infinite {
          animation: marquee 25s linear infinite;
        }
        /* Pause on hover so people can read */
        .animate-marquee-infinite:hover {
          animation-play-state: paused;
        }
      `}</style>
        </div>
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
            <TrustMarquee/>
            <ProcessFlow />
        </div>
    );
};

export default HomePageExtraComponents;
