import { useState, useEffect } from 'react';
import { Star, ArrowRight, ShoppingBag, ImageOff } from 'lucide-react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import api from '@/api/api';
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';

interface Service {
    _id: string;
    name: string;
    image: string;
    rating: number;
    reviews: number;
    price: number;
    category?: string; // This links back to the main category
}

const ServiceSkeletonCard = () => (
    <div className="flex flex-col gap-3">
        <div className="aspect-[4/5] w-full rounded-[2.2rem] bg-gray-100 animate-pulse" />
        <div className="space-y-2 px-1">
            <div className="h-3 w-full bg-gray-100 rounded-full animate-pulse" />
            <div className="h-3 w-1/3 bg-gray-100 rounded-full animate-pulse" />
        </div>
    </div>
);

const ServiceCard = ({ service }: { service: Service }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const navigate = useNavigate();

    // Logic to handle navigation to the specific category page
    const handleNav = () => {
        const categorySlug = (service.category || 'essential-appliance-care')
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-');
        navigate(`/categories/${categorySlug}`);
    };

    return (
        <div
            onClick={handleNav}
            className="group/card flex flex-col h-full cursor-pointer will-change-transform transform-gpu"
        >
            <div className="relative aspect-[4/5] w-full rounded-[2.2rem] overflow-hidden mb-3 bg-gray-50 border border-black/[0.03] shadow-sm">
                {service.image && !hasError ? (
                    <img
                        src={service.image}
                        alt={service.name}
                        loading="lazy"
                        onLoad={() => setIsLoaded(true)}
                        onError={() => setHasError(true)}
                        className={cn(
                            "w-full h-full object-cover transition-all duration-700 group-hover/card:scale-110",
                            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
                        )}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100">
                        <ImageOff className="text-slate-300" size={24} />
                    </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/card:opacity-100 transition-all duration-300 hidden md:flex items-center justify-center">
                    <Button
                        size="sm"
                        className="rounded-full bg-white text-black hover:bg-indigo-600 hover:text-white shadow-xl translate-y-4 group-hover/card:translate-y-0 transition-transform font-bold"
                    >
                        <ShoppingBag size={14} className="mr-2" />
                        View Detail
                    </Button>
                </div>

                <div className="absolute top-4 left-4">
                    <div className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 shadow-sm">
                        <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600">
                            {service.price < 500 ? 'Best Value' : 'Premium'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="px-2 space-y-1">
                <h4 className="text-[14px] font-bold text-gray-800 leading-tight line-clamp-1 group-hover/card:text-indigo-600 transition-colors">
                    {service.name}
                </h4>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        <span className="text-[12px] font-bold text-gray-600">{service.rating || '4.8'}</span>
                    </div>
                    <div className="flex items-baseline gap-0.5">
                        <span className="text-[10px] font-bold text-gray-500">₹</span>
                        <p className="text-[15px] font-black text-gray-900">{service.price}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ServiceCarousel = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                // Hits the endpoint we discussed that groups services under appliance care
                const { data } = await api.get('/services/category/essential-appliance-care');
                setServices(data);
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchServices();
    }, []);

    return (
        <section className="py-12 px-4 md:py-16 md:px-6 max-w-7xl mx-auto overflow-hidden">
            <div className="flex items-end justify-between mb-8 md:mb-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="h-[2px] w-8 bg-indigo-600 rounded-full" />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600">Fixed Prices</span>
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">Essential Appliance Care</h2>
                        <p className="text-gray-500 text-xs md:text-sm font-medium mt-1">
                            Simple solutions for your essential home devices.
                        </p>
                    </div>
                </div>

                <Button
                    variant="link"
                    className="text-gray-400 uppercase text-[10px] md:text-xs font-bold hover:no-underline group p-0"
                    onClick={() => navigate('/categories/appliance-repair')}
                >
                    Explore all
                    <ArrowRight size={16} className="ml-1 md:ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>

            <Carousel
                opts={{
                    align: "start",
                    dragFree: true,
                    loop: true
                }}
                className="w-full relative"
            >
                <CarouselContent className="-ml-4 md:-ml-6">
                    {isLoading
                        ? Array.from({ length: 5 }).map((_, i) => (
                            <CarouselItem key={i} className="pl-4 md:pl-6 basis-[70%] sm:basis-[40%] md:basis-[25%] lg:basis-[20%]">
                                <ServiceSkeletonCard />
                            </CarouselItem>
                        ))
                        : services.map((service) => (
                            <CarouselItem key={service._id} className="pl-4 md:pl-6 basis-[70%] sm:basis-[40%] md:basis-[25%] lg:basis-[20%]">
                                <ServiceCard service={service} />
                            </CarouselItem>
                        ))
                    }
                </CarouselContent>

                <div className="flex justify-between items-center mt-8 md:mt-0">
                    <CarouselPrevious className="static translate-y-0 h-10 w-10 md:absolute md:-left-5 md:top-1/2 md:-translate-y-1/2 bg-white shadow-md border-none hover:bg-indigo-600 hover:text-white transition-all" />
                    
                    {/* Progress Dots for Mobile */}
                    <div className="flex gap-1.5 md:hidden">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className={cn("h-1 rounded-full transition-all", i === 0 ? "w-6 bg-indigo-600" : "w-1.5 bg-gray-200")} />
                        ))}
                    </div>

                    <CarouselNext className="static translate-y-0 h-10 w-10 md:absolute md:-right-5 md:top-1/2 md:-translate-y-1/2 bg-white shadow-md border-none hover:bg-indigo-600 hover:text-white transition-all" />
                </div>
            </Carousel>
        </section>
    );
};

export default ServiceCarousel;