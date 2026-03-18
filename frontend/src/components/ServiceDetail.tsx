import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
    CheckCircle2, Clock, ShieldCheck, ArrowLeft, Zap, 
    Award, Check, StarIcon, Shield, 
    Info, HardHat, Sparkles, TrendingUp, 
    ShieldIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import api from '@/api/api';

// --- SUB-COMPONENTS ---

const DetailSkeleton = () => (
    <div className="min-h-screen bg-white">
        <div className="h-[50vh] w-full bg-slate-100 animate-pulse" />
        <div className="max-w-6xl mx-auto px-6 -mt-32 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 space-y-6">
                    <div className="h-6 w-24 bg-slate-100 rounded animate-pulse" />
                    <div className="h-16 w-3/4 bg-slate-100 rounded-2xl animate-pulse" />
                    <div className="h-24 w-full bg-slate-50 rounded-2xl animate-pulse" />
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => <div key={i} className="h-20 bg-slate-50 rounded-3xl animate-pulse" />)}
                    </div>
                </div>
            </div>
            <div className="lg:col-span-4 h-96 bg-slate-100 rounded-[2.5rem] animate-pulse" />
        </div>
    </div>
);

// --- MAIN COMPONENT ---

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
}

const ServiceDetailPage = () => {
    const { serviceSlug } = useParams<{ serviceSlug: string }>(); 
    const navigate = useNavigate();
    const { addToCart, cartItems } = useCart();
    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!serviceSlug) return;
            setLoading(true);
            try {
                const res = await api.get(`/services/details/${serviceSlug}`);
                // Adaptive data mapping
                const data = res.data.service || res.data.data || res.data;
                setService(data);
            } catch (err) {
                console.error("Fetch error:", err);
                setService(null);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
        window.scrollTo(0, 0);
    }, [serviceSlug]);

    const isItemInCart = useMemo(() => 
        cartItems.some((item: any) => item._id === service?._id), 
    [cartItems, service]);

    if (loading) return <DetailSkeleton />;

    if (!service) return (
        <div className="h-screen flex flex-col items-center justify-center gap-6 bg-slate-50">
            <div className="p-6 bg-white rounded-full shadow-xl">
                <Zap size={48} className="text-blue-500 fill-blue-500" />
            </div>
            <div className="text-center">
                <h3 className="text-2xl font-black text-slate-900">Service Not Found</h3>
                <p className="text-slate-500 mt-2">The link might be broken or the service was moved.</p>
            </div>
            <Button onClick={() => navigate(-1)} variant="outline" className="rounded-2xl px-8 h-14 font-bold border-2">
                Return to Directory
            </Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 md:pb-32 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Helmet>
                <title>{service.name} | HouseXpertz</title>
                <meta name="description" content={service.description} />
            </Helmet>

            {/* --- HERO SECTION --- */}
            <div className="relative h-[40vh] md:h-[65vh] w-full overflow-hidden bg-slate-900">
                <img 
                    src={service.image || '/placeholder.jpg'} 
                    className="w-full h-full object-cover opacity-70 transition-transform duration-1000 hover:scale-110" 
                    alt={service.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-transparent to-black/40" />
                
                <button 
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 p-4 bg-white/10 backdrop-blur-xl rounded-2xl text-white border border-white/20 hover:bg-white hover:text-black transition-all duration-300 z-20 shadow-2xl"
                >
                    <ArrowLeft size={22} />
                </button>
            </div>

            {/* --- CONTENT LAYOUT --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 md:-mt-40 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT COLUMN: PRIMARY INFO */}
                    <div className="lg:col-span-8 space-y-8">
                        <section className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                            <div className="flex flex-wrap items-center gap-3 mb-8">
                                <span className="px-4 py-1.5 bg-blue-600 text-[10px] font-black text-white rounded-lg uppercase tracking-[0.2em]">
                                    {service.category?.name || 'PREMIUM'}
                                </span>
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-lg border border-amber-100">
                                    <StarIcon size={14} fill="currentColor" />
                                    <span className="text-sm font-black">{service.rating || '4.9'}</span>
                                </div>
                            </div>

                            <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.05] mb-8">
                                {service.name}
                            </h1>
                            
                            <p className="text-slate-500 text-lg md:text-2xl leading-relaxed font-medium max-w-3xl">
                                {service.description}
                            </p>

                            {/* BENTO STATS GRID */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                                {[
                                    { icon: Clock, label: 'Duration', val: service.duration, col: 'text-emerald-600', bg: 'bg-emerald-50/50' },
                                    { icon: ShieldCheck, label: 'Warranty', val: service.warranty || '30 Days', col: 'text-blue-600', bg: 'bg-blue-50/50' },
                                    { icon: Award, label: 'Rank', val: 'Top 1%', col: 'text-purple-600', bg: 'bg-purple-50/50' },
                                    { icon: HardHat, label: 'Expert', val: 'Verified', col: 'text-orange-600', bg: 'bg-orange-50/50' },
                                ].map((item, idx) => (
                                    <div key={idx} className={`${item.bg} p-6 rounded-[2rem] border border-white shadow-sm transition-all hover:shadow-md hover:scale-[1.02]`}>
                                        <item.icon className={`${item.col} mb-4`} size={24} />
                                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">{item.label}</p>
                                        <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{item.val}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* FEATURES SECTION */}
                        <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                                    <Sparkles size={24} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Standard Inclusions</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {(service.features || ["Fully Background Verified", "Professional Equipment Included", "Post-Service Cleanup", "Safety-First Protocol"]).map((feat, i) => (
                                    <div key={i} className="flex items-center gap-4 p-6 bg-slate-50/80 rounded-3xl border border-transparent hover:border-blue-100 hover:bg-white transition-all group">
                                        <div className="shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Check size={14} className="text-white" strokeWidth={4} />
                                        </div>
                                        <span className="font-bold text-slate-700">{feat}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN: STICKY BOOKING CARD */}
                    <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-6">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-slate-200">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Standard Price</p>
                                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter">₹{service.price}</h2>
                                </div>
                                <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl border border-emerald-100">
                                    <TrendingUp size={20} />
                                </div>
                            </div>

                            <Button 
                                onClick={() => addToCart(service)}
                                disabled={isItemInCart}
                                className={`w-full h-20 rounded-[1.5rem] font-black text-lg uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
                                    isItemInCart 
                                    ? 'bg-emerald-500 hover:bg-emerald-500 cursor-default' 
                                    : 'bg-slate-900 hover:bg-blue-600 text-white'
                                }`}
                            >
                                {isItemInCart ? (
                                    <span className="flex items-center gap-3">In Your Bag <CheckCircle2 /></span>
                                ) : (
                                    <span className="flex items-center gap-3">Reserve Now <Shield size={20} /></span>
                                )}
                            </Button>

                            <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
                                <div className="flex items-center gap-4 text-slate-400">
                                    <ShieldIcon size={18} className="text-blue-500" />
                                    <span className="text-xs font-bold uppercase tracking-tight">100% Satisfaction Guarantee</span>
                                </div>
                                <div className="flex items-center gap-4 text-slate-400">
                                    <Info size={18} className="text-blue-500" />
                                    <span className="text-xs font-bold uppercase tracking-tight">Free Cancellation up to 2hrs</span>
                                </div>
                            </div>
                        </div>

                        {/* TRUST PROMISE */}
                        <div className="bg-slate-950 text-white rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl group">
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:rotate-12 transition-transform">
                                    <ShieldCheck className="text-blue-400" size={24} />
                                </div>
                                <h4 className="font-black text-2xl mb-3 tracking-tight">The HouseXpertz Promise</h4>
                                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                                    Professionalism isn't just a word for us—it's the standard. Every pro is vetted through a 5-step background check.
                                </p>
                            </div>
                            <Zap className="absolute -right-6 -bottom-6 text-white/5 transition-colors group-hover:text-blue-500/10" size={160} />
                        </div>
                    </div>
                </div>

                {/* FAQ & HELP */}
                <div className="max-w-4xl mx-auto mt-24">
                    <div className="flex flex-col items-center text-center mb-16 space-y-4">
                        <div className="w-16 h-1 bg-blue-600 rounded-full" />
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Service FAQ</h2>
                        <p className="text-slate-500 font-medium">Everything you need to know before booking</p>
                    </div>
                    
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {[
                            { q: "What if I am not satisfied with the quality?", a: "We offer a 7-day service warranty. If anything isn't up to mark, we'll send a senior professional to fix it at zero cost." },
                            { q: "Do I need to provide tools or supplies?", a: "No. Our experts arrive fully equipped with professional-grade tools and industry-standard supplies." },
                            { q: "Are the prices fixed?", a: "Yes, the price you see is the final price. No hidden 'convenience' or 'travel' fees will be added at checkout." }
                        ].map((faq, i) => (
                            <AccordionItem key={i} value={`item-${i}`} className="border border-slate-200 rounded-[2rem] px-8 bg-white shadow-sm overflow-hidden">
                                <AccordionTrigger className="hover:no-underline font-black text-slate-800 py-7 text-left text-lg">
                                    {faq.q}
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-500 font-medium text-base pb-8 leading-relaxed">
                                    {faq.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
            
            {/* MOBILE FLOATING ACTION BAR */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-2xl border-t border-slate-100 z-[100] flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
               <div className="pl-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total</p>
                  <p className="text-2xl font-black text-slate-900 leading-none tracking-tighter">₹{service.price}</p>
               </div>
               <Button 
                    onClick={() => addToCart(service)}
                    disabled={isItemInCart}
                    className={`h-14 px-10 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-all ${
                        isItemInCart ? 'bg-emerald-500' : 'bg-slate-900'
                    }`}
                >
                    {isItemInCart ? "Added" : "Book Now"}
                </Button>
            </div>
        </div>
    );
};

export default ServiceDetailPage;