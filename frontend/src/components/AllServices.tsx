import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'; // Changed useSearchParams to useParams
import { Helmet } from 'react-helmet-async'; 
import { Star, ShieldCheck, Loader2, Clock, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { useCart } from '@/context/CartContext';
import api from '@/api/api';
import BackNavigation from './BackNavigation';

const AllServices = () => {
    // 1. Grab the slug from the URL path /services/:categorySlug
    const { categorySlug } = useParams<{ categorySlug: string }>(); 
    const navigate = useNavigate();
    // const location = useLocation();
    const { cartItems, totalAmount } = useCart();

    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Clean up title for display
    const pageTitle = categorySlug?.replace(/-/g, ' ');

    useEffect(() => {
        const fetchServices = async () => {
            // Ensure we have a slug before making the API call
            if (!categorySlug) return;
            
            setLoading(true);
            try {
                // 2. Fetching using the slug-based endpoint
                const res = await api.get(`/services/category/slug/${categorySlug}`);
                
                const fetchedData = Array.isArray(res.data)
                    ? res.data
                    : (res.data.services || res.data.data || []);
                
                setServices(fetchedData);
            } catch (err) {
                console.error("Error fetching services:", err);
                setServices([]);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, [categorySlug]);

    const handleViewDetails = (service: any) => {
        if (!categorySlug || (!service.slug && !service.name)) return;
        
        // Use service.slug if available, otherwise fallback to name-slug
        const sSlug = service.slug || service.name.toLowerCase().replace(/\s+/g, '-');
        
        // 3. Navigate to the new SEO Detail Path: /service/:serviceSlug
        navigate(`/service/detail/${sSlug}`);
    };

    return (
        <div className="min-h-screen bg-[#F9FBFF] pb-32 mt-20 font-sans">
            <Helmet>
                <title>{`Best ${pageTitle} Services | Quality Guaranteed`}</title>
                <meta name="description" content={`Book professional ${pageTitle} services. Expert quality, transparent pricing, and verified professionals at your doorstep.`} />
                <meta property="og:title" content={`Premium ${pageTitle} Services Catalog`} />
                <meta property="og:type" content="website" />
                {/* Canonical should reflect the clean URL */}
                <link rel="canonical" href={`${window.location.origin}/services/${categorySlug}`} />
            </Helmet>

            <BackNavigation />

            <main className="max-w-6xl mx-auto px-6 pt-8">
                {/* Header Section */}
                <motion.header 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-emerald-100 rounded-lg">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                            Verified Expert Catalog
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black text-gray-900 capitalize tracking-tighter leading-none">
                        {pageTitle}
                    </h1>
                    <p className="mt-4 text-gray-400 font-medium max-w-xl">
                        Discover top-rated {pageTitle} solutions tailored to your needs with guaranteed safety protocols.
                    </p>
                </motion.header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        <p className="text-gray-400 font-black text-[10px] tracking-[0.3em] uppercase animate-pulse">
                            Syncing Services...
                        </p>
                    </div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    >
                        <AnimatePresence>
                            {services && services.length > 0 ? (
                                services.map((service, index) => (
                                    <motion.article
                                        key={service._id || service.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => handleViewDetails(service)}
                                        className="group bg-white rounded-[2.8rem] border border-gray-100 p-5 flex gap-6 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] transition-all duration-500 cursor-pointer relative overflow-hidden active:scale-[0.98]"
                                    >
                                        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Sparkles className="text-blue-300 w-5 h-5 animate-pulse" />
                                        </div>

                                        <figure className="relative w-32 h-32 md:w-44 md:h-44 rounded-[2.2rem] overflow-hidden bg-gray-50 shrink-0 shadow-inner">
                                            <img
                                                src={service.image || '/placeholder-service.jpg'}
                                                alt={`${service.name} professional service`}
                                                loading="lazy"
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                                            />
                                        </figure>

                                        <div className="flex-1 flex flex-col justify-center py-2">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">
                                                        <Star className="w-3 h-3 fill-current" />
                                                        <span className="text-[10px] font-black">{service.rating || '4.9'}</span>
                                                    </div>
                                                    <span className="h-1 w-1 bg-gray-200 rounded-full"></span>
                                                    <div className="flex items-center gap-1.5 text-gray-400">
                                                        <Clock className="w-3 h-3" />
                                                        <span className="text-[10px] font-black uppercase tracking-tighter">
                                                            {service.duration || '45-60 min'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <h2 className="text-xl md:text-3xl font-black text-gray-900 tracking-tighter leading-tight group-hover:text-blue-600 transition-colors">
                                                    {service.name}
                                                </h2>

                                                <p className="text-gray-400 text-xs font-medium line-clamp-2 leading-relaxed">
                                                    {service.description || "Premium professional service with strictly verified quality protocols."}
                                                </p>
                                            </div>

                                            <div className="mt-5 flex items-center justify-between">
                                                <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                                                    Details <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                </div>
                                                <span className="text-lg font-black text-gray-900 tracking-tighter">
                                                    ₹{service.price}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.article>
                                ))
                            ) : (
                                <div className="col-span-full py-32 text-center bg-white rounded-[3.5rem] border-2 border-dashed border-gray-100">
                                    <p className="text-gray-300 font-black text-xl uppercase tracking-[0.2em]">No services found</p>
                                    <Link to="/categories" className="text-blue-600 font-bold text-sm underline mt-4 inline-block hover:text-blue-800 transition-colors">
                                        Explore other categories
                                    </Link>
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </main>

            {/* Sticky Cart UI */}
            <AnimatePresence>
                {cartItems.length > 0 && (
                    <motion.div 
                        initial={{ y: 100, x: '-50%' }}
                        animate={{ y: 0, x: '-50%' }}
                        exit={{ y: 100, x: '-50%' }}
                        className="fixed bottom-10 left-1/2 z-50 w-[92%] max-w-md"
                    >
                        <div className="bg-gray-900/95 backdrop-blur-2xl rounded-[2.4rem] p-3 pl-8 flex items-center justify-between shadow-[0_40px_80px_rgba(0,0,0,0.4)] border border-white/10 ring-1 ring-white/10">
                            <div className="flex flex-col">
                                <span className="text-white font-black text-2xl tracking-tighter leading-none">₹{totalAmount}</span>
                                <span className="text-blue-400 text-[9px] font-black uppercase tracking-[0.2em] mt-1">
                                    {cartItems.length} {cartItems.length === 1 ? 'SERVICE' : 'SERVICES'} SELECTED
                                </span>
                            </div>
                            <Link to="/shopping-cart" className="bg-blue-600 text-white px-10 py-5 rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-500 transition-all active:scale-95 shadow-xl shadow-blue-900/20">
                                Checkout Now
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AllServices;