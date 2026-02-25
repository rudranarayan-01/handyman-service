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
                hover:shadow-lg active:scale-[0.98]
            `}
        >
            {!loaded && <div className="absolute inset-0 bg-gray-100 animate-pulse z-20" />}

            {/* Content */}
            <div className={`relative z-10 w-[60%] p-4 sm:p-6 flex flex-col justify-between ${offer.textColor}`}>
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-1 bg-white/30 backdrop-blur-md px-2 py-1 rounded-full w-fit">
                        <Tag size={9} />
                        <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest">{offer.desc}</span>
                    </div>
                    <h3 className="text-sm sm:text-lg font-black text-slate-900 leading-tight line-clamp-2 italic">
                        {offer.title}
                    </h3>
                </div>

                <button className="bg-white/80 backdrop-blur-sm text-black border border-white/50 font-black text-[9px] uppercase px-3 py-2 rounded-xl flex items-center gap-1.5 w-fit group/btn transition-all">
                    {offer.btnText}
                    <ArrowRight size={10} className="group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
            </div>

            {/* Image Section */}
            <div className="absolute right-0 top-0 h-full w-[55%] pointer-events-none">
                <img
                    src={offer.image}
                    alt={offer.title}
                    loading="lazy"
                    decoding="async"
                    onLoad={() => setLoaded(true)}
                    className={`h-full w-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                    style={{
                        maskImage: 'linear-gradient(to left, black 60%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to left, black 60%, transparent 100%)'
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
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Percent size={14} className="text-blue-600" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">Limited Time</p>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Offers & Discounts</h2>
                </div>
            </div>

            {/* Carousel Container */}
            <div className="relative group/carousel">
                <Carousel
                    opts={{ 
                        align: "start", 
                        loop: true,
                        dragFree: true, // Allows smoother "flick" dragging
                    }}
                    className="w-full cursor-grab active:cursor-grabbing"
                >
                    <CarouselContent className="-ml-4">
                        {offers.map((offer, index) => (
                            <CarouselItem
                                key={index}
                                className="pl-4 basis-[85%] sm:basis-[50%] lg:basis-[33.33%]"
                            >
                                <OfferCard offer={offer} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Desktop Hover Navigation */}
                    <div className="hidden md:block">
                        <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 bg-white shadow-xl hover:bg-slate-900 hover:text-white border-none h-12 w-12" />
                        <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 bg-white shadow-xl hover:bg-slate-900 hover:text-white border-none h-12 w-12" />
                    </div>
                </Carousel>
            </div>
        </section>
    );
};

export default OfferSection;