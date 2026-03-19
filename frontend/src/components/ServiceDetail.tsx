import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
    CheckCircle2, Clock, ShieldCheck, ArrowLeft, Zap,
    Award, Check, StarIcon, Shield,
    HardHat, Sparkles, TrendingUp,
    Copy, Lock, Gift, Tag, MessageSquare,
    ChevronRight, Verified
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
    slug: string;
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

            // 1. Extract Service Data
            const sData = serviceRes.data.service || serviceRes.data.data || serviceRes.data;
            setService(sData);

            // 2. Extract Offers
            const oData = offersRes.data.offers || offersRes.data || [];
            setOffers(Array.isArray(oData) ? oData : []);

            // 3. Extract Related Services (THE FIX)
            // We look for relatedRes.data.data because your backend returns { success: true, data: [...] }
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

    // Structured Data for Google (SEO)
    const structuredData = useMemo(() => {
        if (!service) return null;
        return {
            "@context": "https://schema.org/",
            "@type": "Service",
            "name": service.name,
            "description": service.description,
            "provider": {
                "@type": "LocalBusiness",
                "name": "HouseXpertz"
            },
            "areaServed": "India",
            "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Home Services",
                "itemListElement": [
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": service.name
                        },
                        "price": service.price,
                        "priceCurrency": "INR"
                    }
                ]
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": service.rating || "4.9",
                "reviewCount": "1240"
            }
        };
    }, [service]);

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
                <title>{service.seo?.metaTitle || `${service.name} | Professional Home Services`}</title>
                <meta name="description" content={service.seo?.metaDescription || service.description} />
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            </Helmet>

            {/* --- HERO SECTION --- */}
            <div className="relative h-[45vh] md:h-[60vh] w-full overflow-hidden">
                <img
                    src={service.image || '/placeholder.jpg'}
                    className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                    alt={`${service.name} - HouseXpertz Professional Service`}
                    fetchPriority="high"
                />
                <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-[#FDFDFD]" />

                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 p-3 bg-white/10 backdrop-blur-xl rounded-xl text-white border border-white/20 hover:bg-white hover:text-black transition-all z-20 shadow-xl"
                >
                    <ArrowLeft size={20} />
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 md:-mt-40 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Main Detail Card */}
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

                            <p className="text-slate-500 text-base md:text-xl leading-relaxed max-w-3xl">
                                {service.description}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                                {[
                                    { icon: Clock, label: 'Timeframe', val: service.duration, color: 'text-blue-600' },
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
                                {(service.features || ["Background Checked Pros", "Industrial Grade Equipment", "Post-Service Cleaning", "Insurance Coverage"]).map((feat, i) => (
                                    <div key={i} className="flex items-center gap-4 p-5 bg-slate-50/50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white transition-all group">
                                        <div className="shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                            <Check size={16} className="text-white" strokeWidth={4} />
                                        </div>
                                        <span className="font-bold text-slate-700 text-sm md:text-base">{feat}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* --- BLACK CARD: TESTIMONIALS --- */}
                        <section className="bg-slate-900 rounded-[2.5rem] p-8 md:p-14 text-white overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-10 opacity-10">
                                <MessageSquare size={200} />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-10">
                                    <div className="h-px w-12 bg-blue-500" />
                                    <span className="text-blue-400 font-black uppercase tracking-[0.3em] text-[10px]">Client Feedback</span>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black mb-12 leading-tight">Trusted by over <span className="text-blue-500">50,000+</span> happy households.</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4 italic text-slate-300 border-l-2 border-blue-600 pl-6">
                                        <p className="text-lg">"The level of professionalism was unexpected. From the uniform to the high-end tools, HouseXpertz really is the gold standard in home services."</p>
                                        <div className="flex items-center gap-3 not-italic">
                                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-black">AR</div>
                                            <div>
                                                <p className="text-white font-bold text-sm">Ananya Rao</p>
                                                <p className="text-slate-500 text-[10px] uppercase">Verified Customer • Mumbai</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden md:block space-y-4 italic text-slate-300 border-l-2 border-slate-700 pl-6">
                                        <p className="text-lg">"Fast, reliable, and actually worth the price. The 30-day warranty gives me peace of mind that I never had with local technicians."</p>
                                        <div className="flex items-center gap-3 not-italic">
                                            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center font-black">KM</div>
                                            <div>
                                                <p className="text-white font-bold text-sm">Karan Malhotra</p>
                                                <p className="text-slate-500 text-[10px] uppercase">Verified Customer • Delhi</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* FAQ Section */}
                        <section className="px-2">
                            <h3 className="text-2xl font-black mb-6 text-slate-900">Expert Guidance (FAQ)</h3>
                            <Accordion type="single" collapsible className="space-y-3">
                                {[
                                    { q: "How do I cancel or reschedule my booking?", a: "We offer total flexibility. You can cancel or reschedule up to 3 hours before the time slot via our dashboard with no penalty." },
                                    { q: "Are spare parts included in the flat rate?", a: "The price shown covers professional labor and standard consumables. Specialized parts are sourced at MRP with transparent billing." },
                                    { q: "What does the 30-day warranty cover?", a: "If the same issue recurs within 30 days, we send a senior expert to fix it entirely free of charge." }
                                ].map((item, i) => (
                                    <AccordionItem key={i} value={`faq-${i}`} className="border rounded-2xl px-6 bg-white overflow-hidden shadow-sm hover:border-blue-200 transition-colors">
                                        <AccordionTrigger className="text-sm md:text-base font-bold text-slate-800 py-6 hover:no-underline">{item.q}</AccordionTrigger>
                                        <AccordionContent className="text-slate-500 text-sm pb-6 leading-relaxed">{item.a}</AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </section>
                    </div>

                    {/* RIGHT COLUMN: STICKY SIDEBAR */}
                    <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-6">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-200">
                            <div className="mb-8 text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Standard Rate</p>
                                <div className="flex items-center justify-center gap-2">
                                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter">₹{service.price}</h2>
                                    <span className="text-slate-300 line-through text-lg font-bold">₹{Math.round(service.price * 1.2)}</span>
                                </div>
                                <p className="text-emerald-600 font-bold text-[10px] mt-3 flex items-center justify-center gap-1 uppercase tracking-tight bg-emerald-50 py-1 rounded-full w-fit mx-auto px-4">
                                    <TrendingUp size={12} /> Lowest Price Guaranteed
                                </p>
                            </div>

                            <Button
                                onClick={() => addToCart(service)}
                                disabled={isItemInCart}
                                className={`w-full h-16 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${isItemInCart ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-900 text-white hover:bg-blue-600'
                                    }`}
                            >
                                {isItemInCart ? (
                                    <>Added to Cart <CheckCircle2 size={20} /></>
                                ) : (
                                    <>Book Service Now <ChevronRight size={20} /></>
                                )}
                            </Button>

                            <div className="mt-8 space-y-4 border-t border-slate-100 pt-6">
                                <div className="flex items-center gap-3 text-slate-500 group">
                                    <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600"><Lock size={14} /></div>
                                    <span className="text-[10px] font-bold uppercase tracking-tight">SSL Encrypted Payment</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 group">
                                    <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600"><Shield size={14} /></div>
                                    <span className="text-[10px] font-bold uppercase tracking-tight">Service Quality Warranty</span>
                                </div>
                            </div>
                        </div>

                        {/* Promotion Card */}
                        <div className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-8">
                                    <Gift className="text-white/80" size={20} />
                                    <h3 className="text-lg font-black tracking-tight leading-none uppercase italic">Hot Offers</h3>
                                </div>
                                <div className="space-y-3">
                                    {offers.length > 0 ? (
                                        offers.map((offer, idx) => (
                                            <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 transition-all hover:bg-white/15 cursor-pointer" onClick={() => copyOfferCode(offer.code)}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-[8px] font-black bg-white text-indigo-700 px-2 py-0.5 rounded uppercase">Apply on Checkout</span>
                                                    <Copy size={14} className="text-white/60" />
                                                </div>
                                                <p className="font-bold text-sm mb-0.5">{offer.description}</p>
                                                <p className="text-2xl font-black text-blue-200">{offer.discount}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs opacity-70 italic">Check back later for seasonal promos.</p>
                                    )}
                                </div>
                            </div>
                            <Tag className="absolute -right-12 -bottom-12 text-white/5 rotate-12" size={180} />
                        </div>
                    </div>
                </div>

                {/* --- RELATED SERVICES SECTION --- */}
                {relatedServices.length > 0 && (
                    <section className="mt-24 border-t border-slate-100 pt-20">
                        <div className="flex items-end justify-between mb-10">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">You might also need</h3>
                                <p className="text-slate-400 font-medium">Frequently booked along with {service.name}</p>
                            </div>
                            <Link to="/services" className="text-blue-600 font-bold text-sm hover:underline hidden md:block">View all services</Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedServices.map((rel) => (
                                <Link
                                    to={`/services/${rel.slug}`}
                                    key={rel._id}
                                    className="bg-white rounded-[2rem] p-4 border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
                                >
                                    <div className="h-48 rounded-2xl overflow-hidden mb-4">
                                        <img src={rel.image} alt={rel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <h4 className="font-black text-slate-800 mb-1">{rel.name}</h4>
                                    <div className="flex justify-between items-center">
                                        <p className="text-blue-600 font-black">₹{rel.price}</p>
                                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><StarIcon size={12} fill="currentColor" className="text-amber-400" /> {rel.rating || '4.8'}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* MOBILE ACTION BAR */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-xl border-t border-slate-100 z-50 flex items-center justify-between shadow-2xl animate-in slide-in-from-bottom duration-500">
                <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Instant Booking</p>
                    <p className="text-2xl font-black text-slate-900 leading-none">₹{service.price}</p>
                </div>
                <Button
                    onClick={() => addToCart(service)}
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