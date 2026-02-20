import React from 'react';
import { Utensils, Star, Clock } from 'lucide-react';

// 1. Types for Cooking Promo Card
interface CookingPromoProps {
    title?: string;
    subtitle?: string;
    btnText?: string;
    image?: string;
    bgColor?: string;
}

const CookingBanner: React.FC<CookingPromoProps> = ({
    title = "Professional Chefs at Your Doorstep",
    subtitle = "Experience restaurant-quality meals cooked right in your kitchen. Healthy, fresh, and customized to your taste.",
    btnText = "Book a Chef",
    image = "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800", // Default Cooking Image
    bgColor = "bg-[#FFF9F2]" // Warm Creamy Background
}) => {
    return (
        <section className="py-12 px-6 max-w-7xl mx-auto">

            <div className={`${bgColor} w-full rounded-[3rem] overflow-hidden flex flex-col md:flex-row-reverse min-h-112.5 relative border border-orange-100/50 group transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(255,165,0,0.15)]`}>

                {/* Left Section (Now Right): Content */}
                <div className="flex-1 p-10 md:p-16 flex flex-col justify-center items-start z-10">
                    {/* Badge */}
                    <div className="flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full mb-6 animate-bounce">
                        <Utensils size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Home Cooking Service</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4 leading-[1.1] text-slate-900">
                        {title.split(' ').map((word, i) => (
                            <span key={i} className={word === "Chefs" ? "text-orange-600" : ""}>{word} </span>
                        ))}
                    </h2>

                    <p className="text-lg md:text-xl font-medium text-slate-600 mb-10 max-w-lg">
                        {subtitle}
                    </p>

                    {/* Interactive Feature List */}
                    <div className="flex gap-6 mb-10">
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-black text-slate-900">4.9</span>
                            <div className="flex text-orange-400"><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /></div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">Rating</span>
                        </div>
                        <div className="w-[1px] h-10 bg-slate-200 self-center"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-black text-slate-900">60m</span>
                            <Clock size={16} className="text-orange-600" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">Avg Time</span>
                        </div>
                    </div>

                    <button className="bg-orange-600 text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-orange-700 hover:-translate-y-1 active:scale-95 transition-all shadow-2xl shadow-orange-200 flex items-center gap-3">
                        {btnText}
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </button>
                </div>

                {/* Right Section (Now Left): Interactive Image Area */}
                <div className="flex-1 p-6 md:p-12 flex items-center justify-center relative">
                    {/* Decorative Elements */}
                    <div className="absolute top-20 left-20 w-32 h-32 bg-orange-200/30 rounded-full blur-3xl group-hover:bg-orange-300/40 transition-colors"></div>

                    <div className="relative w-full h-full max-h-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl ring-12 ring-white transition-transform duration-700 group-hover:rotate-1">
                        <img
                            src={image}
                            alt="Cooking Service"
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                        />

                        {/* Floating Info Tag on Image */}
                        <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-xl hidden md:block animate-in fade-in slide-in-from-left-4 duration-1000">
                            <p className="text-xs font-black text-slate-900">Today's Special</p>
                            <p className="text-[10px] font-bold text-orange-600">Home-style North Indian Thali</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CookingBanner;