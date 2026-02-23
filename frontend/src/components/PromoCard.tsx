import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface PromoCardProps {
    title: string;
    subtitle: string;
    btnText: string;
    image: string;
    bgColor: string;
    textColor?: string;
    btnBg?: string;
}

// ── Image with skeleton loader ──
const PromoImage = ({ src, alt, btnBg }: { src: string; alt: string; btnBg: string }) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className="relative w-full min-h-[220px] sm:min-h-[280px] md:min-h-[320px] rounded-[2rem] overflow-hidden shadow-2xl ring-4 ring-white/20 group-hover:rotate-1 transition-transform duration-700">
            {/* Skeleton */}
            {!loaded && (
                <div className="absolute inset-0 shimmer-promo" />
            )}

            {/* Image */}
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

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </div>
    );
};

const PromoCard: React.FC<PromoCardProps> = ({
    title,
    subtitle,
    btnText,
    image,
    bgColor,
    textColor = "text-black",
    btnBg = "bg-[#5c4033]"
}) => {
    return (
        <>
            <style>{`
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

            <div className={`
                ${bgColor} w-full rounded-[2rem] md:rounded-[2.5rem] overflow-hidden
                flex flex-col md:flex-row
                relative border border-gray-100/50
                group transition-all duration-500
                hover:shadow-[0_30px_80px_-15px_rgba(0,0,0,0.15)]
            `}>

                {/* Decorative orbs */}
                <div className="promo-orb absolute top-8 left-8 w-36 h-36 bg-white/20 rounded-full blur-3xl pointer-events-none" />
                <div className="promo-orb absolute bottom-8 right-8 w-28 h-28 bg-white/15 rounded-full blur-2xl pointer-events-none" style={{ animationDelay: '2.5s' }} />

                {/* ── Left: Content ── */}
                <div className={`flex-1 p-7 sm:p-10 md:p-12 lg:p-14 flex flex-col justify-center items-start ${textColor} z-10`}>

                    <h2 className="promo-fade-1 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-3 leading-[1.1]">
                        {title}
                    </h2>

                    <p className="promo-fade-2 text-base md:text-lg font-medium opacity-75 mb-8 md:mb-10 max-w-md leading-relaxed">
                        {subtitle}
                    </p>

                    <div className="promo-fade-3">
                        <button className={`
                            promo-btn
                            ${btnBg} text-white
                            relative overflow-hidden
                            px-8 md:px-10 py-3.5 md:py-4
                            rounded-xl md:rounded-2xl
                            font-black text-xs md:text-sm
                            uppercase tracking-widest
                            shadow-xl shadow-black/10
                            flex items-center gap-3
                            group/btn
                        `}>
                            <span className="relative z-10">{btnText}</span>
                            <ArrowRight
                                size={16}
                                className="relative z-10 group-hover/btn:translate-x-1 transition-transform duration-200"
                            />
                        </button>
                    </div>
                </div>

                {/* ── Right: Image ── */}
                <div className="promo-fade-4 flex-1 p-5 sm:p-7 md:p-8 flex items-center justify-center">
                    <div className="w-full">
                        <PromoImage src={image} alt={title} btnBg={btnBg} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default PromoCard;