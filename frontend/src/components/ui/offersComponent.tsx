import React, { useState, useEffect } from 'react';
import { ChevronRight, Loader2, CheckCircle2, X, Gift, Tag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import api from '@/api/api';

interface Offer {
    _id: string;
    code: string;
    description: string;
    discountValue: number;
}

interface OffersSectionProps {
    cartTotal: number;
    onApply: (discount: number, code: string | null) => void;
    appliedCode: string | null;
}

// ─── IMPROVED SKELETON ───
const OfferSkeleton = () => (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-100 rounded-full animate-pulse" />
            <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="h-14 w-full bg-slate-50 rounded-2xl animate-pulse" />
        <div className="space-y-2">
            {[1, 2].map((i) => (
                <div key={i} className="h-12 w-full bg-slate-50/50 rounded-xl animate-pulse" />
            ))}
        </div>
    </div>
);

const OffersSection: React.FC<OffersSectionProps> = ({ cartTotal, onApply, appliedCode }) => {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [manualCode, setManualCode] = useState("");
    const [isValidating, setIsValidating] = useState(false);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const res = await api.get('/offers/available');
                setOffers(res.data.offers || []);
            } catch (err) {
                console.error("Offers fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOffers();
    }, []);

    const handleApply = async (code: string) => {
        if (!code) return;
        setIsValidating(true);
        try {
            const res = await api.post('/offers/validate', { code: code.trim().toUpperCase(), cartTotal });
            if (res.data.success) {
                onApply(res.data.discountAmount, code.toUpperCase());
                setManualCode(""); // Clear input on success
                toast.success(`Savings of ₹${res.data.discountAmount} applied!`);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Invalid Coupon");
        } finally {
            setIsValidating(false);
        }
    };

    if (loading) return <OfferSkeleton />;

    return (
        <div className="w-full transition-all duration-300">
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2">
                        <Gift size={14} className="text-blue-600" /> Offers & Benefits
                    </h3>
                    {offers.length > 0 && !appliedCode && (
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                            {offers.length} AVAILABLE
                        </span>
                    )}
                </div>
                
                {!appliedCode ? (
                    <div className="space-y-4">
                        {/* Input Area */}
                        <div className="relative flex items-center group">
                            <Tag className="absolute left-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                            <Input 
                                placeholder="TYPE COUPON CODE" 
                                className="pl-11 pr-24 h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-blue-600 font-bold text-sm placeholder:text-slate-400 uppercase tracking-wider"
                                value={manualCode}
                                onChange={(e) => setManualCode(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleApply(manualCode)}
                            />
                            <Button 
                                variant="ghost" 
                                disabled={!manualCode || isValidating}
                                onClick={() => handleApply(manualCode)}
                                className="absolute right-2 text-blue-600 font-black hover:bg-blue-100/50 h-10 px-4 rounded-xl text-xs"
                            >
                                {isValidating ? <Loader2 className="animate-spin w-4 h-4" /> : "APPLY"}
                            </Button>
                        </div>

                        {/* List Area */}
                        <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
                            {offers.length > 0 ? (
                                offers.map((offer) => (
                                    <button 
                                        key={offer._id}
                                        onClick={() => handleApply(offer.code)}
                                        className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-blue-50/50 border border-transparent hover:border-blue-100 transition-all group text-left"
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="min-w-[70px] text-[10px] font-black px-2 py-1.5 bg-white border border-dashed border-blue-300 rounded-lg text-blue-600 text-center shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:border-solid transition-all">
                                                {offer.code}
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-[11px] text-slate-700 font-bold line-clamp-1 group-hover:text-slate-900">
                                                    {offer.description}
                                                </p>
                                                <p className="text-[9px] text-slate-400 font-medium">Click to apply automatically</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                    </button>
                                ))
                            ) : (
                                <p className="text-center py-4 text-xs font-bold text-slate-400 italic">
                                    No coupons available for this order.
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Success State */
                    <div className="flex items-center justify-between bg-emerald-50/80 border border-emerald-100 p-4 rounded-3xl animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                                <CheckCircle2 className="text-emerald-600 w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-emerald-800 uppercase tracking-widest">Savings Applied</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-black text-emerald-700 tracking-tight">{appliedCode}</span>
                                    <div className="h-1 w-1 bg-emerald-300 rounded-full" />
                                    <span className="text-[11px] font-bold text-emerald-600">Applied</span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => onApply(0, null)} 
                            className="w-8 h-8 flex items-center justify-center hover:bg-emerald-100 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4 text-emerald-600" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OffersSection;