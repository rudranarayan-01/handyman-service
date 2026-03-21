import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
    CheckCircle2, Clock, ShieldCheck, ArrowLeft, Zap,
    Award, Check, StarIcon, Shield,
    HardHat, Sparkles, TrendingUp,
    Lock, MessageSquare,
    ChevronRight, Verified, Layers, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have a Shadcn Skeleton component
import api from '@/api/api';
import { toast } from 'sonner';
import RelatedServices from './RelatedServices';
import OffersSection from './OffersCard';

// --- UPDATED TYPES ---
interface Variant {
    _id: string;
    title: string;
    price: number;
    duration?: string;
    description?: string; // Added for better UX
}

interface Offer {
    code: string;
    discount: string;
    description: string;
}

interface Service {
    _id: string;
    name: string;
    slug: string;
    description: string;
    basePrice: number;
    image?: string;
    duration: string;
    variants?: Variant[];
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

// --- SKELETON COMPONENT ---
const ServiceDetailSkeleton = () => (
    <div className="min-h-screen bg-white">
        <Skeleton className="h-[45vh] md:h-[60vh] w-full" />
        <div className="max-w-7xl mx-auto px-4 -mt-24 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border">
                        <Skeleton className="h-6 w-24 mb-4" />
                        <Skeleton className="h-12 w-3/4 mb-4" />
                        <Skeleton className="h-20 w-full mb-8" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-4">
                    <Skeleton className="h-[400px] rounded-[2.5rem]" />
                </div>
            </div>
        </div>
    </div>
);

const ServiceDetailPage = () => {
    const { serviceSlug } = useParams<{ serviceSlug: string }>();
    const navigate = useNavigate();
    const { addToCart, cartItems } = useCart();

    const [service, setService] = useState<Service | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
    const [relatedServices, setRelatedServices] = useState<Service[]>([]);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPageData = async () => {
        if (!serviceSlug) return;
        setLoading(true);
        try {
            const [serviceRes, offersRes, relatedRes] = await Promise.all([
                api.get(`/services/details/${serviceSlug}`),
                api.get(`/offers/available`),
                api.get(`/services/related/${serviceSlug}`).catch(() => ({ data: { data: [] } }))
            ]);

            const sData = serviceRes.data.service || serviceRes.data.data || serviceRes.data;
            setService(sData);

            if (sData.variants && sData.variants.length > 0) {
                setSelectedVariant(sData.variants[0]);
            }

            const oData = offersRes.data.offers || offersRes.data || [];
            setOffers(Array.isArray(oData) ? oData : []);

            const rData = relatedRes.data.data || (Array.isArray(relatedRes.data) ? relatedRes.data : []);
            setRelatedServices(rData.slice(0, 3));
        } catch (err) {
            console.error("Data fetch error:", err);
            toast.error("Failed to load service details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPageData();
        window.scrollTo(0, 0);
    }, [serviceSlug]);

    const currentDisplayPrice = useMemo(() => {
        return selectedVariant ? selectedVariant.price : (service?.basePrice || 0);
    }, [selectedVariant, service]);

    const currentDuration = useMemo(() => {
        return selectedVariant?.duration || service?.duration || "Flexible";
    }, [selectedVariant, service]);

    const isItemInCart = useMemo(() => {
        const idToCheck = selectedVariant ? selectedVariant._id : service?._id;
        return cartItems.some((item: any) => (item.variantId || item._id) === idToCheck);
    }, [cartItems, service, selectedVariant]);

    const handleAddToCart = () => {
        if (!service) return;
        const cartItem = {
            ...service,
            _id: selectedVariant ? selectedVariant._id : service._id,
            variantId: selectedVariant?._id,
            variantName: selectedVariant?.title,
            price: currentDisplayPrice,
            duration: currentDuration
        };
        addToCart(cartItem);
        toast.success(`${service.name} added to cart!`);
    };

    if (loading) return <ServiceDetailSkeleton />;

    if (!service) return (
        <div className="h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
            <Zap size={40} className="text-slate-300" />
            <h3 className="text-2xl font-black text-slate-900">Service Not Found</h3>
            <Button onClick={() => navigate(-1)} className="rounded-xl h-12 px-6">Return to Directory</Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFDFD] pb-32 font-sans selection:bg-blue-600 selection:text-white">
            <Helmet>
                <title>{service.seo?.metaTitle || `${service.name} | Professional Services`}</title>
                <meta name="description" content={service.seo?.metaDescription || service.description} />
            </Helmet>

            {/* --- HERO SECTION --- */}
            <div className="relative h-[45vh] md:h-[60vh] w-full overflow-hidden">
                <img
                    src={service.image || '/placeholder.jpg'}
                    className="w-full h-full object-cover"
                    alt={service.name}
                />
                <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-[#FDFDFD]" />
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 p-3 bg-white/20 backdrop-blur-xl rounded-xl text-white border border-white/20 hover:bg-white hover:text-black transition-all z-20"
                >
                    <ArrowLeft size={20} />
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 md:-mt-40 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-8 space-y-8">
                        <section className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-sm border border-slate-100">
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <span className="px-4 py-1.5 bg-blue-600 text-[10px] font-black text-white rounded-lg uppercase tracking-widest flex items-center gap-1.5">
                                    <Verified size={12} /> {service.category?.name || 'Verified Pro'}
                                </span>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-100 font-bold text-xs">
                                    <StarIcon size={14} fill="currentColor" />
                                    <span>{service.rating || '4.9'}</span>
                                    <span className="text-slate-400 font-medium">(1.2k+ reviews)</span>
                                </div>
                            </div>

                            <h1 className="text-3xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                                {service.name}
                            </h1>
                            <p className="text-slate-500 text-base md:text-xl leading-relaxed max-w-3xl mb-12">
                                {service.description}
                            </p>

                            {/* --- DYNAMIC VARIANT PICKER --- */}
                            {service.variants && service.variants.length > 0 && (
                                <div className="mb-12">
                                    <div className="flex items-center gap-2 mb-6">
                                        <Layers size={18} className="text-blue-600" />
                                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Choose Package Variant</h3>
                                    </div>
                                    <div className="space-y-4">
                                        {service.variants.map((v) => (
                                            <div
                                                key={v._id}
                                                onClick={() => setSelectedVariant(v)}
                                                className={`cursor-pointer p-6 rounded-[1.5rem] border-2 transition-all duration-300 relative group ${selectedVariant?._id === v._id
                                                        ? 'border-blue-600 bg-blue-50/40'
                                                        : 'border-slate-100 bg-slate-50/50 hover:border-slate-300'
                                                    }`}
                                            >
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className={`font-black text-lg uppercase tracking-tight ${selectedVariant?._id === v._id ? 'text-blue-700' : 'text-slate-800'}`}>
                                                                {v.title}
                                                            </p>
                                                            {selectedVariant?._id === v._id && <CheckCircle2 size={16} className="text-blue-600" />}
                                                        </div>
                                                        <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-2">
                                                            {v.description || `Professional ${v.title} services tailored for your home needs.`}
                                                        </p>
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                                                <Clock size={12} /> {v.duration || service.duration}
                                                            </span>
                                                            <span className="text-[10px] font-bold text-blue-600 uppercase flex items-center gap-1">
                                                                <Info size={12} /> Standard Inclusions
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex md:flex-col items-center md:items-end justify-between md:justify-center">
                                                        <p className="text-2xl font-black text-slate-900">₹{v.price}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Tax Incl.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { icon: Clock, label: 'Timeframe', val: currentDuration, color: 'text-blue-600' },
                                    { icon: ShieldCheck, label: 'Assurance', val: service.warranty || '30-Day', color: 'text-emerald-600' },
                                    { icon: Award, label: 'Quality', val: 'Gold Standard', color: 'text-purple-600' },
                                    { icon: HardHat, label: 'Personnel', val: 'Expert Vetted', color: 'text-orange-600' },
                                ].map((item, idx) => (
                                    <div key={idx} className="bg-slate-50/50 p-5 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-md transition-all group">
                                        <item.icon className={`${item.color} mb-3 transition-transform group-hover:scale-110`} size={24} />
                                        <p className="text-[9px] uppercase font-black text-slate-400 tracking-tighter mb-0.5">{item.label}</p>
                                        <p className="text-xs font-black text-slate-800 uppercase truncate">{item.val}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Inclusions Card */}
                        <section className="bg-white rounded-[2.5rem] p-6 md:p-12 border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-blue-50 rounded-xl text-blue-600 shadow-inner">
                                    <Sparkles size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Standard Inclusions</h3>
                                    <p className="text-slate-400 font-medium text-xs">Everything included in your premium booking</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {(service.features || ["Background Checked Pros", "Industrial Grade Equipment", "Post-Service Cleaning", "Premium Materials"]).map((feat, i) => (
                                    <div key={i} className="flex items-center gap-4 p-5 bg-slate-50/50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white transition-all group">
                                        <div className="shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                            <Check size={16} className="text-white" strokeWidth={4} />
                                        </div>
                                        <span className="font-bold text-slate-700 text-sm md:text-base">{feat}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* TESTIMONIALS */}
                        <section className="bg-slate-900 rounded-[2.5rem] p-8 md:p-14 text-white overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-10 opacity-10">
                                <MessageSquare size={200} />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-10">
                                    <div className="h-px w-12 bg-blue-500" />
                                    <span className="text-blue-400 font-black uppercase tracking-[0.3em] text-[10px]">Client Feedback</span>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black mb-12 leading-tight">Trusted by over <span className="text-blue-500">50,000+</span> households.</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4 italic text-slate-300 border-l-2 border-blue-600 pl-6">
                                        <p className="text-lg">"The professionalism was unexpected. From the uniform to the high-end tools, HouseXpertz is the gold standard."</p>
                                        <p className="text-white font-bold text-sm not-italic">Ananya Rao • Mumbai</p>
                                    </div>
                                    <div className="hidden md:block space-y-4 italic text-slate-300 border-l-2 border-slate-700 pl-6">
                                        <p className="text-lg">"Fast, reliable, and worth the price. The 30-day warranty gives me total peace of mind."</p>
                                        <p className="text-white font-bold text-sm not-italic">Karan Malhotra • Delhi</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* FAQ */}
                        <section className="px-2">
                            <h3 className="text-2xl font-black mb-6 text-slate-900">Expert Guidance (FAQ)</h3>
                            <Accordion type="single" collapsible className="space-y-3">
                                {[
                                    { q: "How do I cancel or reschedule?", a: "Cancel or reschedule up to 3 hours before the slot via dashboard with no penalty." },
                                    { q: "Are spare parts included?", a: "Price covers labor. Specialized parts are sourced at MRP with transparent billing." },
                                    { q: "What does the 30-day warranty cover?", a: "If the issue recurs within 30 days, we fix it entirely free of charge." }
                                ].map((item, i) => (
                                    <AccordionItem key={i} value={`faq-${i}`} className="border rounded-2xl px-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                                        <AccordionTrigger className="font-bold text-slate-800 py-6 hover:no-underline">{item.q}</AccordionTrigger>
                                        <AccordionContent className="text-slate-500 pb-6">{item.a}</AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </section>
                    </div>

                    {/* RIGHT COLUMN: STICKY SIDEBAR */}
                    <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-6">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-200">
                            <div className="mb-8 text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                    {selectedVariant ? `Selected: ${selectedVariant.title}` : 'Estimated Total'}
                                </p>
                                <div className="flex items-center justify-center gap-2">
                                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter">₹{currentDisplayPrice}</h2>
                                    <span className="text-slate-300 line-through text-lg font-bold">₹{Math.round(currentDisplayPrice * 1.2)}</span>
                                </div>
                                <p className="text-emerald-600 font-bold text-[10px] mt-3 flex items-center justify-center gap-1 uppercase tracking-tight bg-emerald-50 py-1.5 rounded-full w-fit mx-auto px-6">
                                    <TrendingUp size={12} /> Lowest Price Guaranteed
                                </p>
                            </div>

                            <Button
                                onClick={handleAddToCart}
                                disabled={isItemInCart}
                                className={`w-full h-16 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${isItemInCart ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-900 text-white hover:bg-blue-600'
                                    }`}
                            >
                                {isItemInCart ? (
                                    <>In Your Cart <CheckCircle2 size={20} /></>
                                ) : (
                                    <>Book Service Now <ChevronRight size={20} /></>
                                )}
                            </Button>

                            <div className="mt-8 space-y-4 border-t border-slate-100 pt-6">
                                <div className="flex items-center gap-3 text-slate-500">
                                    <Lock size={14} className="text-blue-600" />
                                    <span className="text-[10px] font-bold uppercase tracking-tight">SSL Encrypted Payment</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500">
                                    <Shield size={14} className="text-blue-600" />
                                    <span className="text-[10px] font-bold uppercase tracking-tight">Service Quality Warranty</span>
                                </div>
                            </div>
                        </div>

                        {/* Offers */}
                        {offers.length > 0 && <OffersSection offers={offers} />}
                    </div>
                </div>

                {/* RELATED SERVICES */}
                {relatedServices.length > 0 && (
                    <div className="mt-20">
                        <RelatedServices services={relatedServices} currentServiceName={service.name} />
                    </div>
                )}
            </div>

            {/* MOBILE ACTION BAR */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-xl border-t border-slate-100 z-50 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom duration-500">
                <div className="flex flex-col">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                        {selectedVariant ? selectedVariant.title : 'Instant Booking'}
                    </p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-black text-slate-900">₹{currentDisplayPrice}</p>
                        <span className="text-slate-300 line-through text-xs font-bold">₹{Math.round(currentDisplayPrice * 1.2)}</span>
                    </div>
                </div>
                <Button
                    onClick={handleAddToCart}
                    disabled={isItemInCart}
                    className={`h-14 px-8 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg ${isItemInCart ? 'bg-emerald-500' : 'bg-blue-600 active:scale-95'}`}
                >
                    {isItemInCart ? "In Your Cart" : "Book Now"}
                </Button>
            </div>
        </div>
    );
};

export default ServiceDetailPage;