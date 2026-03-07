import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useCart } from '@/context/CartContext';
import api from '@/api/api';
import { toast } from 'sonner';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import OrderSummary from './OrderSummary';
import AddressSection from './AddressSelection';

const ShoppingCart = () => {
    const { cartItems, totalAmount, removeFromCart, clearCart } = useCart();
    const serviceFee = 19;
    const [discount, setDiscount] = useState(0);
    const [appliedCode, setAppliedCode] = useState<string | null>(null);

    const grandTotal = (totalAmount + serviceFee) - discount;

    const navigate = useNavigate();
    const { getToken } = useAuth();
    const { user } = useUser();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (!user?.id) return;
            try {
                const res = await api.get(`/user/get-user/${user?.id}`);
                const addresses = res.data.user.addresses || [];
                setSavedAddresses(addresses);
                if (addresses.length > 0 && !selectedAddressId) setSelectedAddressId(addresses[0]._id);
            } finally { setLoading(false); }
        };
        fetchUser();
    }, [user?.id]);

    const handlePlaceOrder = async () => {
        const selectedAddrObj = savedAddresses.find(a => a._id === selectedAddressId);
        if (!selectedAddrObj) return toast.error("Please select an address");

        setIsSubmitting(true);
        try {
            const token = await getToken();
            const payload = {
                cartItems,
                totalAmount: grandTotal,
                discountAmount: discount,
                couponCode: appliedCode,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                userName: selectedAddrObj.fullName || user?.fullName,
                address: `${selectedAddrObj.addressLine}, ${selectedAddrObj.city}, ${selectedAddrObj.state} - ${selectedAddrObj.pincode}`,
                phone: selectedAddrObj.phoneNumber
            };

            const response = await api.post('/orders/book', payload, { headers: { Authorization: `Bearer ${token}` }});
            if (response.data.success) {
                clearCart();
                navigate(`/booking-success?orderId=${response.data.orderId}`);
            }
        } catch (err: any) {
            toast.error("Order Failed: " + (err.response?.data?.error || "Server Error"));
        } finally { setIsSubmitting(false); }
    };

    if (cartItems.length === 0) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
            <div className="w-24 h-24 bg-white shadow-sm rounded-full flex items-center justify-center mb-6"><ShoppingBag className="w-10 h-10 text-slate-300" /></div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Your Cart is Empty!</h2>
            <Button onClick={() => navigate('/categories')} className="bg-blue-600 rounded-2xl font-bold px-10 py-6">Explore Services</Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] mt-16 md:mt-24 pb-32 lg:pb-12">
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-100  top-0 z-60">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-full"><ArrowLeft className="w-6 h-6" /></button>
                    <span className="text-lg font-black uppercase tracking-tight">Checkout Summary</span>
                    <div className="w-10" />
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
                    {/* Left Side */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-10">
                        <AddressSection 
                            loading={loading} 
                            addresses={savedAddresses} 
                            selectedId={selectedAddressId} 
                            onSelect={setSelectedAddressId} 
                        />

                        <section>
                            <h2 className="text-xl font-black text-slate-900 mb-6">Selected Services</h2>
                            <div className="space-y-3">
                                {cartItems.map((item: any) => (
                                    <div key={item._id} className="bg-white rounded-3xl p-4 border border-slate-50 flex items-center gap-4 shadow-sm group">
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-900 text-sm">{item.name}</h3>
                                            <p className="text-blue-600 font-black mt-1">₹{item.price}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => removeFromCart(item._id)} className="text-slate-300 hover:text-red-500"><Trash2 className="w-5 h-5" /></Button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Side */}
                    <div className="lg:col-span-5 xl:col-span-4">
                        <OrderSummary 
                            totalAmount={totalAmount}
                            serviceFee={serviceFee}
                            discount={discount}
                            appliedCode={appliedCode}
                            grandTotal={grandTotal}
                            isSubmitting={isSubmitting}
                            canPlaceOrder={!!selectedAddressId}
                            onApplyOffer={(amt, code) => { setDiscount(amt); setAppliedCode(code); }}
                            onPlaceOrder={handlePlaceOrder}
                        />
                    </div>
                </div>
            </main>

            {/* Mobile Footer */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 pb-8 z-50 shadow-2xl">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-[10px] font-black text-slate-400">TOTAL TO PAY</p>
                        <p className="text-2xl font-black text-slate-900">₹{grandTotal}</p>
                    </div>
                    <Button onClick={handlePlaceOrder} disabled={isSubmitting || !selectedAddressId} className="flex-1 bg-slate-900 h-14 rounded-2xl text-white uppercase">
                        {isSubmitting ? "Processing..." : "Confirm & Pay"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ShoppingCart;