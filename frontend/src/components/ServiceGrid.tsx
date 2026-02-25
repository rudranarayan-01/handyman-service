import { useState, useEffect } from 'react';
import { Star, ArrowRight, ShoppingBag } from 'lucide-react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
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
    category?: string;
}

const ServiceSkeletonCard = () => (
    <div className="flex flex-col gap-3">
        <div className="aspect-[4/5] w-full rounded-[2rem] bg-gray-100 animate-pulse" />
        <div className="space-y-2 px-1">
            <div className="h-3 w-full bg-gray-100 rounded-full animate-pulse" />
            <div className="h-3 w-1/3 bg-gray-100 rounded-full animate-pulse" />
        </div>
    </div>
);

const ServiceCard = ({ service }: { service: Service }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();

    const handleCategoryNav = () => {
        if (!service.category) return;
        const slug = service.category.toLowerCase().trim().replace(/\s+/g, '-');
        navigate(`/categories/${slug}`);
    };

    return (
        <div
            onClick={handleCategoryNav}
            className="group/card flex flex-col h-full cursor-pointer will-change-transform transform-gpu"
        >
            <div className="relative aspect-[4/5] w-full rounded-[2.2rem] overflow-hidden mb-3 bg-gray-50 border border-black/[0.03] shadow-sm">
                <img
                    src={service.image}
                    alt={service.name}
                    onLoad={() => setIsLoaded(true)}
                    className={cn(
                        "w-full h-full object-cover transition-all duration-700 group-hover/card:scale-110",
                        isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
                    )}
                />
                
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/card:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <Button 
                        size="sm" 
                        className="rounded-full bg-white text-black hover:bg-indigo-600 hover:text-white shadow-xl translate-y-4 group-hover/card:translate-y-0 transition-transform"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/categories/appliance-repair`);
                        }}
                    >
                        <ShoppingBag size={14} className="mr-2" />
                        Book Now
                    </Button>
                </div>

                <div className="absolute top-4 left-4">
                    <div className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 shadow-sm">
                        <span className="text-[10px] font-black uppercase tracking-tight text-indigo-600">Top Rated</span>
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
                    <p className="text-[14px] font-black text-gray-900">₹{service.price}</p>
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
                const { data } = await api.get('/services/appliance-repair');
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
        <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto overflow-hidden">
            <div className="flex items-end justify-between mb-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="h-[2px] w-8 bg-indigo-600 rounded-full" />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600">Premium Care</span>
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Appliance Repair</h2>
                        <p className="text-gray-500 text-sm md:text-base font-medium mt-1">
                            Expert fixes for your essential home devices, delivered at your doorstep.
                        </p>
                    </div>
                </div>

                <Button 
                    variant="link" 
                    className="text-gray-400 uppercase font-bold hover:no-underline group p-0"
                    onClick={() => navigate('/categories/appliance-repair')}
                >
                    Explore all 
                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>

            <Carousel 
                opts={{ 
                    align: "start", 
                    dragFree: true, 
                    containScroll: "trimSnaps" 
                }} 
                className="w-full touch-pan-y cursor-grab active:cursor-grabbing"
            >
                <CarouselContent className="-ml-4 md:-ml-6 will-change-transform">
                    {isLoading
                        ? Array.from({ length: 5 }).map((_, i) => (
                            <CarouselItem key={i} className="pl-4 md:pl-6 basis-[70%] sm:basis-[40%] md:basis-[25%] lg:basis-[20%]">
                                <ServiceSkeletonCard />
                            </CarouselItem>
                        ))
                        : services.map((service) => (
                            <CarouselItem key={service._id} className="pl-4 md:pl-6 basis-[70%] sm:basis-[40%] md:basis-[25%] lg:basis-[20%] smooth-gpu">
                                <ServiceCard service={service} />
                            </CarouselItem>
                        ))
                    }
                </CarouselContent>
            </Carousel>
        </section>
    );
};

export default ServiceCarousel;