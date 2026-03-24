import { useEffect, useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Star, ShieldCheck, Clock, ChevronRight, Sparkles, Filter, AlertCircle, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence, } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import api from '@/api/api';
import BackNavigation from './BackNavigation';

/* ---------------- TYPES ---------------- */
interface Service {
    _id?: string;
    id?: string;
    name: string;
    slug?: string;
    image?: string;
    rating?: number;
    duration?: string;
    description?: string;
    basePrice?: number;
    variants?: { price: number }[];
}

/* ---------------- UTILS ---------------- */
const generateSlug = (name: string) =>
    name?.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

const optimizeCloudinary = (url?: string) => {
    if (!url) return 'https://images.unsplash.com/photo-1581578731548-c64695ce6958?q=80&w=600&auto=format&fit=crop';
    if (!url.includes('cloudinary')) return url;
    return url.replace('/upload/', '/upload/f_auto,q_auto,w_600/');
};

/* ---------------- SKELETON CARD ---------------- */
const SkeletonCard = () => (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="h-48 bg-gray-200 animate-pulse" />
        <div className="p-5 space-y-4">
            <div className="flex justify-between">
                <div className="h-4 bg-gray-100 rounded-full w-1/4 animate-pulse" />
                <div className="h-4 bg-gray-100 rounded-full w-1/4 animate-pulse" />
            </div>
            <div className="h-6 bg-gray-100 rounded-full w-3/4 animate-pulse" />
            <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded-full w-full animate-pulse" />
                <div className="h-3 bg-gray-100 rounded-full w-2/3 animate-pulse" />
            </div>
            <div className="flex justify-between items-center pt-2">
                <div className="h-8 bg-gray-100 rounded-lg w-20 animate-pulse" />
                <div className="h-8 bg-gray-100 rounded-lg w-24 animate-pulse" />
            </div>
        </div>
    </div>
);

/* ---------------- SERVICE CARD ---------------- */
const ServiceCard = ({ service, index, onClick }: { service: Service; index: number; onClick: () => void }) => {
    const price = service.basePrice || service.variants?.[0]?.price || 0;
    const rating = service.rating || 4.9;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
            className="group relative bg-white rounded-[2rem] border border-gray-100 overflow-hidden 
                       hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col h-full"
        >
            <div className="relative overflow-hidden aspect-[4/3] cursor-pointer" onClick={onClick}>
                <img
                    src={optimizeCloudinary(service.image)}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    decoding='async'
                    fetchPriority='high'
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-bold text-gray-800">{rating}</span>
                    </div>
                    <div className="bg-white/95 backdrop-blur-md p-2 rounded-full shadow-sm translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                         <Clock className="w-3.5 h-3.5 text-gray-600" />
                    </div>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                     <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {service.duration || '45 min'}
                    </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {service.name}
                </h3>
                
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                    {service.description || 'Verified experts for professional home maintenance and care.'}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div>
                        <p className="text-[12px] text-blue-500 font-medium uppercase tracking-tight">Price starts from</p>
                        <p className="text-xl font-black text-gray-900">₹{price.toLocaleString('en-IN')}</p>
                    </div>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onClick(); }}
                        className="flex items-center gap-1.5 bg-gray-900 text-white px-5 py-2.5 rounded-2xl 
                                   hover:bg-blue-600 transition-all duration-300 active:scale-95 shadow-md shadow-gray-200"
                    >
                        <span className="text-sm font-bold">View all</span>
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

