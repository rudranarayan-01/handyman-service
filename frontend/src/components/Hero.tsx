import { useState } from "react";
import { categories, getHeroOptimizedUrl } from "@/data/HeroDisplayCategories";
import { Link } from "react-router-dom";
import HeroSearch from "./HeroSearch";
import { ArrowRight } from "lucide-react";

const CategoryCard = ({ cat }: { cat: typeof categories[0] }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    return (
        <Link
            to={`/services/${cat.slug}`}
            className="group flex flex-col items-center cursor-pointer transform-gpu"
        >
            <div className="relative rounded-2xl w-full aspect-square mb-3 overflow-hidden shadow-md bg-white border border-slate-100 transition-all duration-300 group-hover:shadow-xl group-hover:border-blue-100">

                {/* Skeleton Loader - Shown until image is ready */}
                {!loaded && !error && (
                    <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center gap-2">
                        <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-blue-500 animate-spin" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Loading...</span>
                    </div>
                )}

                {/* Fallback if URL is wrong */}
                {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-50 text-[10px] font-bold text-slate-300 uppercase">
                        404
                    </div>
                )}

                <img
                    src={getHeroOptimizedUrl(cat.image)}
                    alt={cat.name}
                    loading="eager"
                    decoding="async"
                    onLoad={() => setLoaded(true)}
                    onError={() => setError(true)}
                    className={`w-full h-full object-cover transition-all duration-700 
                        ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}
                        group-hover:scale-110 transform-gpu
                    `}
                />

                {/* subtle dark gradient at bottom for text contrast */}
                <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <span className="text-[11px] md:text-[13px] font-black text-slate-700 text-center leading-tight uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                {cat.name}
            </span>
        </Link>
    );
};

const HeroSection = () => {
    return (
        <>
            <style>{`
                .gpu-render { transform: translateZ(0); backface-visibility: hidden; }
                
                @keyframes simpleFadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-hero-fade { animation: simpleFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

                @keyframes glowOpacity {
                    0%, 100% { opacity: 0.8; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.02); }
                }
                .glow-pulse { animation: glowOpacity 2.5s ease-in-out infinite; }
                @keyframes shimmerPromo {
                    0%   { background-position: -600px 0; }
                    100% { background-position: 600px 0; }
                }
                .shimmer-promo {
                    background: linear-gradient(90deg, #e8e8e8 25%, #d8d8d8 50%, #e8e8e8 75%);
                    background-size: 600px 100%;
                    animation: shimmerPromo 1.5s ease-in-out infinite;
                }

                @keyframes promoFadeUp {
                    from { opacity: 0; transform: translateY(18px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .promo-fade-1 { animation: promoFadeUp 0.5s ease forwards 0.1s; opacity: 0; }
                .promo-fade-2 { animation: promoFadeUp 0.5s ease forwards 0.25s; opacity: 0; }
                .promo-fade-3 { animation: promoFadeUp 0.5s ease forwards 0.4s; opacity: 0; }
                .promo-fade-4 { animation: promoFadeUp 0.5s ease forwards 0.55s; opacity: 0; }

                @keyframes promoOrb {
                    0%, 100% { transform: scale(1); opacity: 0.25; }
                    50%       { transform: scale(1.3); opacity: 0.4; }
                }
                .promo-orb { animation: promoOrb 5s ease-in-out infinite; }

                @keyframes promoBtnShimmer {
                    0%   { transform: translateX(-100%) skewX(-15deg); }
                    100% { transform: translateX(250%) skewX(-15deg); }
                }
                .promo-btn {
                    transition: all 0.3s ease;
                }
                .promo-btn:hover {
                    transform: translateY(-2px);
                    filter: brightness(1.15);
                    box-shadow: 0 12px 35px rgba(0,0,0,0.25);
                }
                .promo-btn:active { transform: scale(0.96); }
                .promo-btn::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    width: 35%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
                    animation: promoBtnShimmer 2.5s ease-in-out infinite;
                }
            `}</style>

            <section className="relative pt-10 md:pt-28 lg:pt-26 md:pb-20 px-4 md:px-6 bg-[#f9fafb] overflow-hidden min-h-screen gpu-render">

                {/* Background Decorative - Using Cloudinary for background patterns if needed */}
                <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-gradient-to-l from-blue-50/60 to-transparent pointer-events-none" />
                <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-400/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-[radial-gradient(circle,rgba(34,211,238,0.15)_0%,transparent_70%)] pointer-events-none" />

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">

                    {/* Left Content */}
                    <div className="flex flex-col space-y-8 md:space-y-10 animate-hero-fade">
                        <div className="space-y-4 md:space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50/80 backdrop-blur-sm border border-blue-100 rounded-full w-fit">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Trusted by Millions</span>
                            </div>

                            <h1 className="text-[2.6rem] sm:text-7xl lg:text-7xl font-black text-slate-900 leading-[0.95] sm:leading-[0.85] tracking-[-0.04em] sm:tracking-[-0.06em] uppercase">
                                Services at Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 italic inline-block py-1">
                                    Doorstep,
                                </span>
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                                    Instantly
                                </span>
                            </h1>

                            <p className="text-base md:text-xl text-slate-500 font-medium max-w-md leading-relaxed border-l-4 border-blue-500/20 pl-4">
                                Professional doorstep comfort delivered <span className="text-slate-900 font-bold">instantly</span> for every home need.
                            </p>
                        </div>

                        <HeroSearch />

                        <div className="flex flex-wrap gap-3">
                            {['Trusted Professionals', 'No Hidden Fees', '24/7 Support'].map((tag) => (
                                <div key={tag} className="px-4 py-2 bg-white/50 backdrop-blur-md border border-slate-200 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 shadow-sm hover:border-blue-200 transition-colors">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                    {tag}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Grid Content */}
                    <div className="animate-hero-fade [animation-delay:200ms]">
                        <div className="grid grid-cols-3 gap-3 md:gap-6">
                            {categories.map((cat) => (
                                <CategoryCard key={cat.name} cat={cat} />
                            ))}
                        </div>

                        {/* Emergency / CTA Bar */}
                        <div className="mt-8 p-5 md:p-6 bg-slate-900 rounded-[2.5rem] flex flex-col sm:flex-row items-center justify-between gap-4 text-white shadow-2xl transform-gpu border border-white/5 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-linear-to-r from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="flex flex-col items-center sm:items-start text-center sm:text-left relative z-10">
                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-1">Emergency</span>
                                <span className="text-base md:text-xl font-black leading-tight uppercase">Secure & Easy Booking</span>
                            </div>

                            <Link to="/categories" className="relative z-10 w-full sm:w-auto">
                                <button className="
                                    promo-btn
                        text-white bg-blue-900
                            relative overflow-hidden
                            px-8 md:px-10 py-3.5 md:py-4
                            rounded-xl md:rounded-2xl
                            font-black text-xs md:text-sm
                            uppercase tracking-widest
                            shadow-xl shadow-black/10
                            flex items-center gap-3
                            group/btn
                                ">
                                    Explore All
                                    <ArrowRight size={18} />
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HeroSection;
