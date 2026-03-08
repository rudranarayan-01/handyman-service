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
                relative h-44 sm:h-52
                rounded-2xl md:rounded-3xl overflow-hidden flex
                group/card cursor-pointer
                transition-all duration-300
                active:scale-[0.98]
                transform-gpu promo-btn
            `}
        >
            {!loaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse z-20" />
            )}

            {/* Left: Content */}
            <div className={`
                relative z-10 w-[60%]
                p-4 sm:p-6
                flex flex-col justify-between
                ${offer.textColor}
            `}>
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-full border border-white/30">
                        <Tag size={10} />
                        <span className="text-[9px] font-black uppercase tracking-wider leading-none">
                            {offer.desc}
                        </span>
                    </div>

                    <h3 className="text-sm sm:text-lg font-black text-gray-900 leading-tight tracking-tight line-clamp-2">
                        {offer.title}
                    </h3>
                </div>

                <button className="bg-white/90 hover:bg-white text-black font-bold text-[10px] uppercase px-4 py-2 rounded-xl flex items-center gap-1.5 w-fit transition-all shadow-sm">
                    {offer.btnText}
                    <ArrowRight size={12} />
                </button>
            </div>

            {/* Right: Image */}
            <div className="absolute right-0 top-0 h-full w-[50%] pointer-events-none">
                <img
                    src={offer.image}
                    alt={offer.title}
                    loading="eager"
                    onLoad={() => setLoaded(true)}
                    className={`
                        h-full w-full object-cover
                        transition-opacity duration-500
                        ${loaded ? 'opacity-100' : 'opacity-0'}
                    `}
                    style={{
                        WebkitMaskImage: 'linear-gradient(to left, black 65%, transparent 100%)',
                        maskImage: 'linear-gradient(to left, black 65%, transparent 100%)'
                    }}
                />
            </div>
        </div>
    );
};

const OfferSection = () => {
    return (
        <section className="py-10 md:py-14 px-4 md:px-6 max-w-7xl mx-auto overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Percent size={14} className="text-blue-600" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                            Exclusive Deals
                        </p>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                        Offers & Discounts
                    </h2>
                </div>
            </div>

            {/* Carousel with Forced Visible Buttons */}
            <div className="relative px-2"> 
                <Carousel
                    opts={{ 
                        align: "start", 
                        loop: true,
                        dragFree: true 
                    }}
                    className="w-full relative"
                >
                    <CarouselContent className="-ml-3">
                        {offers.map((offer, index) => (
                            <CarouselItem
                                key={index}
                                className="pl-3 basis-[88%] sm:basis-[50%] lg:basis-[33.33%]"
                            >
                                <OfferCard offer={offer} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Navigation Buttons - Forced Visible & Accessible */}
                    <div className="flex justify-between items-center">
                        <CarouselPrevious 
                            className="
                                static translate-y-0 mt-4 h-10 w-10 
                                md:absolute md:-left-6 md:top-1/2 md:-translate-y-1/2 md:mt-0
                                flex items-center justify-center 
                                bg-white shadow-lg border-gray-100 text-gray-900 
                                hover:bg-gray-900 hover:text-white
                                z-40 transition-all opacity-100
                            " 
                        />
                        
                        {/* Mobile indicator shown between buttons on small screens */}
                        <div className="flex gap-1 md:hidden mt-4">
                            {[0, 1, 2].map((i) => (
                                <div key={i} className={`h-1.5 rounded-full ${i === 0 ? 'w-4 bg-blue-600' : 'w-1.5 bg-gray-200'}`} />
                            ))}
                        </div>

                        <CarouselNext 
                            className="
                                static translate-y-0 mt-4 h-10 w-10 
                                md:absolute md:-right-6 md:top-1/2 md:-translate-y-1/2 md:mt-0
                                flex items-center justify-center 
                                bg-white shadow-lg border-gray-100 text-gray-900 
                                hover:bg-gray-900 hover:text-white
                                z-40 transition-all opacity-100
                            " 
                        />
                    </div>
                </Carousel>
            </div>
        </section>
    );
};

export default OfferSection;