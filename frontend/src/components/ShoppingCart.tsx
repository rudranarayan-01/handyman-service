import { Trash2, ShieldCheck, CreditCard, ShoppingBag, Loader2, MapPin, Phone, CheckCircle2, PlusCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useCart } from '@/context/CartContext';
import api from '@/api/api';
import { toast } from 'sonner';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import BackNavigation from './BackNavigation';

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

    // Fetch User Addresses
    useEffect(() => {
        const fetchUser = async () => {
            if (!user?.id) return;
            try {
                const res = await api.get(`/user/get-user/${user?.id}`);
                const addresses = res.data.user.addresses || [];
                setSavedAddresses(addresses);

                // Auto-select the first address by default
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
        // Finding the full object of the selected address
        const selectedAddrObj = savedAddresses.find(a => a._id === selectedAddressId);

        if (!selectedAddrObj) {
            toast.error("Please select a service address");
            return;
        }

        // Destructuring and formatting the address for the backend
        const { fullName, phoneNumber, addressLine, city, state, pincode } = selectedAddrObj;
        const formattedAddress = `${addressLine}, ${city}, ${state} - ${pincode}`;

        try {
            setIsSubmitting(true);
            const token = await getToken();

            const payload = {
                cartItems: cartItems,
                totalAmount: total,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                userName: fullName || user?.fullName, // Using name from address for accuracy
                address: formattedAddress,
                phone: phoneNumber
            };

            const response = await api.post('/orders/book', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                toast.success("Order Placed Successfully!");
                clearCart();
                navigate('/booking-success');
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
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Your Cart is Empty!</h2>
                <Link to="/categories" className="bg-black text-white px-8 py-3 rounded-xl font-bold mt-4">
                    Explore Services
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20 mt-20">
            <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <BackNavigation />
                    <span className="text-lg font-black uppercase tracking-tighter text-slate-800">Checkout</span>
                    <div className="w-10" /> {/* Spacer for symmetry */}
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-6 pt-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left Column: Address & Items */}
                    <div className="lg:col-span-8 space-y-10">

                        <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                    <MapPin className="text-blue-600" size={22} /> Service Address
                                </h2>
                                <button
                                    onClick={() => navigate("/edit-address")}
                                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-2 hover:bg-blue-100 transition-colors"
                                >
                                    <PlusCircle size={14} /> Add New
                                </button>
                            </div>

                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[1, 2].map(i => <div key={i} className="h-32 bg-slate-50 animate-pulse rounded-3xl" />)}
                                </div>
                            ) : savedAddresses.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {savedAddresses.map((addr) => (
                                        <div
                                            key={addr._id}
                                            onClick={() => setSelectedAddressId(addr._id)}
                                            className={`p-6 rounded-3xl border-2 transition-all cursor-pointer relative ${selectedAddressId === addr._id
                                                    ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                                                    : 'border-slate-50 hover:border-slate-200 bg-slate-50/30'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="text-[9px] font-black uppercase text-blue-600 bg-white px-2 py-1 rounded-md border border-blue-100 shadow-sm">
                                                    {addr.label || 'Home'}
                                                </span>
                                                {selectedAddressId === addr._id && <CheckCircle2 className="text-blue-600 w-5 h-5 fill-white" />}
                                            </div>

                                            {/* Structured Display */}
                                            <h4 className="font-black text-slate-900 text-sm mb-1">{addr.fullName}</h4>
                                            <p className="text-slate-500 text-xs font-medium leading-relaxed mb-3">
                                                {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
                                            </p>

                                            <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-slate-900 font-bold text-xs">
                                                <Phone size={12} className="text-blue-500" />
                                                {addr.phoneNumber}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-3xl">
                                    <p className="text-slate-400 font-bold text-sm mb-4">No addresses found</p>
                                    <Button onClick={() => navigate("/edit-address")} variant="outline" className="rounded-xl text-white hover:text-gray-200">Create your first address</Button>
                                </div>
                            )}
                        </section>

                        {/* Items List */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-slate-900 mb-6">Service Summary</h2>
                            {cartItems.map((item: any) => (
                                <div key={item._id} className="bg-white rounded-3xl p-5 border border-slate-100 flex items-center gap-5 shadow-sm">
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900">{item.name}</h3>
                                        <p className="text-blue-600 font-black italic mt-1">₹{item.price}</p>
                                    </div>
                                    <Button variant="ghost" onClick={() => removeFromCart(item._id)} className="text-slate-300 hover:text-red-500">
                                        <Trash2 className="w-5 h-5" />
                                    </Button>
                                </div>
                            ))}
                        </section>
                    </div>

                    {/* Right Column: Sticky Summary */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl sticky top-28">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Payment Summary</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between font-bold text-slate-600">
                                    <span>Subtotal</span>
                                    <span className="text-slate-900 font-black">₹{totalAmount}</span>
                                </div>
                                <div className="flex justify-between font-bold text-slate-600">
                                    <span>Service Fee</span>
                                    <span className="text-slate-900 font-black">₹{serviceFee}</span>
                                </div>
                                <div className="pt-6 border-t border-dashed border-slate-200 mt-6">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-300 uppercase mb-1">Total Amount</p>
                                            <p className="text-4xl font-black text-slate-900 italic tracking-tighter">₹{total}</p>
                                        </div>
                                        <ShieldCheck className="text-emerald-500 w-8 h-8" />
                                    </div>
                                </div>
                                <Button
                                    onClick={() => handlePlaceOrder()} // Wrapped in arrow to avoid Promise type error
                                    disabled={isSubmitting || !selectedAddressId}
                                    className="w-full bg-slate-900 text-white h-16 rounded-2xl font-black uppercase tracking-widest mt-8 hover:bg-blue-600 shadow-lg disabled:opacity-30"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Confirm & Pay"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ShoppingCart;