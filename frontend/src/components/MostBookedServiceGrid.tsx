import { useState, useEffect } from 'react';
import { Star, ArrowRight, Flame } from 'lucide-react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import api from '@/api/api';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

const ServiceSkeleton = () => (
    <div className="flex flex-col gap-3">
        <div className="aspect-[3/4] w-full rounded-2xl md:rounded-3xl bg-gray-200 animate-pulse" />
        <div className="space-y-2 px-1">
            <div className="h-3 w-3/4 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-3 w-1/2 bg-gray-200 rounded-full animate-pulse" />
        </div>
    </div>
);

const ServiceCard = ({ service }: { service: any }) => {
    const [loaded, setLoaded] = useState(false);
    const navigate = useNavigate();

    const handleClick = () => {
        if (!service.category) return;
        const slug = service.category.toLowerCase().trim().replace(/[\s]+/g, '-');
        navigate(`/categories/${slug}`);
    };

    return (
        <div
            onClick={handleClick}
            /* transform-gpu and will-change are vital here */
            className="cursor-pointer group/card flex flex-col transform-gpu will-change-transform"
        >
            <div className="relative aspect-[3/4] w-full rounded-2xl md:rounded-3xl overflow-hidden bg-gray-100 shadow-md">

                {!loaded && <div className="absolute inset-0 bg-gray-200 animate-pulse z-10" />}

                <img
                    src={service.image}
                    alt={service.name}
                    onLoad={() => setLoaded(true)}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                />

                {/* Simplified Gradient for better mobile FPS */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20">
                    <div className="flex items-center gap-1 bg-orange-500 px-2 py-1 rounded-lg">
                        <Flame size={10} className="text-white fill-white" />
                        <span className="text-[9px] font-black uppercase text-white tracking-wider">Hot</span>
                    </div>
                    {service.oldPrice && (
                        <div className="bg-green-600 px-2 py-1 rounded-lg">
                            <span className="text-[9px] font-black text-white">
                                {Math.round((1 - service.price / service.oldPrice) * 100)}% OFF
                            </span>
                        </div>
                    )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 z-20">
                    <h4 className="text-sm md:text-base font-bold text-white leading-tight line-clamp-2 mb-2">
                        {service.name}
                    </h4>

                    <div className="flex items-center gap-1.5 mb-3">
                        {/* Removed backdrop-blur-sm, replaced with solid semi-transparent color */}
                        <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 border-none" />
                            <span className="text-[11px] font-bold text-white">
                                {service.rating || '4.8'}
                            </span>
                        </div>
                        <span className="text-[10px] text-white/70 font-medium">({service.reviews || '1k'}+)</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-base md:text-lg font-black text-white">₹{service.price}</span>
                            {service.oldPrice && (
                                <span className="text-[11px] text-white/50 line-through">₹{service.oldPrice}</span>
                            )}
                        </div>

                        <Button size="sm" className="h-8 bg-white hover:text-white rounded-xl text-xs font-bold">
                            Book
                            <ArrowRight size={12} className="ml-1" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MostBookedServiceGrid = () => {
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTopServices = async () => {
            try {
                const res = await api.get('/services/top-booked/');
                setServices(res.data);
            } catch (error) {
                console.error("Error fetching top services:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTopServices();
    }, []);

    return (
        <section className="py-10 md:py-14 px-4 md:px-6 max-w-7xl mx-auto overflow-hidden">
            {/* Header section remains unchanged */}
            <div className="flex justify-between items-end mb-6 md:mb-8">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                        <Flame size={14} className="text-orange-500 fill-orange-500" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-orange-500">Trending Now</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Most Booked Services</h2>
                    <p className="text-xs md:text-sm text-gray-400 font-medium hidden sm:block">Trusted by thousands of customers this month</p>
                </div>
                <Button variant="outline"
                    onClick={() => navigate('/categories')}
                    className="flex items-center gap-1.5 text-[13px] font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 transition-colors group/all"
                >
                    <span className="hidden sm:inline">See All</span>
                    <ArrowRight size={14} className="group-hover/all:translate-x-1 transition-transform" />
                </Button>
            </div>

            <div className="relative">
                <Carousel
                    opts={{
                        align: "start",
                        dragFree: true,
                        containScroll: "trimSnaps"
                    }}
                    className="w-full touch-pan-y no-tap-highlight"
                >
                    <CarouselContent className="-ml-3 md:-ml-4 gpu-accelerate">
                        {loading
                            ? [...Array(4)].map((_, i) => (
                                <CarouselItem key={i} className="pl-3 md:pl-4 basis-[65%] sm:basis-[40%] md:basis-[28%] lg:basis-[22%] gpu-accelerate">
                                    <ServiceSkeleton />
                                </CarouselItem>
                            ))
                            : services.map((service) => (
                                <CarouselItem key={service._id} className="pl-3 md:pl-4 basis-[65%] sm:basis-[40%] md:basis-[28%] lg:basis-[22%] gpu-accelerate">
                                    <ServiceCard service={service} />
                                </CarouselItem>
                            ))
                        }
                    </CarouselContent>

                    {/* FIXED BUTTONS HERE */}
                    <CarouselPrevious className="flex -left-2 md:-left-4 h-8 w-8 md:h-10 md:w-10" />
                    <CarouselNext className="flex -right-2 md:-right-4 h-8 w-8 md:h-10 md:w-10" />
                </Carousel>
            </div>
        </section>
    );
};

export default MostBookedServiceGrid;