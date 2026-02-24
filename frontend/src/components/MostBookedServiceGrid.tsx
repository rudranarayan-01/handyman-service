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

// ── Skeleton Card ──
const ServiceSkeleton = () => (
    <div className="flex flex-col gap-3">
        <div className="aspect-[3/4] w-full rounded-2xl md:rounded-3xl shimmer-service" />
        <div className="space-y-2 px-1">
            <div className="shimmer-service h-3 w-3/4 rounded-full" />
            <div className="shimmer-service h-3 w-1/2 rounded-full" />
        </div>
    </div>
);

// ── Service Card ──
const ServiceCard = ({ service }: { service: any }) => {
    const [loaded, setLoaded] = useState(false);
    const navigate = useNavigate();

    const handleClick = () => {
        if (!service.category) return;
        const slug = service.category
            .toLowerCase()
            .trim()
            .replace(/[\s]+/g, '-')
            .replace(/-+/g, '-');
        navigate(`/categories/${slug}`);
    };

    return (
        <div
            onClick={handleClick}
            className="cursor-pointer group/card flex flex-col"
        >
            {/* Image Container */}
            <div className="relative aspect-[3/4] w-full rounded-2xl md:rounded-3xl overflow-hidden bg-gray-100 shadow-md">

                {/* Skeleton */}
                {!loaded && (
                    <div className="absolute inset-0 shimmer-service z-10" />
                )}

                {/* Image */}
                <img
                    src={service.image}
                    alt={service.title}
                    loading="eager"
                    fetchPriority="high"
                    onLoad={() => setLoaded(true)}
                    className={`w-full h-full object-cover transition-all duration-700 group-hover/card:scale-110
                        ${loaded ? 'opacity-100' : 'opacity-0'}
                    `}
                />

                {/* Dark gradient overlay — stronger at bottom for text */}
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent" />

                {/* Top badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20">
                    <div className="flex items-center gap-1 bg-orange-500 px-2 py-1 rounded-lg">
                        <Flame size={9} className="text-white" />
                        <span className="text-[9px] font-black uppercase text-white tracking-widest">
                            Hot
                        </span>
                    </div>
                    {service.oldPrice && (
                        <div className="bg-green-500 px-2 py-1 rounded-lg">
                            <span className="text-[9px] font-black text-white">
                                {Math.round((1 - service.price / service.oldPrice) * 100)}% OFF
                            </span>
                        </div>
                    )}
                </div>

                {/* Bottom content overlaid on image */}
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 z-20">

                    {/* Title */}
                    <h4 className="text-sm md:text-base font-black text-white leading-tight line-clamp-2 mb-2 drop-shadow-sm">
                        {service.name}
                    </h4>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mb-3">
                        <div className="flex items-center gap-1 bg-white/15 backdrop-blur-sm px-2 py-0.5 rounded-full">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-[11px] font-black text-white">
                                {service.rating || '4.8'}
                            </span>
                        </div>
                        <span className="text-[10px] text-white/60 font-medium">
                            ({service.reviews || '1k'}+)
                        </span>
                    </div>

                    {/* Price row + CTA */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-base md:text-lg font-black text-white">
                                ₹{service.price}
                            </span>
                            {service.oldPrice && (
                                <span className="text-[11px] text-white/50 line-through">
                                    ₹{service.oldPrice}
                                </span>
                            )}
                        </div>

                        {/* Book button */}
                        <Button variant="secondary">
                            Book
                            <ArrowRight
                                size={11}
                                className="group-hover/btn:translate-x-0.5 transition-transform duration-200"
                            />
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
        <>
            <style>{`
                @keyframes shimmerService {
                    0%   { background-position: -600px 0; }
                    100% { background-position: 600px 0; }
                }
                .shimmer-service {
                    background: linear-gradient(90deg, #f3f4f6 25%, #e9eaec 50%, #f3f4f6 75%);
                    background-size: 600px 100%;
                    animation: shimmerService 1.5s ease-in-out infinite;
                }

                .service-nav-btn {
                    background: white;
                    border: 1.5px solid rgba(0,0,0,0.08);
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                    transition: all 0.25s ease;
                    color: #111827;
                }
                .service-nav-btn:hover {
                    background: #111827;
                    color: white;
                    transform: scale(1.08);
                    box-shadow: 0 8px 30px rgba(0,0,0,0.2);
                }
                .service-nav-btn:disabled {
                    opacity: 0;
                    pointer-events: none;
                }
            `}</style>

            <section className="py-10 md:py-14 px-4 md:px-6 max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-end mb-6 md:mb-8">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Flame size={13} className="text-orange-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                                Trending Now
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                            Most Booked Services
                        </h2>
                        <p className="text-xs md:text-sm text-gray-400 font-medium hidden sm:block">
                            Trusted by thousands of customers this month
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/categories')}
                        className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors group/all"
                    >
                        <span className="hidden sm:inline">See All</span>
                        <ArrowRight size={14} className="group-hover/all:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Carousel */}
                <div className="relative group">
                    <Carousel opts={{ align: "start", loop: false }} className="w-full">
                        <CarouselContent className="-ml-3 md:-ml-4">

                            {/* Skeletons while loading */}
                            {loading
                                ? [...Array(5)].map((_, i) => (
                                    <CarouselItem
                                        key={`skeleton-${i}`}
                                        className="pl-3 md:pl-4 basis-[60%] sm:basis-[38%] md:basis-[28%] lg:basis-[21%]"
                                    >
                                        <ServiceSkeleton />
                                    </CarouselItem>
                                ))
                                : services.map((service) => (
                                    <CarouselItem
                                        key={service._id}
                                        className="pl-3 md:pl-4 basis-[60%] sm:basis-[38%] md:basis-[28%] lg:basis-[21%]"
                                    >
                                        <ServiceCard service={service} />
                                    </CarouselItem>
                                ))
                            }
                        </CarouselContent>

                        <CarouselPrevious className="service-nav-btn absolute -left-3 md:-left-5 top-[40%] -translate-y-1/2 h-10 w-10 md:h-11 md:w-11 rounded-full z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        <CarouselNext    className="service-nav-btn absolute -right-3 md:-right-5 top-[40%] -translate-y-1/2 h-10 w-10 md:h-11 md:w-11 rounded-full z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </Carousel>
                </div>

                {/* Mobile dots */}
                {!loading && (
                    <div className="flex justify-center gap-1.5 mt-5 sm:hidden">
                        {services.slice(0, 5).map((_, i) => (
                            <div
                                key={i}
                                className={`rounded-full transition-all duration-300 ${
                                    i === 0 ? 'w-5 h-1.5 bg-indigo-600' : 'w-1.5 h-1.5 bg-gray-200'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </section>
        </>
    );
};

export default MostBookedServiceGrid;