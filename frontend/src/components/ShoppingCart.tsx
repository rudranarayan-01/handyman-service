import React from 'react';
import { Trash2, ChevronLeft, ShieldCheck, CreditCard, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useCart } from '@/context/CartContext';

const ShoppingCart = () => {
    const { cartItems, totalAmount, removeFromCart } = useCart();
    const serviceFee = 49;
    const total = totalAmount + serviceFee;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
                <h2 className="text-2xl font-black text-gray-300 mb-4 uppercase tracking-tighter">Your cart is empty</h2>
                <Link to="/" className="bg-black text-white px-8 py-3 rounded-2xl font-bold transition-all hover:bg-gray-800">Explore Services</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20 mt-15">
            <div className="bg-white sticky top-0 z-50 border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 font-bold text-gray-600 hover:text-black transition-all">
                        <ChevronLeft className="w-5 h-5" />
                        <span>Back</span>
                    </Link>
                    <span className="text-xl font-black tracking-tighter uppercase">Checkout</span>
                    <div className="w-10"></div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-6 pt-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column */}
                    <div className="lg:col-span-8 space-y-4">
                        <h2 className="text-2xl font-black text-gray-900 mb-6">Summary</h2>
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-[2rem] p-6 border border-gray-100 flex items-center gap-6 shadow-sm">
                                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 shrink-0">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                                    <p className="text-blue-600 font-black italic">₹{item.price}</p>
                                </div>
                                <Button variant="ghost" className="text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl" onClick={() => removeFromCart(item.id)}>
                                    <Trash2 className="w-5 h-5" />
                                </Button>
                            </div>
                        ))}

                        <div className="bg-emerald-50 rounded-[2rem] p-6 border border-emerald-100 flex items-start gap-4 mt-8">
                            <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
                            <p className="text-sm text-emerald-700 font-medium">Safe & Professional service guaranteed with 30-day warranty.</p>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl sticky top-28">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Payment</h3>
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-500 font-medium">
                                    <span>Item Total</span>
                                    <span className="text-gray-900 font-bold">₹{totalAmount}</span>
                                </div>
                                <div className="flex justify-between text-gray-500 font-medium">
                                    <span>Service Fee</span>
                                    <span className="text-gray-900 font-bold">₹{serviceFee}</span>
                                </div>
                                <div className="h-px bg-gray-100 my-4" />
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-black text-gray-900">Total</span>
                                    <span className="text-2xl font-black text-blue-600 italic">₹{total}</span>
                                </div>
                            </div>
                            <a href="/booking-success">
                                <Button className="w-full bg-gray-900 text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-95">
                                    Pay Now <CreditCard className="w-5 h-5" />
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ShoppingCart;