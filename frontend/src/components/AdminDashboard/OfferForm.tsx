import React, { useState, useEffect } from 'react';
import { X, Save, Info, Hash, Type } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea"; // Ensure you have shadcn textarea
import { toast } from 'sonner';
import api from '@/api/api';

// ─── FORM SKELETON ───
export const OfferFormSkeleton = () => (
    <div className="space-y-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
                <div className="h-3 w-20 bg-slate-100 rounded" />
                <div className="h-14 w-full bg-slate-50 rounded-xl" />
            </div>
        ))}
        <div className="h-16 w-full bg-slate-100 rounded-2xl" />
    </div>
);

interface OfferFormDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: any;
    refreshData: () => void;
    isLoading?: boolean;
}

const OfferFormDrawer: React.FC<OfferFormDrawerProps> = ({ 
    isOpen, 
    onClose, 
    initialData, 
    refreshData,
    isLoading = false 
}) => {
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: 0,
        minOrderAmount: 0,
        maxDiscount: 0,
        usageLimit: 100,
        expiryDate: '',
        isActive: true
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                description: initialData.description || '',
                expiryDate: initialData.expiryDate ? new Date(initialData.expiryDate).toISOString().split('T')[0] : ''
            });
        } else {
            setFormData({
                code: '', description: '', discountType: 'percentage', 
                discountValue: 0, minOrderAmount: 0, maxDiscount: 0, 
                usageLimit: 100, expiryDate: '', isActive: true
            });
        }
    }, [initialData, isOpen]);

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const payload = { ...formData, code: formData.code.toUpperCase() };
        
        if (initialData) {
            // Updated to .patch and correct URL
            await api.patch(`/offers/update/${initialData._id}`, payload);
            toast.success("Campaign updated successfully");
        } else {
            await api.post('/offers/create', payload);
            toast.success("New offer launched!");
        }
        refreshData();
        onClose();
    } catch (err: any) {
        console.error(err);
        toast.error(err.response?.data?.message || "Error saving offer");
    }
};

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-999 flex justify-end">
            {/* Backdrop with Fade-in */}
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] animate-in fade-in duration-300" 
                onClick={onClose} 
            />
            
            {/* Drawer Content */}
            <div className="relative w-full max-w-xl bg-white h-screen shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out">
                
                {/* Fixed Header */}
                <div className="p-6 md:p-8 border-b border-slate-50 flex justify-between items-center bg-white z-10">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                            {initialData ? 'Edit Campaign' : 'New Offer'} 
                            {initialData && <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg ml-2 tracking-tighter">#{initialData._id.slice(-4)}</span>}
                        </h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Configure discount parameters</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all active:scale-95"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Form Body */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                    {isLoading ? (
                        <OfferFormSkeleton />
                    ) : (
                        <form id="offer-form" onSubmit={handleSubmit} className="space-y-7 pb-10">
                            
                            {/* Code & Active Status Row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Hash size={12} /> Coupon Code
                                    </label>
                                    <Input 
                                        value={formData.code} 
                                        onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                                        placeholder="E.G. FESTIVE50" 
                                        className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-blue-600 font-black text-lg uppercase transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</label>
                                    <div className="h-14 flex items-center justify-between px-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                        <span className={`text-[10px] font-black ${formData.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                                            {formData.isActive ? 'LIVE' : 'OFF'}
                                        </span>
                                        <Switch 
                                            checked={formData.isActive} 
                                            onCheckedChange={(checked) => setFormData({...formData, isActive: checked})} 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Description Section */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Type size={12} /> Offer Description
                                </label>
                                <Textarea 
                                    value={formData.description}
                                    onChange={(e:any) => setFormData({...formData, description: e.target.value})}
                                    placeholder="Briefly describe what this offer provides (e.g., Get up to ₹200 off on home cleaning)"
                                    className="min-h-25 rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-blue-600 font-medium resize-none p-4"
                                />
                            </div>

                            {/* Type & Value */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Discount Type</label>
                                    <div className="relative">
                                        <select 
                                            className="w-full h-14 rounded-2xl border border-slate-100 px-4 font-bold bg-slate-50/50 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all cursor-pointer text-sm"
                                            value={formData.discountType}
                                            onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                                        >
                                            <option value="percentage">Percentage (%)</option>
                                            <option value="flat">Flat Amount (₹)</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <Info size={16} />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Value</label>
                                    <Input 
                                        type="number"
                                        value={formData.discountValue} 
                                        onChange={(e) => setFormData({...formData, discountValue: Number(e.target.value)})}
                                        className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-black text-lg focus-visible:ring-blue-600"
                                    />
                                </div>
                            </div>

                            {/* Limits Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-blue-50/30 rounded-[2rem] border border-blue-50">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Min Order (₹)</label>
                                    <Input type="number" value={formData.minOrderAmount} onChange={(e) => setFormData({...formData, minOrderAmount: Number(e.target.value)})} className="h-12 rounded-xl border-white bg-white font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Usage Limit</label>
                                    <Input type="number" value={formData.usageLimit} onChange={(e) => setFormData({...formData, usageLimit: Number(e.target.value)})} className="h-12 rounded-xl border-white bg-white font-bold" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Campaign Expiry Date</label>
                                <Input 
                                    type="date" 
                                    value={formData.expiryDate} 
                                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})} 
                                    className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-bold focus-visible:ring-blue-600" 
                                />
                            </div>
                        </form>
                    )}
                </div>

                {/* Fixed Footer with Submit */}
                <div className="p-6 md:p-8 bg-white border-t border-slate-50 mt-auto">
                    <Button 
                        form="offer-form"
                        type="submit" 
                        disabled={!formData.code || !formData.description}
                        className="w-full h-16 rounded-[2rem] bg-slate-900 hover:bg-blue-600 text-white font-black text-lg shadow-xl shadow-slate-100 flex gap-3 transition-all active:scale-[0.98] disabled:opacity-50 disabled:bg-slate-200"
                    >
                        <Save size={22} /> {initialData ? 'Update Campaign' : 'Publish Offer'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default OfferFormDrawer;