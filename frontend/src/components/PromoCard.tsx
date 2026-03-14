import { useState, useEffect, useRef } from 'react';
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

const PromoImage = ({ src, alt }: { src: string; alt: string }) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className="relative w-full min-h-55 sm:min-h-70 md:min-h-80 rounded-[2rem] overflow-hidden shadow-2xl ring-4 ring-white/20 transform-gpu transition-transform duration-700 group-hover:rotate-1">
            {!loaded && (
                <div className="absolute inset-0 bg-slate-200 animate-pulse" />
            )}
            <img
                src={src}
                alt={alt}
                loading="eager"
                onLoad={() => setLoaded(true)}
                className={`w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-105 transform-gpu
                    ${loaded ? 'opacity-100' : 'opacity-0'}
                `}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60" />
        </div>
    );
};

const PromoCard: React.FC<PromoCardProps> = ({
    title,
    subtitle,
    btnText,
    image,
    bgColor,
    textColor = "text-slate-900",
    btnBg = "bg-slate-900"
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
            { threshold: 0.1 }
        );
        if (cardRef.current) observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div 
            ref={cardRef}
            className={`
                ${bgColor} w-full rounded-[2.5rem] overflow-hidden
                flex flex-col md:flex-row relative border border-white/10
                group transition-all duration-500 transform-gpu
                hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)]
            `}
        >
            {/* Optimized Decorative Orbs */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/30 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-black/5 rounded-full blur-[80px] pointer-events-none" />

            {/* ── Left: Content ── */}
            <div className={`flex-1 p-8 sm:p-12 md:p-14 lg:p-16 flex flex-col justify-center items-start z-10 transition-all duration-1000 transform-gpu ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                
                <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter mb-4 leading-[1.05] drop-shadow-sm ${textColor}`}>
                    {title}
                </h2>

                <p className={`text-base md:text-lg font-bold opacity-80 mb-8 md:mb-10 max-w-md leading-relaxed ${textColor}`}>
                    {subtitle}
                </p>

                <button className={`
                    ${btnBg} text-white
                    relative overflow-hidden
                    px-8 md:px-12 py-4 md:py-5
                    rounded-2xl font-black text-[11px] md:text-xs
                    uppercase tracking-[0.2em]
                    shadow-2xl transition-all duration-300
                    hover:-translate-y-1 hover:brightness-110 active:scale-95
                    flex items-center gap-3 group/btn
                `}>
                    <span className="relative z-10">{btnText}</span>
                    <ArrowRight
                        size={18}
                        className="relative z-10 group-hover/btn:translate-x-1.5 transition-transform duration-300"
                    />
                    {/* Glossy Button Shine */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>
            </div>

            {/* ── Right: Image ── */}
            <div className={`flex-1 p-6 sm:p-8 md:p-10 flex items-center justify-center transition-all duration-1000 delay-200 transform-gpu ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <div className="w-full max-w-[500px]">
                    <PromoImage src={image} alt={title} />
                </div>
            </div>

            <style>{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.1); }
                }
                .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

export default PromoCard;