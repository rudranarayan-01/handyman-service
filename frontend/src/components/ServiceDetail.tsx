import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, Clock, Star, ShieldCheck, ArrowLeft, ShoppingBag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
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
                const res = await api.get(`/services/details/${serviceSlug}`);
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

    // --- SEO: Structured Data (JSON-LD) ---
    const jsonLd = useMemo(() => {
        if (!service) return null;
        return {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": service.name,
            "image": service.image,
            "description": service.seo?.metaDescription || service.description,
            "brand": {
                "@type": "Brand",
                "name": "YourBrandName" 
            },
            "offers": {
                "@type": "Offer",
                "url": window.location.href,
                "priceCurrency": "INR",
                "price": service.price,
                "availability": "https://schema.org/InStock",
                "itemCondition": "https://schema.org/NewCondition"
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": service.rating || "4.8",
                "bestRating": "5",
                "worstRating": "1",
                "ratingCount": service.reviewsCount || "1200"
            }
        };
    }, [service]);

    if (loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-4 bg-white">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-black uppercase tracking-widest text-gray-400 animate-pulse">Loading Details...</p>
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

    const isItemInCart = cartItems.some((item: any) => item._id === service._id);

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* --- SEO HELMET SECTION --- */}
            <Helmet>
                <title>{service.seo?.metaTitle || `${service.name} | Professional Home Service`}</title>
                <meta name="description" content={service.seo?.metaDescription || service.description} />
                <meta name="keywords" content={service.seo?.keywords?.join(', ')} />
                
                {/* Open Graph / Social Media */}
                <meta property="og:title" content={service.seo?.metaTitle || service.name} />
                <meta property="og:description" content={service.seo?.metaDescription || service.description} />
                <meta property="og:image" content={service.image} />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:type" content="website" />

                {/* Structured Data Script */}
                {jsonLd && (
                    <script type="application/ld+json">
                        {JSON.stringify(jsonLd)}
                    </script>
                )}
            </Helmet>

            {/* HERO IMAGE SECTION */}
            <div className="relative h-[45vh] md:h-[65vh] w-full overflow-hidden">
                <motion.img 
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    src={service.image || '/placeholder-service.jpg'} 
                    alt={service.name} 
                    className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                
                <button 
                    onClick={() => navigate(-1)}
                    className="absolute top-10 left-6 p-3 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/20 hover:bg-white hover:text-black transition-all z-20"
                >
                    <ArrowLeft size={24} />
                </button>
            </div>

            {/* CONTENT SECTION */}
            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="max-w-4xl mx-auto px-6 -mt-24 relative z-10"
            >
                <div className="bg-white rounded-[3.5rem] p-8 md:p-14 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-gray-50">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                        <div className="space-y-5">
                            <div className="flex items-center gap-3">
                                <span className="px-5 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-100">
                                    {categorySlug?.replace(/-/g, ' ') || 'Service'}
                                </span>
                                <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                                    <Star size={14} fill="currentColor" />
                                    <span className="text-xs font-black text-amber-700">
                                        {service.rating || '4.8'} ({service.reviewsCount || '1.2k'})
                                    </span>
                                </div>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-[0.85]">
                                {service.name}
                            </h1>
                        </div>
                        <div className="bg-slate-50 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 text-right min-w-[180px]">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Price starting at</p>
                            <p className="text-5xl font-black text-gray-900 tracking-tighter">₹{service.price}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12 border-y border-gray-100 py-12">
                        {[
                            { icon: Clock, label: 'Duration', val: service.duration, bg: 'bg-emerald-50', text: 'text-emerald-600' },
                            { icon: ShieldCheck, label: 'Warranty', val: service.warranty || '30 Days', bg: 'bg-blue-50', text: 'text-blue-600' },
                            { icon: Sparkles, label: 'Safety', val: 'Masks & Sanitize', bg: 'bg-purple-50', text: 'text-purple-600' }
                        ].map((stat, i) => (
                            <div key={i} className="flex items-center gap-4 group">
                                <div className={`p-4 ${stat.bg} rounded-2xl ${stat.text} group-hover:scale-110 transition-transform duration-300`}>
                                    <stat.icon size={26} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                    <p className="font-bold text-gray-900 text-lg tracking-tight">{stat.val}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] mb-4">The Excellence Standard</h3>
                            <p className="text-gray-500 text-lg leading-relaxed font-medium">
                                {service.description || "Precision-driven execution using high-quality materials and modern techniques to ensure your complete satisfaction."}
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {(service.features || ["Expert Professional", "Transparent Pricing", "Genuine Spare Parts", "Premium Post-Service Clean"]).map((item: string) => (
                                <div key={item} className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                                    <span className="text-sm font-bold text-gray-700">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-14">
                        <Button 
                            onClick={() => addToCart(service)}
                            disabled={isItemInCart}
                            className={`w-full py-10 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-md transition-all shadow-2xl active:scale-95 ${
                                isItemInCart 
                                ? 'bg-emerald-500 text-white cursor-not-allowed' 
                                : 'bg-gray-900 text-white hover:bg-blue-600 hover:shadow-blue-200'
                            }`}
                        >
                            <span className="flex items-center gap-3">
                                {isItemInCart ? "Successfully Added" : "Confirm & Add to Cart"} 
                                <ShoppingBag className={`w-6 h-6 ${isItemInCart ? 'animate-bounce' : ''}`} />
                            </span>
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ServiceDetailPage;