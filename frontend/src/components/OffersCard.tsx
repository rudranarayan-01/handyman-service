import React from 'react';
import { Gift, Copy, Tag } from 'lucide-react';
import { toast } from 'sonner';

interface Offer {
    code: string;
    discount: string;
    description: string;
}

interface OffersSectionProps {
    offers: Offer[];
}

const OffersSection: React.FC<OffersSectionProps> = ({ offers }) => {
    const copyOfferCode = (code: string) => {
        navigator.clipboard.writeText(code);
        toast.success(`Code ${code} copied!`);
    };

    return (
        <div className="bg-linear-to-br from-blue-700 to-indigo-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                    <Gift className="text-white/80" size={20} />
                    <h3 className="text-lg font-black tracking-tight uppercase italic">Hot Offers</h3>
                </div>
                <div className="space-y-3">
                    {offers.length > 0 ? (
                        offers.map((offer, idx) => (
                            <div 
                                key={idx} 
                                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 transition-all hover:bg-white/15 cursor-pointer" 
                                onClick={() => copyOfferCode(offer.code)}
                            >
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
    );
};

export default OffersSection;