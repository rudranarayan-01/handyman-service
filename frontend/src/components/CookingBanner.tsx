import { useState } from 'react';
import { Utensils, Star, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CookingPromoProps {
    title?: string;
    subtitle?: string;
    btnText?: string;
    image?: string;
    bgColor?: string;
}

// ── Image with skeleton loader ──
const ChefImage = ({ src, alt }: { src: string; alt: string }) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className="relative w-full h-full min-h-[260px] md:min-h-[360px] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl">
            {/* Skeleton */}
            {!loaded && (
                <div className="absolute inset-0 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden">
                    <div className="w-full h-full shimmer-cooking" />
                </div>
            )}
            {/* Real image */}
            <img
                src={src}
                alt={alt}
                loading="eager"
                fetchPriority="high"
                onLoad={() => setLoaded(true)}
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110
                    ${loaded ? 'opacity-100' : 'opacity-0'}
                `}
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

            {/* Floating tag */}
            {loaded && (
                <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 bg-white/90 backdrop-blur-md p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/50 shadow-xl animate-float">
                    <p className="text-[11px] md:text-xs font-black text-slate-900">Today's Special</p>
                    <p className="text-[9px] md:text-[10px] font-bold text-orange-600">Home-style North Indian Thali</p>
                </div>
            )}
        </div>
    );
};

const CookingBanner: React.FC<CookingPromoProps> = ({
    title = "Professional Chefs at Your Doorstep",
    subtitle = "Experience restaurant-quality meals cooked right in your kitchen. Healthy, fresh, and customized to your taste.",
    btnText = "Book a Chef",
    image = "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800",
    bgColor = "bg-[#FFF9F2]"
}) => {
    return (
        <>
            <style>{`
                @keyframes shimmerCooking {
                    0%   { background-position: -600px 0; }
                    100% { background-position: 600px 0; }
                }
                .shimmer-cooking {
                    background: linear-gradient(90deg, #fef3e2 25%, #fde8c8 50%, #fef3e2 75%);
                    background-size: 600px 100%;
                    animation: shimmerCooking 1.5s ease-in-out infinite;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50%       { transform: translateY(-6px); }
                }
                .animate-float { animation: float 3s ease-in-out infinite; }

                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .fade-1 { animation: fadeSlideUp 0.5s ease forwards 0.1s; opacity: 0; }
                .fade-2 { animation: fadeSlideUp 0.5s ease forwards 0.25s; opacity: 0; }
                .fade-3 { animation: fadeSlideUp 0.5s ease forwards 0.4s; opacity: 0; }
                .fade-4 { animation: fadeSlideUp 0.5s ease forwards 0.55s; opacity: 0; }
                .fade-5 { animation: fadeSlideUp 0.5s ease forwards 0.7s; opacity: 0; }

                @keyframes orb {
                    0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.3; }
                    50%       { transform: scale(1.2) translate(10px, -10px); opacity: 0.5; }
                }
                .orb-animate { animation: orb 6s ease-in-out infinite; }

                @keyframes btnShimmer {
                    0%   { transform: translateX(-100%) skewX(-15deg); }
                    100% { transform: translateX(250%) skewX(-15deg); }
                }
                .btn-glow {
                    box-shadow: 0 8px 30px rgba(234,88,12,0.4);
                    transition: all 0.3s ease;
                }
                .btn-glow:hover {
                    box-shadow: 0 12px 40px rgba(234,88,12,0.65);
                    transform: translateY(-2px);
                }
                .btn-glow:active { transform: scale(0.96); }
                .btn-glow::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    width: 35%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                    animation: btnShimmer 2.5s ease-in-out infinite;
                }
            `}</style>

            <section className="py-8 md:py-12 px-4 md:px-6 max-w-7xl mx-auto">
                <div className={`
                    ${bgColor} w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden
                    flex flex-col md:flex-row-reverse
                    relative border border-orange-100/60
                    group transition-all duration-500
                    hover:shadow-[0_30px_80px_-15px_rgba(255,140,0,0.2)]
                `}>

                    {/* Decorative orbs */}
                    <div className="orb-animate absolute top-10 left-10 w-40 h-40 bg-orange-200/25 rounded-full blur-3xl pointer-events-none" />
                    <div className="orb-animate absolute bottom-10 right-10 w-32 h-32 bg-amber-200/25 rounded-full blur-2xl pointer-events-none" style={{ animationDelay: '3s' }} />

                    {/* ── Left (Content) ── */}
                    <div className="flex-1 p-7 sm:p-10 md:p-14 lg:p-16 flex flex-col justify-center items-start z-10">

                        {/* Badge */}
                        <div className="fade-1 flex items-center gap-2 bg-orange-100 text-orange-700 px-3 md:px-4 py-1.5 rounded-full mb-5 md:mb-6 w-fit">
                            <Utensils size={13} />
                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                                Home Cooking Service
                            </span>
                        </div>

                        {/* Title */}
                        <h2 className="fade-2 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-3 md:mb-4 leading-[1.1] text-slate-900">
                            {title.split(' ').map((word, i) => (
                                <span key={`${word}-${i}`} className={word === "Chefs" ? "text-orange-600" : ""}>
                                    {word}{' '}
                                </span>
                            ))}
                        </h2>

                        {/* Subtitle */}
                        <p className="fade-3 text-base md:text-lg font-medium text-slate-500 mb-7 md:mb-10 max-w-lg leading-relaxed">
                            {subtitle}
                        </p>

                        {/* Stats */}
                        <div className="fade-4 flex items-center gap-5 md:gap-6 mb-7 md:mb-10">
                            <div className="flex flex-col items-center">
                                <span className="text-xl md:text-2xl font-black text-slate-900">4.9</span>
                                <div className="flex text-orange-400 my-0.5">
                                    {[...Array(3)].map((_, i) => (
                                        <Star key={i} size={11} fill="currentColor" />
                                    ))}
                                </div>
                                <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mt-0.5">Rating</span>
                            </div>

                            <div className="w-px h-10 bg-slate-200" />

                            <div className="flex flex-col items-center">
                                <span className="text-xl md:text-2xl font-black text-slate-900">60m</span>
                                <Clock size={14} className="text-orange-600 my-0.5" />
                                <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mt-0.5">Avg Time</span>
                            </div>

                            <div className="w-px h-10 bg-slate-200" />

                            <div className="flex flex-col items-center">
                                <span className="text-xl md:text-2xl font-black text-slate-900">50+</span>
                                <Utensils size={14} className="text-orange-600 my-0.5" />
                                <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mt-0.5">Dishes</span>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="fade-5">
                            <Link to="/cooking-service">
                                <button className="
                                btn-glow
                                relative overflow-hidden
                                bg-orange-600 hover:bg-orange-500
                                text-white font-black
                                text-xs md:text-sm
                                uppercase tracking-widest
                                px-8 md:px-12 py-4 md:py-5
                                rounded-xl md:rounded-2xl
                                flex items-center gap-3
                                group/btn
                                ">
                                    <span className="relative z-10">{btnText}</span>
                                    <ArrowRight
                                        size={16}
                                        className="relative z-10 group-hover/btn:translate-x-1 transition-transform duration-200"
                                    />
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* ── Right (Image) ── */}
                    <div className="flex-1 p-5 sm:p-8 md:p-10 lg:p-12 flex items-center justify-center">
                        <div className="w-full transition-transform duration-700 group-hover:rotate-1">
                            <ChefImage src={image} alt="Cooking Service" />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default CookingBanner;