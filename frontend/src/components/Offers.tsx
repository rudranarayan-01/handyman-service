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

const OfferCard = ({ offer }: { offer: typeof offers[0] }) => {
    const [loaded, setLoaded] = useState(false);
    const navigate = useNavigate();

    const handleNavigate = () => {
        if (!offer.category) return;
        const slug = offer.category.toLowerCase().trim().replace(/[\s]+/g, '-');
        navigate(`/categories/${slug}`);
    };

    return (
        <div
            onClick={handleNavigate}
            className={`
                ${offer.bgColor}
                relative h-44 sm:h-48 md:h-52
                rounded-2xl md:rounded-3xl overflow-hidden flex
                group/card cursor-pointer transform-gpu
                transition-all duration-300
                hover:shadow-xl hover:-translate-y-1
                active:scale-95 will-change-transform
            `}
        >
            {!loaded && <div className="absolute inset-0 bg-gray-200 animate-pulse z-20" />}

            {/* Content */}
            <div className={`relative z-10 w-[60%] p-4 sm:p-6 flex flex-col justify-between ${offer.textColor}`}>
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-1 bg-black/10 px-2 py-1 rounded-full">
                        <Tag size={10} />
                        <span className="text-[9px] font-black uppercase tracking-wider">{offer.desc}</span>
                    </div>
                    <h3 className="text-sm sm:text-lg font-black text-black leading-tight line-clamp-2">
                        {offer.title}
                    </h3>
                </div>

                <button
                    onClick={(e) => { e.stopPropagation(); handleNavigate(); }}
                    className="bg-white/90 hover:bg-white text-black font-bold text-[10px] uppercase px-4 py-2 rounded-lg flex items-center gap-2 w-fit transition-colors"
                >
                    {offer.btnText}
                    <ArrowRight size={12} />
                </button>
            </div>

            {/* Image Section - Replaced Mask with Gradient Overlay for Performance */}
            <div className="absolute right-0 top-0 h-full w-[50%] z-0">
                <img
                    src={offer.image}
                    alt={offer.title}
                    onLoad={() => setLoaded(true)}
                    loading="eager"
                    className={`h-full w-full object-cover transition-opacity duration-500 transform-gpu group-hover/card:scale-105 transition-transform duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                />
                {/* Gradient Overlay (Cheaper than CSS Mask) */}
                <div className={`absolute inset-0 bg-gradient-to-r ${offer.bgColor.replace('bg-', 'from-')} via-transparent to-transparent w-full`} />
            </div>
        </div>
    );
};

const OfferSection = () => {
    return (
        <>
            <style>{`
                .offer-nav-btn {
                    display: none !important;
                }
                @media (min-width: 1024px) {
                    .group:hover .offer-nav-btn {
                        display: flex !important;
                    }
                }
                /* Smooth dragging for Embla Carousel */
                .embla__container {
                    touch-action: pan-y pinch-zoom;
                }
            `}</style>

            <section className="py-10 px-4 md:px-6 max-w-7xl mx-auto overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Percent size={14} className="text-blue-600" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Limited Time</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Offers & Discounts</h2>
                    </div>
                </div>

                <div className="relative group touch-pan-y">
                    <Carousel
                        opts={{ align: "start", loop: true, skipSnaps: false }}
                        className="w-full cursor-grab active:cursor-grabbing"
                    >
                        <CarouselContent className="-ml-3 md:-ml-4">
                            {offers.map((offer, index) => (
                                <CarouselItem
                                    key={index}
                                    className="pl-3 md:pl-4 basis-[85%] sm:basis-[48%] lg:basis-[33.33%]"
                                >
                                    <OfferCard offer={offer} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        {/* Desktop-only Hover Navigation */}
                        <CarouselPrevious className="offer-nav-btn absolute -left-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white shadow-lg border-none hover:bg-black hover:text-white transition-all z-30" />
                        <CarouselNext className="offer-nav-btn absolute -right-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white shadow-lg border-none hover:bg-black hover:text-white transition-all z-30" />
                    </Carousel>
                </div>

                {/* Mobile Indicators */}
                <div className="flex justify-center gap-2 mt-6 lg:hidden">
                    {offers.slice(0, 4).map((_, i) => (
                        <div key={i} className={`h-1.5 rounded-full ${i === 0 ? 'w-6 bg-blue-600' : 'w-1.5 bg-gray-200'}`} />
                    ))}
                </div>
            </section>
        </>
    );
};

export default OfferSection;