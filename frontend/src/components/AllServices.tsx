import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom'; // categoryId ke liye useParams chahiye
import { Star, Plus, ChevronLeft, ShieldCheck, ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from './ui/button';
import api from '@/api/api'; 
import BackNavigation from './BackNavigation';

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
                // console.log(res.data)
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
        <div className="min-h-screen bg-[#F9FBFF] pb-32 mt-20">
            {/* Navigation Bar */}
            <BackNavigation/>

            <main className="max-w-6xl mx-auto px-6 pt-5">
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Verified Professional Services</span>
                    </div>
                    <span className="text-xl md:text-3xl font-black text-gray-900 capitalize tracking-tighter">
                        {pageTitle}
                    </span>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                        <p className="text-gray-500 font-bold animate-pulse">Fetching expert services...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {services.length > 0 ? (
                            services.map((service) => {
                                // MongoDB ID '_id' check kar rahe hain
                                const isItemInCart = cartItems.some((item: { _id: any; }) => item._id === service._id);
                                
                                return (
                                    <div key={service._id} className="group bg-white rounded-[2.5rem] border border-gray-100 p-5 flex flex-col sm:flex-row gap-6 hover:shadow-2xl transition-all duration-300">
                                        <div className="relative w-full sm:w-44 h-44 rounded-[2rem] overflow-hidden bg-gray-50 shrink-0">
                                            <img 
                                                src={service.image} 
                                                alt={service.name} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                            />
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-lg font-extrabold text-gray-900 mb-2">{service.name}</h3>
                                                <p className="text-xs font-bold text-gray-400 uppercase">Professional Service</p>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                    <span className="text-xs font-bold text-gray-700">4.8 (100+ Bookings)</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-6">
                                                <div>
                                                    <span className="text-[10px] font-black text-gray-300 uppercase block">Price</span>
                                                    <span className="text-2xl font-black text-gray-900">₹{service.price}</span>
                                                </div>
                                                <Button
                                                    onClick={() => addToCart(service)}
                                                    disabled={isItemInCart}
                                                    className={`rounded-2xl font-black px-8 py-6 transition-all ${
                                                        isItemInCart 
                                                        ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                                                        : 'bg-white border-2 border-blue-600 text-blue-100 hover:bg-blue-600 hover:text-white'
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
                            <div className="col-span-full py-20 text-center">
                                <p className="text-gray-400 font-bold text-xl uppercase tracking-widest">No services found in this category.</p>
                                <Link to="/categories" className="text-blue-600 underline mt-4 inline-block font-bold">Go Back</Link>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* STICKY BOTTOM CART BAR */}
            {cartItems.length > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-lg animate-in slide-in-from-bottom-10 duration-500">
                    <div className="bg-gray-900 rounded-[2.5rem] p-4 flex items-center justify-between shadow-2xl border border-white/10 backdrop-blur-lg">
                        <div className="flex items-center gap-4 pl-3">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                                <ShoppingBag className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-white font-black text-lg leading-none">₹{totalAmount}</p>
                                <p className="text-blue-400 text-[10px] font-bold uppercase tracking-tighter">{cartItems.length} Service{cartItems.length > 1 ? 's' : ''} Added</p>
                            </div>
                        </div>
                        <Link to="/shopping-cart" className="bg-white text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all">
                            View Cart
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllServices;