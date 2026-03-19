import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
    CheckCircle2, Clock, ShieldCheck, ArrowLeft, Zap, 
    Award, Check, StarIcon, Shield, 
    Info, HardHat, Sparkles, TrendingUp, 
    Copy, Lock, Gift, Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import api from '@/api/api';
import { toast } from 'sonner';

// --- TYPES ---
interface Offer {
    code: string;
    discount: string;
    description: string;
}

interface Service {
    _id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    duration: string;
    warranty?: string;
    rating?: string;
    category?: { name: string };
    features?: string[];
    seo?: {
        metaTitle?: string;
        metaDescription?: string;
        keywords?: string[];
        structuredData?: any;
    };
}

const ServiceDetailPage = () => {
    const { serviceSlug } = useParams<{ serviceSlug: string }>(); 
    const navigate = useNavigate();
    const { addToCart, cartItems } = useCart();
    const [service, setService] = useState<Service | null>(null);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPageData = async () => {
            if (!serviceSlug) return;
            setLoading(true);
            try {
                const [serviceRes, offersRes] = await Promise.all([
                    api.get(`/services/details/${serviceSlug}`),
                    api.get(`/offers/available`)
                ]);
                const sData = serviceRes.data.service || serviceRes.data.data || serviceRes.data;
                setService(sData);
                setOffers(offersRes.data.offers || offersRes.data || []);
            } catch (err) {
                console.error("Data fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPageData();
        window.scrollTo(0, 0);
    }, [serviceSlug]);

    const isItemInCart = useMemo(() => 
        cartItems.some((item: any) => item._id === service?._id), 
    [cartItems, service]);

    const copyOfferCode = (code: string) => {
        navigator.clipboard.writeText(code);
        toast.success(`Code ${code} copied!`);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 transition-opacity duration-500">
            <Zap className="animate-pulse text-blue-600" size={40} />
        </div>
    );

    if (!service) return (
        <div className="h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 text-center px-6">
            <Zap size={40} className="text-slate-300" />
            <h3 className="text-2xl font-black text-slate-900">Service Not Found</h3>
            <Button onClick={() => navigate(-1)} className="rounded-xl h-12 px-6">Return to Directory</Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFDFD] pb-24 md:pb-32 font-sans selection:bg-blue-600 selection:text-white animate-in fade-in duration-700">
            <Helmet>
                <title>{service.seo?.metaTitle || `${service.name} | HouseXpertz`}</title>
                <meta name="description" content={service.seo?.metaDescription || service.description} />
            </Helmet>

            {/* --- HERO SECTION --- */}
            <div className="relative h-[40vh] md:h-[55vh] w-full overflow-hidden">
                <img 
                    src={service.image || '/placeholder.jpg'} 
                    className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" 
                    alt={service.name}
                />
                <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-[#FDFDFD]" />
                
                <button 
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 p-3 bg-white/10 backdrop-blur-xl rounded-xl text-white border border-white/20 hover:bg-white hover:text-black transition-all z-20 shadow-xl"
                >
                    <ArrowLeft size={20} />
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 md:-mt-32 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-8 space-y-8">
                        <section className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-sm border border-slate-100">
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <span className="px-4 py-1.5 bg-blue-600 text-[10px] font-black text-white rounded-lg uppercase tracking-widest">
                                    {service.category?.name || 'Verified Pro'}
                                </span>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-100 font-bold text-xs">
                                    <StarIcon size={14} fill="currentColor" />
                                    <span>{service.rating || '4.9'}</span>
                                    <span className="text-slate-400 font-medium">(1.2k+)</span>
                                </div>
                            </div>

                            <h1 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                                {service.name}
                            </h1>
                            
                            <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-3xl">
                                {service.description}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                                {[
                                    { icon: Clock, label: 'Timeframe', val: service.duration, color: 'text-blue-600' },
                                    { icon: ShieldCheck, label: 'Assurance', val: service.warranty || '30-Day', color: 'text-emerald-600' },
                                    { icon: Award, label: 'Quality', val: 'Gold Standard', color: 'text-purple-600' },
                                    { icon: HardHat, label: 'Personnel', val: 'Vetted', color: 'text-orange-600' },
                                ].map((item, idx) => (
                                    <div key={idx} className="bg-slate-50/50 p-5 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-md transition-all group">
                                        <item.icon className={`${item.color} mb-3 transition-transform group-hover:scale-110`} size={22} />
                                        <p className="text-[9px] uppercase font-black text-slate-400 tracking-tighter mb-0.5">{item.label}</p>
                                        <p className="text-xs font-black text-slate-800 uppercase truncate">{item.val}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="bg-white rounded-[2.5rem] p-6 md:p-12 border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-blue-50 rounded-xl text-blue-600 shadow-inner">
                                    <Sparkles size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Standard Inclusions</h3>
                                    <p className="text-slate-400 font-medium text-xs">Premium benefits in every booking</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {(service.features || ["Comprehensive Background Check", "Industrial Grade Equipment", "Safety Protocols", "24/7 Support"]).map((feat, i) => (
                                    <div key={i} className="flex items-center gap-4 p-5 bg-slate-50/50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white transition-all group">
                                        <div className="shrink-0 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                            <Check size={14} className="text-white" strokeWidth={4} />
                                        </div>
                                        <span className="font-bold text-slate-700 text-sm md:text-base">{feat}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="px-2">
                            <h3 className="text-xl font-black mb-6">Frequently Asked Questions</h3>
                            <Accordion type="single" collapsible className="space-y-3">
                                {[
                                    { q: "How do I cancel my booking?", a: "You can cancel up to 2 hours before the service via the app with a full refund." },
                                    { q: "Are spare parts included in the price?", a: "The service fee covers labor and basic consumables. Specialized spare parts are billed at actuals." }
                                ].map((item, i) => (
                                    <AccordionItem key={i} value={`faq-${i}`} className="border rounded-2xl px-6 bg-white overflow-hidden shadow-sm">
                                        <AccordionTrigger className="text-sm md:text-base font-bold text-slate-800 py-5">{item.q}</AccordionTrigger>
                                        <AccordionContent className="text-slate-500 text-sm pb-5">{item.a}</AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </section>
                    </div>

                    {/* RIGHT COLUMN: STICKY SIDEBAR */}
                    <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-6">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-200">
                            <div className="mb-8 text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Standard Rate</p>
                                <h2 className="text-5xl font-black text-slate-900 tracking-tighter">₹{service.price}</h2>
                                <p className="text-emerald-600 font-bold text-[10px] mt-2 flex items-center justify-center gap-1 uppercase tracking-tight">
                                    <TrendingUp size={12} /> Price Match Guarantee
                                </p>
                            </div>

                            <Button 
                                onClick={() => addToCart(service)}
                                disabled={isItemInCart}
                                className={`w-full h-16 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg transition-all active:scale-95 ${
                                    isItemInCart ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-900 text-white hover:bg-blue-700'
                                }`}
                            >
                                {isItemInCart ? <span className="flex items-center gap-2 italic">In Cart <CheckCircle2 size={18}/></span> : "Book Service"}
                            </Button>

                            <div className="mt-8 space-y-4 border-t border-slate-100 pt-6">
                                <div className="flex items-center gap-3 text-slate-500 group">
                                    <Lock size={16} className="text-blue-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-tight">100% Secure Checkout</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 group">
                                    <Info size={16} className="text-blue-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-tight">Free Rescheduling</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-linear-to-br from-indigo-600 to-blue-800 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-8">
                                    <Gift className="text-white/80" size={20} />
                                    <h3 className="text-lg font-black tracking-tight leading-none uppercase">Promotions</h3>
                                </div>
                                <div className="space-y-3">
                                    {offers.length > 0 ? (
                                        offers.map((offer, idx) => (
                                            <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 transition-all hover:bg-white/15">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-[8px] font-black bg-white text-indigo-700 px-2 py-0.5 rounded">PROMO</span>
                                                    <button onClick={() => copyOfferCode(offer.code)} className="text-white/60 hover:text-white"><Copy size={14}/></button>
                                                </div>
                                                <p className="font-bold text-sm mb-0.5">{offer.description}</p>
                                                <p className="text-xl font-black text-blue-200">{offer.discount}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs opacity-70 italic">No offers available today.</p>
                                    )}
                                </div>
                            </div>
                            <Tag className="absolute -right-12 -bottom-12 text-white/5 rotate-12" size={180} />
                        </div>
                    </div>
                </div>
            </div>

            {/* MOBILE ACTION BAR */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-xl border-t border-slate-100 z-50 flex items-center justify-between shadow-2xl">
                <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Total</p>
                    <p className="text-2xl font-black text-slate-900 leading-none">₹{service.price}</p>
                </div>
                <Button 
                    onClick={() => addToCart(service)}
                    disabled={isItemInCart}
                    className={`h-14 px-8 rounded-xl font-black text-xs uppercase tracking-widest ${isItemInCart ? 'bg-emerald-500' : 'bg-slate-900'}`}
                >
                    {isItemInCart ? "Added" : "Book Now"}
                </Button>
            </div>
        </div>
    );
};

export default ServiceDetailPage;