import React from 'react';
import { ShieldCheck, Ticket, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import OffersSection from './ui/offersComponent';

interface OrderSummaryProps {
    totalAmount: number;
    serviceFee: number;
    discount: number;
    appliedCode: string | null;
    grandTotal: number;
    isSubmitting: boolean;
    canPlaceOrder: boolean;
    onApplyOffer: (amt: number, code: string | null) => void;
    onPlaceOrder: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
    totalAmount, serviceFee, discount, appliedCode, grandTotal, isSubmitting, canPlaceOrder, onApplyOffer, onPlaceOrder 
}) => {
    return (
        <div className="lg:sticky lg:top-28 space-y-4">
            {/* Coupon Section */}
                <OffersSection
                    cartTotal={totalAmount} 
                    onApply={onApplyOffer}
                    appliedCode={appliedCode}
                />
            {/* Price Breakdown */}
            <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-xl">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Order Details</h3>
                
                <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-slate-600 font-medium text-sm md:text-base">
                        <span>Item Total</span>
                        <span className="text-slate-900 font-bold">₹{totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 font-medium text-sm md:text-base">
                        <span>Service & Platform Fee</span>
                        <span className="text-slate-900 font-bold">₹{serviceFee}</span>
                    </div>

                    {discount > 0 && (
                        <div className="flex justify-between text-emerald-600 font-black text-sm">
                            <div className="flex items-center gap-1">
                                <Ticket size={14} />
                                <span>Offer Applied ({appliedCode})</span>
                            </div>
                            <span>-₹{discount}</span>
                        </div>
                    )}

                    <div className="h-px bg-slate-100 w-full my-2 border-dashed border-t" />
                    
                    <div className="flex justify-between items-end pt-2">
                        <div>
                            <p className="text-[10px] font-black text-blue-600 uppercase">Grand Total</p>
                            <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">₹{grandTotal}</p>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <ShieldCheck className="text-emerald-500 w-8 h-8" />
                            <span className="text-[8px] font-bold text-emerald-600 uppercase">Secure</span>
                        </div>
                    </div>
                </div>

                {/* Desktop CTA */}
                <Button
                    onClick={onPlaceOrder}
                    disabled={isSubmitting || !canPlaceOrder}
                    className="w-full bg-slate-900 text-white h-16 rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg disabled:opacity-20 hidden lg:flex"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Confirm Order"}
                </Button>
            </div>
        </div>
    );
};

export default OrderSummary;