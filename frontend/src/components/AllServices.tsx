import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, Loader2, Clock, ChevronRight, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import api from '@/api/api';
import BackNavigation from './BackNavigation';

const AllServices = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const categorySlug = searchParams.get('category');
    const { cartItems, totalAmount } = useCart();

    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const pageTitle = categorySlug?.replace(/-/g, ' ');

    useEffect(() => {
        const fetchServices = async () => {
            if (!categorySlug) return;
            setLoading(true);
            try {
                const res = await api.get(`/services/category/slug/${categorySlug}`);

                // --- FIX: Robust Data Extraction ---
                // Check if res.data is the array, or if it's inside an object property
                const fetchedData = Array.isArray(res.data)
                    ? res.data
                    : (res.data.services || res.data.data || []);

                setServices(fetchedData);
            } catch (err) {
                console.error("Fetch error", err);
                setServices([]);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, [categorySlug]);

    const handleViewDetails = (service: any) => {
        if (!categorySlug || (!service.slug && !service.name)) {
            console.error("Missing navigation data", { categorySlug, service });
            return;
        }

        const sSlug = service.slug || service.name.toLowerCase().replace(/\s+/g, '-');
        const targetUrl = `/service-details?category=${categorySlug}&service=${sSlug}`;

        console.log("Redirecting to:", targetUrl); // Check your browser console!
        navigate(targetUrl);
    };

    return (
        <div className="min-h-screen bg-[#F9FBFF] pb-32 mt-20 font-sans">
            <BackNavigation />

            <main className="max-w-6xl mx-auto px-6 pt-8">
                {/* Header Section */}
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-emerald-100 rounded-lg">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Premium Quality Guaranteed</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 capitalize tracking-tighter leading-none">
                        {pageTitle}
                    </h1>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        <p className="text-gray-400 font-bold text-sm tracking-widest uppercase animate-pulse">Loading Catalog...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {services && services.length > 0 ? (
                            services.map((service) => (
                                <div
                                    key={service._id || service.id}
                                    onClick={() => handleViewDetails(service)}
                                    className="group bg-white rounded-[2.5rem] border border-gray-100 p-5 flex gap-6 hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)] transition-all duration-500 cursor-pointer relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Sparkles className="text-blue-200 w-5 h-5" />
                                    </div>

                                    {/* Image */}
                                    <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-[1.8rem] overflow-hidden bg-gray-50 shrink-0">
                                        <img
                                            src={service.image || '/placeholder-service.jpg'}
                                            alt={service.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 flex flex-col justify-center py-1">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1 text-amber-500">
                                                    <Star className="w-3 h-3 fill-current" />
                                                    <span className="text-[10px] font-black">{service.rating || '4.8'}</span>
                                                </div>
                                                <span className="h-1 w-1 bg-gray-200 rounded-full"></span>
                                                <div className="flex items-center gap-1 text-gray-400">
                                                    <Clock className="w-3 h-3" />
                                                    <span className="text-[10px] font-black uppercase tracking-tighter">
                                                        {service.duration || '45-60 min'}
                                                    </span>
                                                </div>
                                            </div>

                                            <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                                                {service.name}
                                            </h3>

                                            <p className="text-gray-400 text-xs font-medium line-clamp-2 leading-relaxed max-w-[250px]">
                                                {service.description || "Expert professional service with verified quality check."}
                                            </p>
                                        </div>

                                        <div className="mt-4">
                                            <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 group-hover:gap-4 transition-all">
                                                View Details <ChevronRight size={14} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                                <p className="text-gray-300 font-black text-xl uppercase tracking-[0.2em]">No services found</p>
                                <Link to="/" className="text-blue-600 font-bold text-sm underline mt-4 inline-block">Explore other categories</Link>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Sticky Cart UI */}
            {cartItems.length > 0 && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-md">
                    <div className="bg-gray-900/95 backdrop-blur-xl rounded-[2rem] p-3 pl-6 flex items-center justify-between shadow-[0_30px_60px_rgba(0,0,0,0.3)] border border-white/5">
                        <div className="flex flex-col">
                            <span className="text-white font-black text-xl tracking-tighter leading-none">₹{totalAmount}</span>
                            <span className="text-blue-400 text-[10px] font-black uppercase tracking-widest">{cartItems.length} ITEM SELECTED</span>
                        </div>
                        <Link to="/shopping-cart" className="bg-white text-black px-10 py-4 rounded-[1.4rem] font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95">
                            Checkout
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllServices;