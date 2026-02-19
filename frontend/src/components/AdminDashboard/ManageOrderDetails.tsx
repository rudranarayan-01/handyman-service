import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import {
    ChevronLeft, Package, User, CreditCard,
    Calendar, CheckCircle, Clock, AlertCircle,
    Truck, XCircle, Mail, MapPin,
    Map, Phone, Trash2, X, Briefcase
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/api/api';

// --- INTERFACES ---
interface OrderItem {
    serviceId: {
        _id: string;
        image?: string;
        duration?: string;
        category?: string; // Added to help filtering
    };
    name: string;
    price: number;
    image?: string;
}

interface FullOrderData {
    _id: string;
    orderId: string;
    userId: string;
    customerDetails: {
        name: string;
        email: string;
        address: string;
        phone: string;
        area?: string; // Needed for matching
    };
    items: OrderItem[];
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    totalAmount: number;
    bookingDate: string;
    serviceFee: number;
    assignedPartner?: string;
}

interface Partner {
    _id: string;
    name: string;
    phone: string;
    email: string;
    specializations: string[];
    serviceAreas: string[];
}

const ManageOrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { getToken } = useAuth();

    const [order, setOrder] = useState<FullOrderData | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // --- ASSIGNMENT MODAL STATES ---
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [partners, setPartners] = useState<Partner[]>([]);
    const [selectedPartnerId, setSelectedPartnerId] = useState("");
    const [fetchingPartners, setFetchingPartners] = useState(false);

    const fetchOrderDetails = async () => {
        try {
            const token = await getToken();
            const response = await api.get(`/admin/orders/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrder(response.data);
        } catch (error: any) {
            toast.error("Order not found");
            navigate('/admin');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrderDetails(); }, [orderId]);

    // --- FETCH ELIGIBLE PARTNERS ---
    const fetchEligiblePartners = async () => {
        if (!order) return;
        setFetchingPartners(true);
        try {
            const token = await getToken();
            const response = await api.get(`/admin/partners/eligible`, {
                params: {
                    area: order.customerDetails.address, // Or specific area field
                    service: order.items[0]?.name // Based on first item or category
                },
                headers: { Authorization: `Bearer ${token}` }
            });
            setPartners(response.data);
        } catch (err) {
            toast.error("Failed to load eligible partners");
        } finally {
            setFetchingPartners(false);
        }
    };

    const handleStatusClick = (status: string) => {
        if (status === 'confirmed') {
            fetchEligiblePartners();
            setShowAssignModal(true);
        } else {
            handleStatusUpdate(status);
        }
    };

    const handleStatusUpdate = async (newStatus: string, partnerId?: string) => {
        setUpdating(true);
        const updateAction = async () => {
            const token = await getToken();
            await api.patch(`/admin/orders/${orderId}`,
                { 
                    status: newStatus,
                    partnerId: partnerId // Backend logic will trigger Email/SMS here
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setOrder(prev => prev ? { ...prev, status: newStatus as any } : null);
            setShowAssignModal(false);
        };

        toast.promise(updateAction(), {
            loading: `Processing...`,
            success: partnerId ? `Order confirmed & Partner notified!` : `Status updated to ${newStatus}`,
            error: (err) => err.response?.data?.message || "Operation failed",
        });

        try { await updateAction(); } catch (e) { console.error(e); } finally { setUpdating(false); }
    };

    const executeDelete = async () => {
        setUpdating(true);
        try {
            const token = await getToken();
            await api.delete(`/admin/orders/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Order Deleted");
            navigate('/admin');
        } catch (e) {
            toast.error("Delete failed");
        } finally { setUpdating(false); }
    };

    const handleDeleteOrder = () => {
        toast("Delete Order?", {
            description: "Permanent action. This will wipe order data.",
            action: { label: "Delete", onClick: executeDelete },
            cancel: { label: "No", onClick: () => toast.dismiss() },
        });
    };

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center gap-4 bg-slate-50/50">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Syncing Order Data...</p>
        </div>
    );

    if (!order) return null;

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 md:p-12 animate-in fade-in duration-500 relative">
            
            {/* --- PARTNER ASSIGNMENT MODAL --- */}
            {showAssignModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-slate-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Assign Partner</h2>
                            <button onClick={() => setShowAssignModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <p className="text-xs font-bold text-slate-500 leading-relaxed italic">
                                Matching partners found in <span className="text-indigo-600 font-black">{order.customerDetails.address?.split(',')[0]}</span> for <span className="text-indigo-600 font-black">{order.items[0]?.name}</span>.
                            </p>
                            
                            <div className="relative">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Select Professional</label>
                                {fetchingPartners ? (
                                    <div className="w-full p-4 bg-slate-50 rounded-2xl animate-pulse text-sm font-bold text-slate-400">Searching nearby experts...</div>
                                ) : (
                                    <select 
                                        value={selectedPartnerId}
                                        onChange={(e) => setSelectedPartnerId(e.target.value)}
                                        className="w-full mt-1.5 p-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-indigo-600 transition-all font-bold text-sm appearance-none"
                                    >
                                        <option value="">Choose a partner...</option>
                                        {partners.map(p => (
                                            <option key={p._id} value={p._id}>{p.name} ({p.phone})</option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <button
                                disabled={!selectedPartnerId || updating}
                                onClick={() => handleStatusUpdate('confirmed', selectedPartnerId)}
                                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
                            >
                                {updating ? "Sending Notifications..." : "Confirm & Notify Partner"}
                            </button>
                            <p className="text-[9px] text-center text-slate-400 font-medium px-4">
                                On confirmation, an automated SMS and Email will be dispatched to the partner with customer details.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div>
                        <span onClick={() => navigate('/admin')} className="flex items-center gap-2 cursor-pointer hover:text-indigo-400 text-indigo-600 font-bold text-xs transition-colors mb-4 uppercase tracking-wider">
                            <ChevronLeft size={16} /> Back to Dashboard
                        </span>
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">{order.orderId}</h1>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                order.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                                order.status === 'cancelled' ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'
                            }`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-slate-500 font-medium mt-1 italic">Internal Ref: {order._id}</p>
                    </div>

                    {/* Status Management Bar */}
                    <div className="bg-white p-2 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-wrap gap-1">
                        {['pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
                            <button
                                key={s}
                                disabled={updating}
                                onClick={() => handleStatusClick(s)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                                    order.status === s ? 'bg-slate-900 text-white shadow-lg' : 'hover:bg-slate-50 text-slate-400'
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                    <button onClick={handleDeleteOrder} className="h-10 px-4 flex items-center gap-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all border border-rose-100 font-black text-[10px]">
                        <Trash2 size={16} /> Delete
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Items & Summary */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                            <h3 className="text-sm font-black text-slate-900 mb-8 flex items-center gap-2 uppercase tracking-widest">
                                <Package size={18} className="text-indigo-600" /> Catalog Items
                            </h3>

                            <div className="space-y-8">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-6 group">
                                        <div className="h-20 w-20 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 shrink-0">
                                            <img src={item.image || item.serviceId?.image || 'https://via.placeholder.com/150'} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-black text-slate-800 text-lg truncate">{item.name}</h4>
                                            <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                                <span>Price: ₹{item.price}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1 text-indigo-500"><Clock size={10} /> Instant Sync</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-slate-900 text-xl">₹{item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-10 pt-8 border-t border-dashed border-slate-100 space-y-3">
                                <div className="flex justify-between text-slate-500 font-bold text-sm">
                                    <span>Subtotal</span>
                                    <span>₹{order.totalAmount - order.serviceFee}</span>
                                </div>
                                <div className="flex justify-between text-slate-500 font-bold text-sm">
                                    <span>Service Fee</span>
                                    <span>₹{order.serviceFee}</span>
                                </div>
                                <div className="flex justify-between items-center pt-4">
                                    <span className="text-slate-900 font-black text-xl">Total Payable</span>
                                    <span className="text-4xl font-black text-indigo-600 tracking-tighter">₹{order.totalAmount}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Customer & Info */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-200">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Customer</h3>
                                <User size={16} className="text-indigo-400" />
                            </div>
                            <div className="space-y-1 mb-8">
                                <p className="font-black text-2xl tracking-tight">{order.customerDetails.name}</p>
                                <p className="text-sm text-slate-400 flex items-center gap-2"><Mail size={12} /> {order.customerDetails.email}</p>
                            </div>
                            <div className="pt-6 border-t border-slate-800 space-y-4">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-bold text-slate-500 uppercase">Clerk ID</span>
                                    <span className="font-mono text-indigo-300">{order.userId}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-bold text-slate-500 uppercase">Payment</span>
                                    <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-black">PAID</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Booking Context</h3>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="h-8 w-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0"><Calendar size={16} /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Booked On</p>
                                        <div className='flex gap-1.5'>
                                            <p className="text-sm font-bold text-slate-800">{new Date(order.bookingDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                            <p className="text-[11px] font-black text-indigo-500 mt-0.5 flex items-center gap-1"><Clock size={10} /> {new Date(order.bookingDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-8 w-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0"><MapPin size={16} /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase">Address</p>
                                        <p className="text-sm font-bold text-slate-800">{order.customerDetails.address || "No address"}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-8 w-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0"><Phone size={16} /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase">Phone</p>
                                        <p className="text-sm font-bold text-slate-800">{order.customerDetails.phone || "No phone"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageOrderDetails;