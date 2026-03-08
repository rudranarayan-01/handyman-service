import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Star, Plus, ShieldCheck, Loader2, Info, Clock, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from './ui/button';
import api from '@/api/api';
import BackNavigation from './BackNavigation';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const AllServices = () => {
    const { categoryId } = useParams();
    const { addToCart, cartItems, totalAmount } = useCart();

    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const pageTitle = categoryId?.replace(/-/g, ' ');

    useEffect(() => {
        const fetchServices = async () => {
            if (!categoryId) return;
            setLoading(true);
            try {
                const res = await api.get(`/services/category/${categoryId}`);
                setServices(res.data);
            } catch (err) {
                console.error("Fetch error", err);
                setServices([]);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, [categoryId]);

    return (
        <div className="min-h-screen bg-[#F9FBFF] pb-32 mt-20 font-sans">
            <BackNavigation />

            <main className="max-w-6xl mx-auto px-6 pt-8">
                {/* Header Section */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Verified Professional Services</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 capitalize tracking-tighter leading-none">
                        {pageTitle}
                    </h1>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        <p className="text-gray-400 font-bold text-sm tracking-widest uppercase animate-pulse">Loading Services...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {services.length > 0 ? (
                            services.map((service) => {
                                const isItemInCart = cartItems.some((item: { _id: any; }) => item._id === service._id);

                                return (
                                    <div key={service._id} className="group bg-white rounded-[2.5rem] border border-gray-100 p-6 flex flex-col sm:flex-row gap-8 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 relative">

                                        {/* PLAIN INFO ICON - RIGHT TOP */}
                                        <div className="absolute top-6 right-8">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Info className="w-5 h-5 text-gray-500 hover:text-blue-600 cursor-pointer transition-colors" />
                                                </DialogTrigger>
                                                <DialogContent className="max-w-md rounded-[2.5rem] border-none p-10 shadow-2xl [&>button]:text-gray-100 [&>button]:hover:text-red-500 [&>button]:transition-colors">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-2xl font-black text-gray-900 tracking-tight">{service.name}</DialogTitle>
                                                    </DialogHeader>

                                                    <div className="space-y-5 ">
                                                        <div className="flex items-center gap-4 bg-gray-50/50 px-5 rounded-2xl border border-gray-100">
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="w-4 h-4 text-blue-500" />
                                                                <span className="text-xs font-black text-gray-600">45-60 MINS</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                                                <span className="text-xs font-black text-gray-600">4.8 RATING</span>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">About Service</h4>
                                                            <p className="text-gray-500 text-sm font-medium leading-relaxed">
                                                                {service.description || "Top-rated professional service including deep inspection, repair, and genuine spare parts replacement for maximum efficiency."}
                                                            </p>
                                                        </div>

                                                        <div className="space-y-4">
                                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Handyman Promise</h4>
                                                            {['Verified Professional', '30-Day Warranty', 'Safety First Protocol'].map((item) => (
                                                                <div key={item} className="flex items-center gap-3">
                                                                    <div className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center">
                                                                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                                                    </div>
                                                                    <span className="text-sm font-bold text-gray-700">{item}</span>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <Button
                                                            onClick={() => addToCart(service)}
                                                            disabled={isItemInCart}
                                                            className="w-full py-8 rounded-[1.5rem] text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all"
                                                        >
                                                            {isItemInCart ? "Already Added" : `Book Now - ₹${service.price}`}
                                                        </Button>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </div>

                                        {/* Image Container */}
                                        <div className="relative w-full sm:w-44 h-44 rounded-[2rem] overflow-hidden bg-gray-50 shrink-0">
                                            <img
                                                src={service.image}
                                                alt={service.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                            />
                                        </div>

                                        {/* Details Container */}
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div className="space-y-1">
                                                <h3 className="text-xl font-black text-gray-900 tracking-tight leading-tight">{service.name}</h3>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-1 text-amber-500">
                                                        <Star className="w-3 h-3 fill-current" />
                                                        <span className="text-xs font-black">4.8</span>
                                                    </div>
                                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none mt-0.5">100+ Booked</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-auto pt-6">
                                                <div className="space-y-0.5">
                                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block">Price</span>
                                                    <span className="text-3xl font-black text-gray-900 tracking-tighter">₹{service.price}</span>
                                                </div>
                                                <Button
                                                    onClick={() => addToCart(service)}
                                                    disabled={isItemInCart}
                                                    className={`rounded-2xl font-black px-10 py-7 transition-all border-none ${isItemInCart
                                                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100'
                                                            : 'bg-gray-900 text-white hover:bg-blue-600 shadow-xl shadow-gray-100'
                                                        }`}
                                                >
                                                    {isItemInCart ? "Added" : "Add"} <Plus className="ml-2 w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full py-32 text-center">
                                <p className="text-gray-300 font-black text-xl uppercase tracking-[0.2em]">No services found</p>
                                <Link to="/categories" className="text-blue-600 font-bold text-sm underline mt-4 inline-block">Explore Categories</Link>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* STICKY CART - REDESIGNED */}
            {cartItems.length > 0 && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-100 w-[95%] max-w-md">
                    <div className="bg-gray-900/95 backdrop-blur-xl rounded-[2rem] p-3 pl-6 flex items-center justify-between shadow-[0_30px_60px_rgba(0,0,0,0.3)] border border-white/5">
                        <div className="flex flex-col">
                            <span className="text-white font-black text-xl tracking-tighter leading-none">₹{totalAmount}</span>
                            <span className="text-blue-400 text-[10px] font-black uppercase tracking-widest">{cartItems.length} ITEM SELECTED</span>
                        </div>
                        <Link to="/shopping-cart" className="bg-white text-black px-10 py-4 rounded-[1.4rem] font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95">
                            Checkout
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllServices;