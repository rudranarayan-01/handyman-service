import { useState } from 'react';
import { offers } from '../data/Offers';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { useNavigate } from 'react-router-dom';

const OfferCard = ({ offer }: { offer: typeof offers[0] }) => {
    const [loaded, setLoaded] = useState(false);
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/categories/${offer.category.toLowerCase()}`)}
            className={`
                ${offer.bgColor}
                relative h-48 rounded-3xl overflow-hidden flex
                group/card cursor-pointer transform-gpu transition-transform active:scale-95
            `}
        >
            {/* Glass Content Area */}
            <div className="relative z-10 w-[65%] p-5 flex flex-col justify-between">
                <div className="space-y-2">
                    <span className="bg-black/10 text-[9px] font-bold px-2 py-1 rounded-lg w-fit uppercase tracking-tighter">
                        {offer.desc}
                    </span>
                    <h3 className="text-lg font-black leading-tight text-gray-900">
                        {offer.title}
                    </h3>
                </div>
                <button className="bg-white text-black text-[10px] font-bold px-4 py-2 rounded-xl w-fit shadow-sm">
                    Explore Now
                </button>
            </div>

            {/* Optimized Image with better masking */}
            <div className="absolute right-0 top-0 h-full w-[50%] pointer-events-none">
                <img
                    src={offer.image}
                    onLoad={() => setLoaded(true)}
                    className={`h-full w-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                    style={{
                        WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)'
                    }}
                />
            </div>
        </div>
    );
};

const OfferSection = () => {
    return (
        <section className="py-10 md:py-14 px-4 md:px-6 max-w-7xl mx-auto overflow-hidden">
            {/* Header ... */}
            
            <div className="relative group/carousel">
                <Carousel
                    opts={{ 
                        align: "start", 
                        loop: true,
                        skipSnaps: false,
                        dragFree: true, // This enables the "flick" dragging you see on mobile apps
                    }}
                    // 'touch-pan-y' allows vertical scrolling while preventing horizontal 'stuck' dragging
                    className="w-full touch-pan-y cursor-grab active:cursor-grabbing"
                >
                    <CarouselContent className="-ml-3 md:-ml-4">
                        {offers.map((offer, index) => (
                            <CarouselItem
                                key={index}
                                className="pl-3 md:pl-4 basis-[88%] sm:basis-[50%] lg:basis-[33.33%]"
                            >
                                <OfferCard offer={offer} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Navigation: Hidden on Mobile, Visible on Hover for Desktop */}
                    <div className="hidden md:block">
                        <CarouselPrevious className="absolute -left-5 top-1/2 -translate-y-1/2 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 bg-white shadow-xl border-none h-12 w-12" />
                        <CarouselNext className="absolute -right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 bg-white shadow-xl border-none h-12 w-12" />
                    </div>
                </Carousel>

                {/* Mobile-Only Drag Indicator (Dots) */}
                <div className="flex justify-center gap-2 mt-6 md:hidden">
                    {offers.slice(0, 4).map((_, i) => (
                        <div key={i} className={`h-1.5 rounded-full bg-blue-600 ${i === 0 ? 'w-6' : 'w-1.5 opacity-20'}`} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OfferSection;