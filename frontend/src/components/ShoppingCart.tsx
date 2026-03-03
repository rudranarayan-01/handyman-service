import { Trash2, ShieldCheck, ShoppingBag, Loader2, MapPin, Phone, CheckCircle2, PlusCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useCart } from '@/context/CartContext';
import api from '@/api/api';
import { toast } from 'sonner';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';

// ─── SKELETON COMPONENT ───
const AddressSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map(i => (
            <div key={i} className="h-40 bg-white border border-slate-100 rounded-3xl p-6 animate-pulse">
                <div className="w-16 h-4 bg-slate-100 rounded mb-4" />
                <div className="w-3/4 h-5 bg-slate-100 rounded mb-2" />
                <div className="w-full h-10 bg-slate-50 rounded" />
            </div>
        ))}
    </div>
);

const ShoppingCart = () => {
    const { cartItems, totalAmount, removeFromCart, clearCart } = useCart();
    const serviceFee = 19;
    const total = totalAmount + serviceFee;
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
                if (addresses.length > 0 && !selectedAddressId) {
                    setSelectedAddressId(addresses[0]._id);
                }
            } catch (err) {
                console.error("User address fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [user?.id]);

    const handlePlaceOrder = async () => {
        const selectedAddrObj = savedAddresses.find(a => a._id === selectedAddressId);
        if (!selectedAddrObj) {
            toast.error("Please select a service address");
            return;
        }

        const { fullName, phoneNumber, addressLine, city, state, pincode } = selectedAddrObj;
        const formattedAddress = `${addressLine}, ${city}, ${state} - ${pincode}`;

        try {
            setIsSubmitting(true);
            const token = await getToken();
            const payload = {
                cartItems,
                totalAmount: total,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                userName: fullName || user?.fullName,
                address: formattedAddress,
                phone: phoneNumber
            };

            const response = await api.post('/orders/book', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                toast.success("Order Placed Successfully!");
                clearCart();
                navigate(`/booking-success?orderId=${response.data.orderId}`);
            }
        } catch (err: any) {
            toast.error("Order Failed: " + (err.response?.data?.error || "Server Error"));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] px-6">
                <div className="w-24 h-24 bg-white shadow-sm rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-10 h-10 text-slate-300" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Your Cart is Empty!</h2>
                <p className="text-slate-500 mb-8 text-center max-w-xs">Looks like you haven't added any services to your cart yet.</p>
                <Button onClick={() => navigate('/categories')} className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 rounded-2xl font-bold text-lg">
                    Explore Services
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] mt-16 md:mt-24">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-[60]">
                <div className="max-w-6xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6 text-slate-900" />
                    </button>
                    <span className="text-base md:text-lg font-black uppercase tracking-tight text-slate-800">Checkout Summary</span>
                    <div className="w-10" />
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    
                    {/* Left Side: Logic */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-10">
                        
                        {/* Address Section */}
                        <section>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                    <MapPin className="text-blue-600" size={22} /> Service Address
                                </h2>
                                <Button
                                    variant="ghost"
                                    onClick={() => navigate("/edit-address")}
                                    className="text-blue-600 font-bold hover:bg-blue-50 rounded-xl"
                                >
                                    <PlusCircle size={18} className="mr-2" /> Add New
                                </Button>
                            </div>

                            {loading ? <AddressSkeleton /> : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {savedAddresses.map((addr) => (
                                        <div
                                            key={addr._id}
                                            onClick={() => setSelectedAddressId(addr._id)}
                                            className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer relative group ${
                                                selectedAddressId === addr._id 
                                                ? 'border-blue-600 bg-blue-50/40 shadow-md ring-4 ring-blue-600/5' 
                                                : 'border-white bg-white hover:border-slate-200 shadow-sm'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase text-slate-500">
                                                    {addr.label || 'Home'}
                                                </div>
                                                {selectedAddressId === addr._id && (
                                                    <CheckCircle2 className="text-blue-600 w-6 h-6 fill-white" />
                                                )}
                                            </div>
                                            <h4 className="font-bold text-slate-900 mb-1">{addr.fullName}</h4>
                                            <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4">
                                                {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
                                            </p>
                                            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                                                <Phone size={14} className="text-slate-400" /> {addr.phoneNumber}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Items Section */}
                        <section>
                            <h2 className="text-xl font-black text-slate-900 mb-6">Selected Services</h2>
                            <div className="space-y-3">
                                {cartItems.map((item: any) => (
                                    <div key={item._id} className="bg-white rounded-3xl p-4 md:p-5 border border-slate-50 flex items-center gap-4 md:gap-6 shadow-sm group">
                                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-900 text-sm md:text-base leading-tight">{item.name}</h3>
                                            <p className="text-blue-600 font-black mt-1">₹{item.price}</p>
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            size="icon"
                                            onClick={() => removeFromCart(item._id)} 
                                            className="rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Side: Price Summary (Desktop Sticky / Mobile Bottom) */}
                    <div className="lg:col-span-5 xl:col-span-4">
                        <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-xl lg:sticky lg:top-28">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Order Details</h3>
                            
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-slate-600 font-medium">
                                    <span>Item Total</span>
                                    <span className="text-slate-900 font-bold">₹{totalAmount}</span>
                                </div>
                                <div className="flex justify-between text-slate-600 font-medium">
                                    <span>Service & Platform Fee</span>
                                    <span className="text-slate-900 font-bold">₹{serviceFee}</span>
                                </div>
                                <div className="h-px bg-dashed bg-slate-100 w-full my-2" />
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-black text-blue-600 uppercase">Grand Total</p>
                                        <p className="text-4xl font-black text-slate-900 tracking-tighter">₹{total}</p>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <ShieldCheck className="text-emerald-500 w-8 h-8" />
                                        <span className="text-[8px] font-bold text-emerald-600 uppercase">Secure</span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handlePlaceOrder}
                                disabled={isSubmitting || !selectedAddressId}
                                className="w-full bg-slate-900 text-white h-16 rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg disabled:opacity-20 hidden lg:flex"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" /> : "Confirm Order"}
                            </Button>

                            <p className="text-[10px] text-center text-slate-400 mt-4 hidden lg:block">
                                By placing the order, you agree to our terms of service.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Mobile Bottom Action Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 pb-8 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between gap-4 max-w-xl mx-auto">
                    <div className="shrink-0">
                        <p className="text-[10px] font-black text-slate-400 uppercase">To Pay</p>
                        <p className="text-2xl font-black text-slate-900">₹{total}</p>
                    </div>
                    <Button
                        onClick={handlePlaceOrder}
                        disabled={isSubmitting || !selectedAddressId}
                        className="flex-1 bg-slate-900 text-white h-14 rounded-2xl font-black uppercase tracking-widest disabled:opacity-20"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : "Confirm & Pay"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ShoppingCart;