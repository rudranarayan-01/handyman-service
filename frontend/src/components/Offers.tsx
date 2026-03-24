import { useState, useEffect } from 'react';
import { offers } from '../data/Offers';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"; // Optional: npm install embla-carousel-autoplay
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
                relative h-48 sm:h-56
                rounded-[2rem] overflow-hidden flex
                group/card cursor-pointer
                transition-transform duration-500 hover:scale-[1.01]
                active:scale-95
            `}
        >
            {!loaded && <div className="absolute inset-0 bg-slate-200 animate-pulse z-20" />}

            {/* Content Area */}
            <div className={`
                relative z-10 w-[65%] p-5 sm:p-7
                flex flex-col justify-between
                ${offer.textColor}
            `}>
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-1.5 bg-white/30 backdrop-blur-xl px-3 py-1 rounded-full border border-white/40 shadow-sm">
                        <Tag size={12} className="opacity-80 text-blue-700" />
                        <span className="text-[10px] text-blue-700 font-bold uppercase tracking-widest leading-none">
                            {offer.desc}
                        </span>
                    </div>

                    <h3 className="text-lg sm:text-2xl font-black text-slate-900 leading-[1.1] tracking-tight line-clamp-2">
                        {offer.title}
                    </h3>
                </div>

                <button className="bg-slate-900 hover:bg-black text-white font-black text-[10px] uppercase tracking-widest px-5 py-3 rounded-2xl flex items-center gap-2 w-fit transition-all shadow-xl shadow-black/10">
                    {offer.btnText}
                    <ArrowRight size={14} />
                </button>
            </div>

            {/* Image Area */}
            <div className="absolute right-0 top-0 h-full w-[55%] pointer-events-none select-none">
                <img
                    src={offer.image}
                    alt={offer.title}
                    loading='eager'
                    onLoad={() => setLoaded(true)}
                    className={`
                        h-full w-full object-cover transition-all duration-700
                        ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}
                    `}
                    style={{
                        WebkitMaskImage: 'linear-gradient(to left, black 70%, transparent 100%)',
                        maskImage: 'linear-gradient(to left, black 70%, transparent 100%)'
                    }}
                />
            </div>
        </div>
    );
};

const OfferSection = () => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!api) return;
        setCurrent(api.selectedScrollSnap());
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    return (
        <section className="py-12 px-4 md:px-6 max-w-[1440px] mx-auto overflow-hidden">
            <div className="flex items-end justify-between mb-8">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="h-5 w-5 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Percent size={12} className="text-blue-600" />
                        </div>
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600">
                            Specials
                        </p>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter italic uppercase">
                        Mega Deals
                    </h2>
                </div>
            </div>

            <div className="relative">
                <Carousel
                    setApi={setApi}
                    plugins={[
                        Autoplay({
                            delay: 4000,
                        }),
                    ]}
                    opts={{
                        align: "start",
                        loop: true,
                        skipSnaps: false, // Ensures better swipe locking
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4">
                        {offers.map((offer, index) => (
                            <CarouselItem
                                key={index}
                                className="pl-4 basis-[92%] sm:basis-[50%] lg:basis-[33.33%]"
                            >
                                <OfferCard offer={offer} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Navigation - Hidden on mobile, visible on Desktop */}
                    <div className="hidden md:block">
                        <CarouselPrevious className="-left-6 h-12 w-12 border-none bg-white shadow-2xl text-black hover:bg-blue-600 hover:text-white transition-all" />
                        <CarouselNext className="-right-6 h-12 w-12 border-none bg-white shadow-2xl text-black hover:bg-blue-600 hover:text-white transition-all" />
                    </div>

                    {/* Mobile Progress Indicator */}
                    <div className="flex justify-center gap-2 mt-8 md:hidden">
                        {offers.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => api?.scrollTo(i)}
                                className={`transition-all duration-500 rounded-full h-1.5 
                                    ${current === i ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'}`}
                            />
                        ))}
                    </div>
                </Carousel>
            </div>
        </section>
    );
};

export default OfferSection;