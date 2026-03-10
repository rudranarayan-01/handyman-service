import { useState, useEffect, useCallback } from 'react';
import { Star, ArrowRight, Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaCarouselType } from 'embla-carousel';
import api from '@/api/api';
import { useNavigate } from 'react-router-dom';

interface Service {
    _id: string;
    name: string;
    category: string;
    image: string;
    price: number;
    rating?: string;
}

const ServiceSkeleton = () => (
    <div className="flex-[0_0_82%] sm:flex-[0_0_48%] lg:flex-[0_0_25%] pl-4 md:pl-6">
        <div className="aspect-[4/5] w-full rounded-[2rem] bg-stone-100 animate-pulse border border-stone-200" />
    </div>
);

const ServiceCard = ({ service, index }: { service: Service; index: number }) => {
    const [loaded, setLoaded] = useState(false);
    const navigate = useNavigate();

    const handleClick = useCallback(() => {
        if (!service.category) return;
        const slug = service.category.toLowerCase().trim().replace(/[\s]+/g, '-');
        navigate(`/categories/${slug}`);
    }, [navigate, service.category]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "50px" }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            onClick={handleClick}
            className="group/card cursor-pointer relative h-full min-w-0 flex-[0_0_82%] sm:flex-[0_0_48%] lg:flex-[0_0_25%] pl-4 md:pl-6 transition-transform will-change-transform"
        >
            <div className="relative aspect-[4/5] w-full rounded-[2rem] overflow-hidden bg-stone-100 border border-stone-100 group-hover/card:border-stone-200 transition-all duration-500 transform-gpu group-hover/card:-translate-y-2 group-hover/card:shadow-xl">
                
                {/* Image Optimization */}
                {!loaded && <div className="absolute inset-0 bg-stone-200 animate-pulse z-10" />}
                <img
                    src={service.image}
                    alt={service.name}
                    onLoad={() => setLoaded(true)}
                    loading="lazy"
                    className={`w-full h-full object-cover transition-transform duration-1000 ease-out transform-gpu group-hover/card:scale-110 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-80" />

                {/* Badges */}
                <div className="absolute top-5 left-5 z-20">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                        <Flame size={12} className="text-orange-500 fill-orange-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Trending</span>
                    </div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <h4 className="text-xl font-bold text-white mb-3 line-clamp-2 leading-tight tracking-tight">
                        {service.name}
                    </h4>

                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-1">
                                <Star size={12} className="fill-blue-500 text-blue-500" />
                                <span className="text-xs font-semibold text-blue-100">{service.rating || '4.9'}</span>
                            </div>
                            <span className="text-2xl font-black text-white tracking-tighter">₹{service.price}</span>
                        </div>
                        
                        {/* Mobile Optimized Button - Shows on hover (Desktop) or tap (Mobile) */}
                        <motion.div 
                            whileTap={{ scale: 0.9 }}
                            className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-black opacity-0 group-hover/card:opacity-100 lg:scale-0 lg:group-hover/card:scale-100 transition-all duration-300 shadow-lg"
                        >
                            <ArrowRight size={20} />
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const MostBookedServiceGrid = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [scrollProgress, setScrollProgress] = useState(0);
    const navigate = useNavigate();

    const [emblaRef, emblaApi] = useEmblaCarousel({ 
        align: 'start',
        containScroll: 'trimSnaps',
        dragFree: true,
        skipSnaps: false
    });

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    const onScroll = useCallback((api: EmblaCarouselType) => {
        const progress = Math.max(0, Math.min(1, api.scrollProgress()));
        setScrollProgress(progress * 100);
    }, []);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on('scroll', onScroll);
        emblaApi.on('reInit', onScroll);
    }, [emblaApi, onScroll]);

    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                const res = await api.get('/services/top-booked/');
                if (isMounted) setServices(res.data);
            } catch (error) {
                console.error("API Error:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        })();
        return () => { isMounted = false; };
    }, []);

    return (
        <section className="py-16 md:py-24 bg-white overflow-hidden">
            <div className="max-w-360 mx-auto px-5 md:px-12">
                
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
                    <div className="w-full md:w-auto">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="h-[2px] w-8 bg-blue-600" />
                            <span className="text-blue-600 font-bold text-[10px] uppercase tracking-[0.4em]">Curated Excellence</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-black tracking-tighter uppercase leading-[0.85]">
                            Most Booked <br />
                            <span className="text-blue-600">Services</span>
                        </h2>
                    </div>

                    <div className="flex flex-col items-end gap-6 w-full md:w-auto">
                        <div className="hidden md:flex gap-3">
                            <button onClick={scrollPrev} className="h-14 w-14 rounded-full border border-stone-200 flex items-center justify-center hover:bg-black hover:text-white transition-all transform active:scale-90">
                                <ChevronLeft size={24} />
                            </button>
                            <button onClick={scrollNext} className="h-14 w-14 rounded-full border border-stone-200 flex items-center justify-center hover:bg-black hover:text-white transition-all transform active:scale-90">
                                <ChevronRight size={24} />
                            </button>
                        </div>
                        
                        <button 
                            onClick={() => navigate('/categories')}
                            className="text-[11px] font-black uppercase tracking-[0.3em] text-black hover:text-blue-600 transition-colors py-2 active:scale-95"
                        >
                            View All Catalogue
                        </button>
                    </div>
                </div>

                {/* Carousel Area */}
                <div className="relative -mx-4 md:-mx-6">
                    <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
                        <div className="flex touch-pan-y">
                            {loading
                                ? [...Array(4)].map((_, i) => <ServiceSkeleton key={i} />)
                                : services.map((service, index) => (
                                    <ServiceCard key={service._id} service={service} index={index} />
                                ))
                            }
                        </div>
                    </div>
                </div>

                {/* Mobile Progress Bar & Navigation */}
                <div className="mt-12 flex flex-col items-center gap-8 md:hidden">
                    <div className="w-full max-w-[160px] h-[3px] bg-stone-100 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-blue-600"
                            animate={{ x: `${scrollProgress}%` }}
                            transition={{ type: "spring", damping: 20, stiffness: 100 }}
                            style={{ width: '40%' }}
                        />
                    </div>
                    
                    <div className="flex items-center gap-12">
                        <button onClick={scrollPrev} className="text-stone-300 active:text-blue-600 transition-colors">
                            <ChevronLeft size={36} strokeWidth={2.5} />
                        </button>
                        <button onClick={scrollNext} className="text-stone-300 active:text-blue-600 transition-colors">
                            <ChevronRight size={36} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default MostBookedServiceGrid;
