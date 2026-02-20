import React from 'react';
import { 
    ShieldCheck, Zap, Heart, 
    ArrowRight, Star, Clock, 
    Smartphone, Calendar, CheckCircle2 
} from 'lucide-react';



// --- 2. Bento Services Grid ---
const BentoServices: React.FC = () => {
    return (
        <section className="py-10 px-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-10 px-4">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight italic">Popular Categories</h2>
                    <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-xs">Everything you need for your home</p>
                </div>
                <button className="flex items-center gap-2 text-indigo-100 font-black text-sm group">
                    View All <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-auto md:h-[550px]">
                {/* Big Card */}
                <div className="md:col-span-2 md:row-span-2 bg-slate-900 rounded-[3rem] p-10 relative overflow-hidden group cursor-pointer shadow-xl">
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <span className="bg-indigo-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Most Booked</span>
                            <h2 className="text-4xl font-black text-white mt-6 leading-tight">Expert Home <br/> Cleaning</h2>
                        </div>
                        <button className="w-fit bg-white text-slate-900 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-colors">Book Now</button>
                    </div>
                    {/* Decorative Circle */}
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl group-hover:bg-indigo-600/40 transition-all duration-700"></div>
                </div>

                {/* Medium Card 1 */}
                <div className="md:col-span-2 bg-emerald-500 rounded-[3rem] p-10 relative overflow-hidden group cursor-pointer shadow-lg text-white">
                    <h2 className="text-3xl font-black italic">AC Repair</h2>
                    <p className="text-emerald-100 font-bold mt-2 uppercase tracking-[0.2em] text-[10px]">Summer Special • 20% OFF</p>
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20 group-hover:rotate-12 transition-transform duration-500">
                        <Zap size={100} strokeWidth={2.5} />
                    </div>
                </div>

                {/* Small Card 1 */}
                <div className="bg-orange-100 rounded-[3rem] p-8 flex flex-col justify-center items-center text-center group cursor-pointer hover:bg-orange-200 transition-colors">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm text-orange-600">
                        <Star size={24} fill="currentColor" />
                    </div>
                    <h3 className="font-black text-orange-900 text-lg">Cooking</h3>
                </div>

                {/* Small Card 2 */}
                <div className="bg-blue-100 rounded-[3rem] p-8 flex flex-col justify-center items-center text-center group cursor-pointer hover:bg-blue-200 transition-colors">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm text-blue-600">
                        <Calendar size={24} />
                    </div>
                    <h3 className="font-black text-blue-900 text-lg">Plumbing</h3>
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
            <BentoServices />
            <ProcessFlow />
            {/* <TrustStats /> */}
        </div>
    );
};

export default HomePageExtraComponents;