import { useState } from 'react';
import { offers } from '../data/Offers';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { ArrowRight, Tag, Percent } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ── Single Offer Card ──
const OfferCard = ({ offer }: { offer: typeof offers[0] }) => {
    const [loaded, setLoaded] = useState(false);
    const navigate = useNavigate();

    const handleNavigate = () => {
        if (!offer.category) return;
        const slug = offer.category
            .toLowerCase()
            .trim()
            .replace(/[\s]+/g, '-')
            .replace(/-+/g, '-');
        navigate(`/categories/${slug}`);
    };

    return (
        <div
            onClick={handleNavigate}
            className={`
                ${offer.bgColor}
                relative h-44 sm:h-48 md:h-52
                rounded-2xl md:rounded-3xl overflow-hidden flex
                group/card cursor-pointer
                transition-all duration-500
                hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.1)]
                hover:-translate-y-1.5
                active:scale-[0.98]
            `}
        >
            {/* Skeleton overlay until image loads */}
            {!loaded && (
                <div className="absolute inset-0 shimmer-offer z-20 rounded-2xl md:rounded-3xl" />
            )}

            {/* Left: Content */}
            <div className={`
                relative z-10 w-[58%]
                p-4 sm:p-5 md:p-6
                flex flex-col justify-between
                ${offer.textColor}
            `}>
                <div className="space-y-2">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-1 bg-gray-300 text-red-700 backdrop-blur-sm px-2 py-1 rounded-full">
                        <Tag size={9} />
                        <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest leading-none">
                            {offer.desc}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-black leading-tight tracking-tight line-clamp-3">
                        {offer.title}
                    </h3>
                </div>

                {/* CTA */}
                <button
                    onClick={(e) => { e.stopPropagation(); handleNavigate(); }}
                    className="
        relative overflow-hidden
        bg-white/25 hover:bg-white/40
        backdrop-blur-sm
        text-black
        border border-white/40
        font-black
        text-[9px] uppercase tracking-wide
        px-3 py-1.5
        rounded-xl
        flex items-center gap-1.5 w-fit
        whitespace-nowrap
        transition-all duration-300
        group/btn
        mt-1
    "
                >
                    {offer.btnText}
                    <ArrowRight
                        size={10}
                        className="group-hover/btn:translate-x-0.5 transition-transform duration-200 shrink-0"
                    />
                </button>
            </div>

            {/* Right: Image */}
            <div className="absolute right-0 top-0 h-full w-[55%]">
                <img
                    src={offer.image}
                    alt={offer.title}
                    loading="eager"
                    fetchPriority="high"
                    onLoad={() => setLoaded(true)}
                    className={`
                        h-full w-full object-cover
                        transition-all duration-700
                        group-hover/card:scale-110
                        ${loaded ? 'opacity-100' : 'opacity-0'}
                    `}
                    style={{
                        maskImage: 'linear-gradient(to left, black 55%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to left, black 55%, transparent 100%)'
                    }}
                />
            </div>

            {/* Shine on hover */}
            <div className="
                absolute inset-0 z-10 pointer-events-none
                opacity-0 group-hover/card:opacity-100
                transition-opacity duration-500
                bg-gradient-to-br from-white/15 via-transparent to-transparent
            " />
        </div>
    );
};

const OfferSection = () => {
    return (
        <>
            <style>{`
                @keyframes shimmerOffer {
                    0%   { background-position: -600px 0; }
                    100% { background-position: 600px 0; }
                }
                .shimmer-offer {
                    background: linear-gradient(90deg, #f0f0f0 25%, #e4e4e4 50%, #f0f0f0 75%);
                    background-size: 600px 100%;
                    animation: shimmerOffer 1.5s ease-in-out infinite;
                }

                @keyframes offerFadeUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .offer-fade { animation: offerFadeUp 0.5s ease forwards; }

                .offer-nav-btn {
                    background: white !important;
                    border: 1.5px solid rgba(0,0,0,0.08) !important;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important;
                    color: #111827 !important;
                    transition: all 0.25s ease !important;
                }
                .offer-nav-btn:hover {
                    background: #111827 !important;
                    color: white !important;
                    transform: scale(1.08) !important;
                    box-shadow: 0 8px 28px rgba(0,0,0,0.18) !important;
                }
                .offer-nav-btn:disabled {
                    opacity: 0 !important;
                    pointer-events: none !important;
                }
            `}</style>

            <section className="py-10 md:py-14 px-4 md:px-6 max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex items-end justify-between mb-6 md:mb-8 offer-fade">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <Percent size={12} className="text-blue-600" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                                Limited Time
                            </p>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                            Offers & Discounts
                        </h2>
                    </div>
                </div>

                {/* Carousel */}
                <div className="relative group">
                    <Carousel
                        opts={{ align: "start", loop: true }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-3 md:-ml-4">
                            {offers.map((offer, index) => (
                                <CarouselItem
                                    key={`${offer.title}-${index}`}
                                    className="pl-3 md:pl-4 basis-[82%] sm:basis-[48%] lg:basis-[32%]"
                                >
                                    <OfferCard offer={offer} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        {/* ✅ Fixed — removed hidden hover:block */}
                        <CarouselPrevious className="offer-nav-btn absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 h-9 w-9 md:h-11 md:w-11 rounded-full z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        <CarouselNext className="offer-nav-btn absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 h-9 w-9 md:h-11 md:w-11 rounded-full z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </Carousel>
                </div>

                {/* Mobile dots */}
                <div className="flex justify-center gap-1.5 mt-5 sm:hidden">
                    {offers.slice(0, 4).map((_, i) => (
                        <div
                            key={i}
                            className={`rounded-full transition-all duration-300 ${i === 0
                                    ? 'w-5 h-1.5 bg-blue-600'
                                    : 'w-1.5 h-1.5 bg-gray-200'
                                }`}
                        />
                    ))}
                </div>
            </section>
        </>
    );
};

export default OfferSection;