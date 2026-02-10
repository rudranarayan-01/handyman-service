import { Trash2, ChevronLeft, ShieldCheck, CreditCard, ShoppingBag, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useCart } from '@/context/CartContext';
import api from '@/api/api';
import { toast } from 'sonner';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useState } from 'react';
import BackNavigation from './BackNavigation';

const ShoppingCart = () => {
    const { cartItems, totalAmount, removeFromCart, clearCart } = useCart();
    const serviceFee = 19;
    const total = totalAmount + serviceFee;
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {user} = useUser()

    const handlePlaceOrder = async () => {
        if (isSubmitting) return;
        
        try {
            setIsSubmitting(true);
            const token = await getToken();
            
            const payload = {
                cartItems: cartItems,
                totalAmount: totalAmount + 19, // Total + Service Fee
                userEmail: user?.primaryEmailAddress?.emailAddress
            };

            const response = await api.post('/orders/book', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                toast.success("Order Placed!");
                clearCart();
                navigate('/booking-success');
            }
        } catch (err: any) {
            const msg = err.response?.data?.error || "Connection failed";
            console.log(err)
            toast.error("Error: " + msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] px-6">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Your Cart is Empty!</h2>
                <p className="text-gray-500 mb-6 text-center">Looks like you haven't added any services yet.</p>
                <Link to="/categories" className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all">
                    Explore Services
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20 mt-20">
            <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <BackNavigation/>
                    <span className="text-lg font-black uppercase tracking-tighter">Checkout</span>
                    <span className="bg-blue-600 text-white text-[10px] px-2 py-1 rounded-full font-bold">
                        {cartItems.length} {cartItems.length > 1 ? 'ITEMS' : 'ITEM'}
                    </span>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-6 pt-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-4">
                        <h2 className="text-2xl font-black text-gray-900 mb-6">Summary</h2>

                        {cartItems.map((item: any) => (
                            <div key={item._id} className="bg-white rounded-3xl p-5 border border-gray-100 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-gray-50">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-900 text-lg truncate">{item.name}</h3>
                                    <p className="text-blue-600 font-black italic mt-1">₹{item.price}</p>
                                </div>

                                <Button
                                    variant="ghost"
                                    onClick={() => removeFromCart(item._id)}
                                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl p-4 shrink-0"
                                >
                                    <Trash2 className="w-6 h-6" />
                                </Button>
                            </div>
                        ))}

                        <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 flex gap-4 mt-8">
                            <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
                            <p className="text-sm text-emerald-700 font-medium">Safe & Professional service guaranteed with 30-day post-service warranty.</p>
                        </div>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl sticky top-28">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Payment Details</h3>

                            <div className="space-y-4">
                                <div className="flex justify-between text-gray-500 font-bold">
                                    <span>Item Total</span>
                                    <span className="text-gray-900 font-black">₹{totalAmount}</span>
                                </div>
                                <div className="flex justify-between text-gray-500 font-bold">
                                    <span>Service Fee</span>
                                    <span className="text-gray-900 font-black">₹{serviceFee}</span>
                                </div>

                                <div className="border-t border-dashed border-gray-200 pt-4 mt-4 flex justify-between items-center">
                                    <div>
                                        <span className="text-[10px] font-black text-gray-300 uppercase block leading-none mb-1">Total to pay</span>
                                        <span className="text-3xl font-black text-gray-900 tracking-tighter">₹{total}</span>
                                    </div>
                                    <span className="bg-blue-50 text-blue-600 text-[10px] px-3 py-1 rounded-full font-black uppercase">Secure</span>
                                </div>

                                <Button
                                    onClick={handlePlaceOrder}
                                    disabled={isSubmitting}
                                    className="w-full bg-gray-900 text-white h-14 rounded-2xl font-black text-xs uppercase tracking-widest mt-6 hover:bg-blue-600 shadow-lg transition-all active:scale-95 disabled:opacity-70"
                                >
                                    {isSubmitting ? (
                                        <><Loader2 className="mr-2 w-5 h-5 animate-spin" /> Processing...</>
                                    ) : (
                                        <><CreditCard className="mr-2 w-5 h-5" /> Place Order</>
                                    )}
                                </Button>

                                <p className="text-center text-[10px] text-gray-400 font-bold mt-4 tracking-widest">100% SATISFACTION GUARANTEED</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ShoppingCart;