/* ---------------- MAIN COMPONENT ---------------- */
const AllServices = () => {
    const { categorySlug } = useParams<{ categorySlug: string }>();
    const navigate = useNavigate();
    const { cartItems, totalAmount } = useCart();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const pageTitle = useMemo(() => categorySlug?.replace(/-/g, ' ') || 'Services', [categorySlug]);

    useEffect(() => {
        if (!categorySlug) return;
        const fetchServices = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/services/category/slug/${categorySlug}`);
                const data = res?.data?.services || res?.data?.data || (Array.isArray(res.data) ? res.data : []);
                setServices(data);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, [categorySlug]);

    return (
        <div className="min-h-screen bg-[#F9FBFF] font-sans selection:bg-blue-100 selection:text-blue-900">
            <Helmet>
                <title>{`Premium ${pageTitle} | HouseXpertz`}</title>
            </Helmet>

            <BackNavigation />

            <main className="max-w-7xl mx-auto px-4 sm:px-8 pb-32">
                {/* HERO SECTION */}
                <div className="pt-12 pb-8 sm:pt-20 sm:pb-12 border-b border-gray-100 mb-8 sm:mb-12">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }} 
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 mb-4"
                    >
                        <div className="h-px w-8 bg-blue-500" />
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Premium Home Care</span>
                    </motion.div>
                    
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                className="text-4xl sm:text-6xl font-black text-gray-900 capitalize tracking-tight"
                            >
                                {pageTitle}
                            </motion.h1>
                            <motion.p 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                                className="mt-4 text-gray-500 text-lg max-w-xl"
                            >
                                Hand-picked professionals dedicated to quality and reliability in your neighborhood.
                            </motion.p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="p-3 bg-white border border-gray-200 rounded-2xl hover:border-blue-300 transition-colors shadow-sm">
                                <Filter size={20} className="text-gray-600" />
                            </button>
                            <div className="bg-emerald-50 border border-emerald-100 px-4 py-2.5 rounded-2xl flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                <span className="text-sm font-bold text-emerald-700">Verified Quality</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* STATS / FILTER BAR */}
                {!loading && services.length > 0 && (
                    <div className="flex items-center gap-2 mb-8 px-1">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-medium text-gray-500">
                            Showing <span className="text-gray-900 font-bold">{services.length}</span> results for your location
                        </span>
                    </div>
                )}

                {/* CONTENT GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                    {loading ? (
                        Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                    ) : error ? (
                        <div className="col-span-full py-20 flex flex-col items-center">
                            <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
                            <h3 className="text-xl font-bold">Oops! Something went wrong</h3>
                            <button onClick={() => window.location.reload()} className="mt-4 text-blue-600 font-bold">Try again</button>
                        </div>
                    ) : services.length > 0 ? (
                        <AnimatePresence mode="popLayout">
                            {services.map((service, index) => (
                                <ServiceCard 
                                    key={service._id || service.id} 
                                    service={service} 
                                    index={index}
                                    onClick={() => navigate(`/service/detail/${service.slug || generateSlug(service.name)}`)}
                                />
                            ))}
                        </AnimatePresence>
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShoppingBag className="w-10 h-10 text-blue-300" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">No services found</h3>
                            <Link to="/categories" className="mt-2 text-blue-600 inline-block">Browse all categories &rarr;</Link>
                        </div>
                    )}
                </div>
            </main>

            {/* FLOATING CART - REFINED */}
            <AnimatePresence>
                {cartItems.length > 0 && (
                    <motion.div
                        initial={{ y: 100, x: '-50%', opacity: 0 }}
                        animate={{ y: 0, x: '-50%', opacity: 1 }}
                        exit={{ y: 100, x: '-50%', opacity: 0 }}
                        className="fixed bottom-8 left-1/2 w-[90%] max-w-md z-50"
                    >
                        <div className="bg-gray-900/95 backdrop-blur-xl text-white rounded-[2rem] p-4 flex justify-between items-center shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-white/10">
                            <div className="flex items-center gap-4 ml-2">
                                <div className="relative">
                                    <ShoppingBag className="w-6 h-6 text-blue-400" />
                                    <span className="absolute -top-2 -right-2 bg-blue-500 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                        {cartItems.length}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Total Amount</p>
                                    <p className="text-lg font-black tracking-tight">₹{totalAmount.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                            <Link
                                to="/shopping-cart"
                                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-bold transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-blue-600/20"
                            >
                                Checkout
                                <ChevronRight size={18} />
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AllServices;