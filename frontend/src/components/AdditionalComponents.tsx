import React from 'react';
import {
    ShieldCheck, Zap, 
    ArrowRight, Star, 
    Smartphone, Calendar, CheckCircle2,
    Sparkles
} from 'lucide-react';



// --- 2. Bento Services Grid ---


const AnimatedBento: React.FC = () => {
    return (
        <section className="py-12 px-6 max-w-6xl mx-auto bg-white">
            {/* Header - More Compact */}
            <div className="flex justify-between items-end mb-10 px-2">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-indigo-600">
                        <Sparkles size={16} className="animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Our Hub</span>
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">
                        Popular <span className="text-indigo-600">Categories</span>
                    </h2>
                </div>
                <button className="group flex items-center gap-2 bg-slate-100 text-slate-100 px-5 py-2.5 rounded-xl font-bold text-xs transition-all hover:bg-slate-900 hover:text-white active:scale-95">
                    View All
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Bento Grid - Reduced height for "smaller boxes" feel */}
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[500px]">

                {/* 1. Deep Cleaning (Big Card) */}
                <div className="md:col-span-2 md:row-span-2 bg-[#0f172a] rounded-[2.5rem] p-8 relative overflow-hidden group cursor-pointer shadow-xl border border-slate-200">
                    <img
                        src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=1000&auto=format&fit=crop"
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-all duration-1000"
                        alt="Cleaning"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/20 to-transparent"></div>

                    <div className="relative z-20 h-full flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <span className="bg-red/10 backdrop-blur-md text-white text-[9px] font-black px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest">Hot</span>
                                <span className="bg-indigo-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                                    <ShieldCheck size={10} /> Certified
                                </span>
                            </div>
                            <h2 className="text-4xl font-black text-gray-100 leading-tight">
                                Expert <br /> <span className="text-indigo-400">Deep</span> Cleaning
                            </h2>
                        </div>
                        <span className="w-fit bg-white text-slate-900 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-300 hover:text-black transition-all shadow-lg">Book Now</span>
                    </div>
                </div>

                {/* 2. AC Repair (Wide Card) */}
                <div className="md:col-span-2 mask-b-to-gray-600 rounded-[2.5rem] p-8 relative overflow-hidden group cursor-pointer shadow-lg border border-emerald-400/20">
                    <img
                        src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=1000&auto=format&fit=crop"
                        className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay group-hover:scale-105 transition-transform duration-700"
                        alt="AC"
                    />
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-black text-gray-950 italic tracking-tighter">AC Revive</h2>
                            <p className="text-gray-950 font-bold text-[10px] mt-1 uppercase tracking-widest">Upto 30% OFF</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl text-black">
                            <Zap size={20} />
                        </div>
                    </div>
                    <div className="mt-8 flex items-center gap-2">
                        <div className="h-1 w-6 bg-white rounded-full group-hover:w-12 transition-all"></div>
                        <span className="text-gray-900 font-black text-[10px] uppercase tracking-widest">Fast Track Service</span>
                    </div>
                </div>

                {/* 3. Cooking (Small Square) */}
                <div className="bg-[#fff7ed] rounded-[2.5rem] p-6 flex flex-col justify-between group cursor-pointer transition-all duration-500 hover:bg-orange-50 border border-orange-100 relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-orange-200/30 rounded-full blur-xl"></div>
                    <div className="flex justify-between items-start">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md group-hover:bg-orange-600 group-hover:text-white transition-all">
                            <Star size={18} fill="currentColor" />
                        </div>
                        <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=200&auto=format&fit=crop" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md group-hover:scale-110 transition-transform" alt="chef" />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-800 text-lg tracking-tighter leading-none">Home <br />Chef</h3>
                        <p className="text-orange-600 text-[9px] font-black uppercase mt-1">Healthy Meals</p>
                    </div>
                </div>

                {/* 4. Plumbing (Small Square) */}
                <div className="bg-[#eff6ff] rounded-[2.5rem] p-6 flex flex-col justify-between group cursor-pointer transition-all duration-500 hover:bg-blue-50 border border-blue-100 relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-blue-200/30 rounded-full blur-xl"></div>
                    <div className="flex justify-between items-start">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <Calendar size={18} />
                        </div>
                        {/* Little icon pattern to fill space */}
                        <div className="flex gap-0.5 opacity-20 group-hover:opacity-40 transition-opacity">
                            <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                            <div className="w-1 h-4 bg-blue-600 rounded-full mt-2"></div>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-black text-slate-800 text-lg tracking-tighter leading-none">Expert <br />Plumber</h3>
                        <p className="text-blue-600 text-[9px] font-black uppercase mt-1">Instant Repair</p>
                    </div>
                </div>

            </div>
        </section>
    );
};




// --- 3. Process Flow Component ---
const ProcessFlow: React.FC = () => {
    const steps = [
        { icon: Smartphone, title: "Select Service", desc: "Choose from 50+ services", color: "text-orange-500 bg-orange-50" },
        { icon: Calendar, title: "Pick a Slot", desc: "Schedule as per your ease", color: "text-indigo-500 bg-indigo-50" },
        { icon: CheckCircle2, title: "Pro Arrives", desc: "Service done at your door", color: "text-emerald-500 bg-emerald-50" }
    ];

    return (
        <section className="py-24 px-6 bg-white rounded-[4rem] my-10 max-w-7xl mx-auto shadow-[0_-20px_80px_rgba(0,0,0,0.02)]">
            <div className="text-center mb-20">
                <h2 className="text-4xl font-black text-slate-900 italic leading-none">Simple 3-Step Booking</h2>
                <div className="h-1.5 w-24 bg-indigo-600 mx-auto mt-6 rounded-full"></div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start gap-12 relative">
                {steps.map((item, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center text-center relative z-10 group">
                        <div className={`${item.color} w-24 h-24 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-xl shadow-slate-100 group-hover:-translate-y-2 transition-transform duration-500`}>
                            <item.icon size={36} strokeWidth={2.5} />
                        </div>
                        <h4 className="text-xl font-black text-slate-900 mb-3 tracking-tight">{item.title}</h4>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest px-10">{item.desc}</p>

                        {/* Desktop Connector Line */}
                        {i < 2 && (
                            <div className="hidden md:block absolute top-12 left-[70%] w-full h-[2px] bg-slate-100 -z-10 border-t-2 border-dashed border-slate-200"></div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

// --- Combined Export ---
const HomePageExtraComponents: React.FC = () => {
    return (
        <div className="space-y-10">
            <AnimatedBento />
            <ProcessFlow />
            {/* <TrustStats /> */}
        </div>
    );
};

export default HomePageExtraComponents;