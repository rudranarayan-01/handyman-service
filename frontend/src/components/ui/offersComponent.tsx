import React, { useState, useEffect } from 'react';
import { Ticket, ChevronRight, Loader2, CheckCircle2, X, Gift } from 'lucide-react';
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
        setIsValidating(true);
        try {
            const res = await api.post('/offers/validate', { code, cartTotal });
            if (res.data.success) {
                onApply(res.data.discountAmount, code);
                toast.success(`Coupon "${code}" applied!`);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Invalid Coupon");
        } finally {
            setIsValidating(false);
        }
    };

    if (loading) return (
        <div className="p-4 bg-white border border-slate-100 rounded-[2rem] animate-pulse space-y-3">
            <div className="h-3 w-20 bg-slate-100 rounded" />
            <div className="h-12 w-full bg-slate-50 rounded-xl" />
        </div>
    );

    return (
        <div className="mb-4 space-y-3">
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-5 shadow-sm">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Gift size={14} className="text-blue-600" /> Available Offers
                </h3>
                
                {!appliedCode ? (
                    <>
                        <div className="relative flex items-center group">
                            <Ticket className="absolute left-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                            <Input 
                                placeholder="Enter coupon" 
                                className="pl-11 pr-20 h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-blue-600 font-bold text-sm"
                                value={manualCode}
                                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                            />
                            <Button 
                                variant="ghost" 
                                disabled={!manualCode || isValidating}
                                onClick={() => handleApply(manualCode)}
                                className="absolute right-2 text-blue-600 font-black hover:bg-blue-100/50 h-10 px-4 rounded-xl"
                            >
                                {isValidating ? <Loader2 className="animate-spin w-4 h-4" /> : "APPLY"}
                            </Button>
                        </div>

                        <div className="mt-4 space-y-2">
                            {offers.map((offer) => (
                                <button 
                                    key={offer._id}
                                    onClick={() => handleApply(offer.code)}
                                    className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-blue-50/50 border border-transparent hover:border-blue-100 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-xs font-black px-2 py-1 bg-white border border-dashed border-blue-300 rounded text-blue-600">
                                            {offer.code}
                                        </div>
                                        <p className="text-[11px] text-slate-500 font-bold line-clamp-1">{offer.description}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600" />
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 p-4 rounded-2xl">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="text-emerald-600 w-5 h-5" />
                            <div>
                                <p className="text-[10px] font-black text-emerald-800 uppercase italic">Code Applied</p>
                                <p className="text-sm font-black text-emerald-700">{appliedCode}</p>
                            </div>
                        </div>
                        <button onClick={() => onApply(0, null)} className="p-2 hover:bg-emerald-100 rounded-full">
                            <X className="w-4 h-4 text-emerald-600" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OffersSection;