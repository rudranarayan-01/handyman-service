import { useState } from "react";
import { categories } from "@/data/HeroDisplayCategories";
import { Link } from "react-router-dom";
import HeroSearch from "./HeroSearch";
import { ArrowRight } from "lucide-react";

const CategoryCard = ({ cat }: { cat: typeof categories[0] }) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className="group flex flex-col items-center cursor-pointer transform-gpu">
            <div className="relative rounded-2xl w-full aspect-square mb-3 overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300">
                {!loaded && (
                    <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-2xl" />
                )}
                <img
                    src={cat.image}
                    alt={cat.name}
                    loading="eager"
                    decoding="async" // Critical fix
                    onLoad={() => setLoaded(true)}
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 transform-gpu
                        ${loaded ? 'opacity-100' : 'opacity-0'}
                    `}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
            <span className="text-[12px] md:text-[13px] font-bold text-gray-700 text-center leading-tight">
                {cat.name}
            </span>
        </div>
    );
};

const HeroSection = () => {
    return (
        <>
            <style>{`
                .gpu-render { transform: translateZ(0); backface-visibility: hidden; }
                
                @keyframes simpleFadeUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-hero-fade { animation: simpleFadeUp 0.6s ease-out forwards; }

                @keyframes glowOpacity {
                    0%, 100% { opacity: 0.8; }
                    50% { opacity: 1; }
                }
                .glow-pulse { animation: glowOpacity 2s ease-in-out infinite; }
            `}</style>

            <section className="relative pt-20 md:pt-28 lg:pt-32 pb-12 md:pb-16 px-4 md:px-6 bg-[#f9fafb] overflow-hidden min-h-screen gpu-render">

                {/* Background Decorative - Optimized with Gradients instead of Blur */}
                <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-gradient-to-l from-blue-50/40 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-[radial-gradient(circle,rgba(34,211,238,0.15)_0%,transparent_70%)] pointer-events-none" />

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">

                    {/* Left Side */}
                    <div className="flex flex-col space-y-6 md:space-y-8 animate-hero-fade">
                        <div className="space-y-3 md:space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full mb-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Trusted by Millions</span>
                            </div>
                            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-[900] text-slate-900 leading-[0.9] tracking-[-0.05em] uppercase">
                                Services at Your <br />
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500 italic">
                                    Doorstep,
                                </span>
                                <br />
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-500 to-blue-600">
                                    Instantly
                                </span>
                            </h1>
                            <p className="text-base md:text-lg text-gray-500 font-medium max-w-md leading-relaxed">
                                Flawless doorstep comfort delivered instantly every time.
                            </p>
                        </div>

                        <HeroSearch />

                        <div className="flex flex-wrap gap-2 md:gap-3">
                            {['Trusted Professionals', 'No Hidden Fees', '24/7 Support'].map((tag) => (
                                <span key={tag} className="px-3 md:px-4 py-1.5 bg-white border border-gray-200 rounded-full text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-[0.1em] flex items-center gap-2 shadow-sm">
                                    <div className="w-1 h-1 rounded-full bg-blue-400" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Right Side - Grid */}
                    <div className="animate-hero-fade" style={{ animationDelay: '0.2s' }}>
                        <div className="grid grid-cols-3 gap-3 md:gap-4">
                            {categories.map((cat) => (
                                <CategoryCard key={cat.name} cat={cat} />
                            ))}
                        </div>

                        {/* Feature Card */}
                        <div className="mt-4 p-4 md:p-5 bg-gradient-to-r from-gray-900 to-black rounded-[24px] md:rounded-[32px] flex items-center justify-between px-5 md:px-8 text-white shadow-xl transform-gpu">
                            <div className="flex flex-col">
                                <span className="text-[9px] md:text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Emergency</span>
                                <span className="text-sm md:text-lg font-bold leading-tight">Secure & Easy Booking</span>
                            </div>

                            <Link to="/categories">
                                <button className="
                                    glow-pulse
                                    relative overflow-hidden
                                    bg-blue-600 hover:bg-blue-500
                                    text-white font-black
                                    text-sm md:text-base
                                    px-5 md:px-7 py-2.5 md:py-3
                                    rounded-xl md:rounded-2xl
                                    flex items-center gap-2
                                    transition-all duration-200
                                    border border-blue-400/40
                                    group
                                ">
                                    Explore
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
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