import { useState, useEffect } from 'react';
import { Plus, Calendar, Percent, Tag, Search, Info, MousePointer2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import api from '@/api/api';
import OfferFormDrawer from './OfferForm';

// ─── SKELETON LOADER ───
const OfferCardSkeleton = () => (
  <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 animate-pulse">
    <div className="flex justify-between mb-4">
      <div className="h-5 w-16 bg-slate-100 rounded-full" />
      <div className="h-8 w-8 bg-slate-50 rounded-full" />
    </div>
    <div className="h-7 w-32 bg-slate-100 rounded-lg mb-2" />
    <div className="h-4 w-full bg-slate-50 rounded-md mb-6" />
    <div className="pt-4 border-t border-slate-50 flex gap-4">
      <div className="h-4 w-20 bg-slate-50 rounded-md" />
      <div className="h-4 w-24 bg-slate-50 rounded-md" />
    </div>
  </div>
);

const AdminOffers = () => {
    const [offers, setOffers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState<any>(null);

    const fetchOffers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/offers/all');
            setOffers(Array.isArray(res.data.offers) ? res.data.offers : []);
        } catch (err) {
            toast.error("Failed to load offers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOffers(); }, []);

    const openCreateDrawer = () => {
        setSelectedOffer(null);
        setIsDrawerOpen(true);
    };

    const openEditDrawer = (offer: any) => {
        setSelectedOffer(offer);
        setIsDrawerOpen(true);
    };

    const filteredOffers = offers.filter(o => 
        o.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8 lg:p-12 bg-[#F8FAFC] min-h-screen">
            <div className="max-w-7xl mx-auto">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                            Campaign Manager
                        </h1>
                        <p className="text-slate-500 font-bold mt-1">Design and deploy high-conversion discount strategies</p>
                    </div>
                    <Button 
                        onClick={openCreateDrawer} 
                        className="w-full md:w-auto bg-blue-600 hover:bg-slate-900 text-white rounded-[1.5rem] px-8 py-7 h-auto font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-100 transition-all active:scale-95 flex gap-3"
                    >
                        <Plus size={22} strokeWidth={3} /> Create New Offer
                    </Button>
                </div>

                {/* Stats & Filter Bar */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                            <Tag size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Coupons</p>
                            <p className="text-2xl font-black text-slate-900 leading-none mt-1">
                                {offers.filter(o => o.isActive).length}
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-3 relative flex items-center">
                        <Search className="absolute left-6 text-slate-400" size={20} />
                        <Input 
                            placeholder="Search by coupon code (e.g. FESTIVE50)..." 
                            className="pl-14 h-20 rounded-[2rem] border-none bg-white shadow-sm focus-visible:ring-2 focus-visible:ring-blue-600 font-bold text-lg text-slate-700 placeholder:text-slate-300 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Offer Grid Content */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => <OfferCardSkeleton key={i} />)}
                    </div>
                ) : filteredOffers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredOffers.map((offer) => (
                            <div 
                                key={offer._id} 
                                className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-7 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-100/50 hover:border-blue-200 overflow-hidden"
                            >
                                {/* ─── HOVER OVERLAY ─── */}
                                <div className="absolute inset-0 z-20 bg-slate-900/95 p-8 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between translate-y-4 group-hover:translate-y-0">
                                    <div>
                                        <div className="flex items-center gap-2 mb-6">
                                            <div className="h-1 w-8 bg-blue-500 rounded-full" />
                                            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Usage Analytics</h4>
                                        </div>
                                        <div className="space-y-4 text-sm">
                                            <div className="flex justify-between items-center text-slate-300">
                                                <span className="font-bold text-xs uppercase opacity-60">Redemptions</span>
                                                <span className="font-black text-white text-base">{offer.usedCount || 0} / {offer.usageLimit}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-slate-300">
                                                <span className="font-bold text-xs uppercase opacity-60">Min Order</span>
                                                <span className="font-black text-white text-base">₹{offer.minOrderAmount}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-slate-300">
                                                <span className="font-bold text-xs uppercase opacity-60">Revenue Boost</span>
                                                <span className="font-black text-emerald-400 text-base">High Impact</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <Button 
                                        variant="outline" 
                                        className="w-full border-white/20  hover:bg-gray-200 text-black rounded-2xl h-14 font-black uppercase tracking-widest text-xs transition-all active:scale-95"
                                        onClick={() => openEditDrawer(offer)}
                                    >
                                        Configure Campaign
                                    </Button>
                                </div>

                                {/* ─── MAIN CARD CONTENT ─── */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                        offer.isActive 
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                            : 'bg-slate-50 text-slate-400 border-slate-100'
                                    }`}>
                                        {offer.isActive ? '• Active Now' : 'Paused'}
                                    </div>
                                    <div className="p-2 bg-slate-50 text-slate-300 rounded-xl group-hover:text-blue-600 transition-colors">
                                        <MousePointer2 size={16} />
                                    </div>
                                </div>

                                <h3 className="text-3xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    {offer.code}
                                </h3>
                                <p className="text-sm text-slate-500 font-bold mb-8 line-clamp-2 leading-relaxed min-h-10">
                                    {offer.description || "No description provided for this campaign."}
                                </p>

                                <div className="flex items-center justify-between border-t border-slate-50 pt-5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                            <Percent size={14} strokeWidth={3} />
                                        </div>
                                        <span className="text-lg font-black text-slate-900">
                                            {offer.discountValue}{offer.discountType === 'percentage' ? '%' : ' OFF'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-400 font-black text-[10px] uppercase tracking-tighter bg-slate-50 px-3 py-1.5 rounded-lg">
                                        <Calendar size={12} />
                                        <span>Exp: {new Date(offer.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <div className="bg-slate-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                            <Info className="text-slate-300 w-12 h-12" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">No campaigns found</h2>
                        <p className="text-slate-500 font-bold max-w-xs mx-auto mb-8">
                            Your search didn't match any active or paused coupons.
                        </p>
                        <Button onClick={() => setSearchQuery("")} variant="link" className="text-blue-600 font-black uppercase tracking-widest text-xs">
                            Clear all filters
                        </Button>
                    </div>
                )}
            </div>

            <OfferFormDrawer 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)} 
                initialData={selectedOffer}
                refreshData={fetchOffers}
            />
        </div>
    );
};

export default AdminOffers;