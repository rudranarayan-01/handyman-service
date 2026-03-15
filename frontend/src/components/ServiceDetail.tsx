import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, Star, ShieldCheck, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import api from '@/api/api';

const ServiceDetailPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { addToCart, cartItems } = useCart();
    
    const serviceSlug = searchParams.get('service'); 
    const categorySlug = searchParams.get('category');

    const [service, setService] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!serviceSlug) return;
            
            setLoading(true);
            try {
                // --- UPDATED ENDPOINT ---
                // Matches the backend: /api/v1/services/details/:slug
                const res = await api.get(`/services/details/${serviceSlug}`);
                
                // --- ROBUST DATA CHECK ---
                // In case your backend wraps the object (e.g., { service: { ... } })
                const data = res.data.service || res.data.data || res.data;
                setService(data);
            } catch (err) {
                console.error("Error fetching service details", err);
                setService(null);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [serviceSlug]);

    if (loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-black uppercase tracking-widest text-gray-400">Loading Details...</p>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-6">
                <p className="text-xl font-bold text-gray-400 uppercase tracking-widest">Service not found</p>
                <Button onClick={() => navigate(-1)} className="rounded-full px-8">Go Back</Button>
            </div>
        );
    }

    // Logic for Cart
    const isItemInCart = cartItems.some((item: any) => item._id === service._id);

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* HERO IMAGE SECTION */}
            <div className="relative h-[40vh] md:h-[60vh] w-full">
                <img 
                    src={service.image || '/placeholder-service.jpg'} 
                    alt={service.name} 
                    className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                <button 
                    onClick={() => navigate(-1)}
                    className="absolute top-10 left-6 p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-all"
                >
                    <ArrowLeft size={24} />
                </button>
            </div>

            {/* CONTENT SECTION */}
            <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-10">
                <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    {categorySlug?.replace(/-/g, ' ') || 'Service'}
                                </span>
                                <div className="flex items-center gap-1 text-amber-500">
                                    <Star size={14} fill="currentColor" />
                                    <span className="text-xs font-black">
                                        {service.rating || '4.9'} ({service.reviewsCount || '1.2k'} Reviews)
                                    </span>
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none">
                                {service.name}
                            </h1>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price starting at</p>
                            <p className="text-5xl font-black text-gray-900 tracking-tighter">₹{service.price}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 border-y border-gray-100 py-10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase">Duration</p>
                                <p className="font-bold text-gray-900">{service.duration || '45 - 60 Mins'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase">Warranty</p>
                                <p className="font-bold text-gray-900">{service.warranty || '30 Days'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase">Safety</p>
                                <p className="font-bold text-gray-900">Masks & Sanitize</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">About this service</h3>
                        <p className="text-gray-500 leading-relaxed font-medium">
                            {service.description || "Our professional experts provide top-tier service using high-quality materials and modern techniques."}
                        </p>
                        
                        <ul className="space-y-3">
                            {(service.features || ["Expert Professional", "Transparent Pricing", "Genuine Spare Parts"]).map((item: string) => (
                                <li key={item} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                                    <CheckCircle2 size={18} className="text-emerald-500" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-12 flex gap-4">
                        <Button 
                            onClick={() => addToCart(service)}
                            disabled={isItemInCart}
                            className={`flex-1 py-8 rounded-[2rem] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
                                isItemInCart ? 'bg-emerald-500 text-white' : 'bg-gray-900 text-white hover:bg-blue-600'
                            }`}
                        >
                            {isItemInCart ? "Added to Cart" : "Add to Cart"} 
                            <ShoppingBag className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetailPage;