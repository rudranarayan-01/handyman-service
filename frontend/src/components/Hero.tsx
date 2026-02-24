import { useState } from "react";
import { categories } from "@/data/HeroDisplayCategories";
import { Link } from "react-router-dom";
import HeroSearch from "./HeroSearch";
import { ArrowRight } from "lucide-react";

// ── Skeleton for a single category card ──


// ── Single category card with blur-up loading ──
const CategoryCard = ({ cat }: { cat: typeof categories[0] }) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className="group flex flex-col items-center cursor-pointer">
            <div className="relative rounded-2xl w-full aspect-square mb-3 overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                {/* Shimmer shown until image loads */}
                {!loaded && (
                    <div className="absolute inset-0 shimmer-bg rounded-2xl" />
                )}
                <img
                    src={cat.image}
                    alt={cat.name}
                    loading="eager"
                    fetchPriority="high"
                    onLoad={() => setLoaded(true)}
                    className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110
                        ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
                    `}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                @keyframes skeletonShimmer {
                    0%   { background-position: -600px 0; }
                    100% { background-position: 600px 0; }
                }
                .shimmer-bg {
                    background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
                    background-size: 600px 100%;
                    animation: skeletonShimmer 1.5s ease-in-out infinite;
                }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .fade-up-1 { animation: fadeUp 0.5s ease forwards 0.1s; opacity: 0; }
                .fade-up-2 { animation: fadeUp 0.5s ease forwards 0.2s; opacity: 0; }
                .fade-up-3 { animation: fadeUp 0.5s ease forwards 0.3s; opacity: 0; }
                .fade-up-4 { animation: fadeUp 0.5s ease forwards 0.4s; opacity: 0; }

                @keyframes neonPulse {
                    0%, 100% { box-shadow: 0 0 10px rgba(59,130,246,0.5), 0 0 30px rgba(59,130,246,0.2); }
                    50%      { box-shadow: 0 0 20px rgba(59,130,246,0.8), 0 0 60px rgba(59,130,246,0.4); }
                }
                .neon-btn { animation: neonPulse 2s ease-in-out infinite; }

                @keyframes shimmerSlide {
                    0%   { transform: translateX(-100%) skewX(-15deg); }
                    100% { transform: translateX(200%) skewX(-15deg); }
                }
                .btn-shimmer::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    width: 40%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
                    animation: shimmerSlide 2.5s ease-in-out infinite;
                }
            `}</style>

            <section className="relative pt-20 md:pt-28 lg:pt-32 pb-12 md:pb-16 px-4 md:px-6 bg-[#f9fafb] overflow-hidden min-h-screen">

                {/* Background Decorative */}
                <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-linear-to-l from-blue-50/60 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-50/40 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">

                    {/* ── Left: Text & Search ── */}
                    <div className="flex flex-col space-y-6 md:space-y-8">

                        {/* Heading */}
                        <div className="space-y-3 md:space-y-4 fade-up-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full mb-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Trusted by Millions</span>
                            </div>
                            <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-6xl font-black text-gray-900 leading-[1.05] tracking-tighter uppercase">
                                Services at Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                                    Doorstep,
                                </span>
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                                    Instantly
                                </span>
                            </h1>
                            <p className="text-base md:text-lg text-gray-500 font-medium max-w-md leading-relaxed">
                                Flawless doorstep comfort delivered instantly every time.
                            </p>
                        </div>

                        {/* Search */}
                        <div className="fade-up-2">
                            <HeroSearch />
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 md:gap-3 fade-up-3">
                            {['Trusted Professionals', 'No Hidden Fees', '24/7 Support'].map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 md:px-4 py-1.5 md:py-2 bg-white border border-gray-200 rounded-full text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] flex items-center gap-2 shadow-sm hover:border-blue-200 hover:text-blue-600 transition-colors duration-200"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* ── Right: Service Grid ── */}
                    <div className="fade-up-4">
                        <div className="grid grid-cols-3 gap-3 md:gap-4">
                            {categories.map((cat) => (
                                <CategoryCard key={cat.name} cat={cat} />
                            ))}
                        </div>

                        {/* Feature Card */}
                        <div className="mt-4 p-4 md:p-5 bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-[24px] md:rounded-[32px] flex items-center justify-between px-5 md:px-8 text-white shadow-xl">
                            <div className="flex flex-col">
                                <span className="text-[9px] md:text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Emergency</span>
                                <span className="text-sm md:text-lg font-bold leading-tight">Secure & Easy Booking</span>
                            </div>

                            <Link to="/categories">
                                <button className="
                                    neon-btn btn-shimmer
                                    relative overflow-hidden
                                    bg-blue-600 hover:bg-blue-500
                                    text-white font-black
                                    text-sm md:text-base
                                    px-5 md:px-7 py-2.5 md:py-3
                                    rounded-xl md:rounded-2xl
                                    flex items-center gap-2
                                    hover:scale-105 active:scale-95
                                    transition-transform duration-200
                                    border border-blue-400/40
                                    group
                                ">
                                    Explore
                                    <ArrowRight
                                        size={16}
                                        className="group-hover:translate-x-1 transition-transform duration-200"
                                    />
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