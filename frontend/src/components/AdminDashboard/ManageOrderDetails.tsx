import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import {
    ChevronLeft, Package, User, CreditCard,
    Calendar, CheckCircle, Clock, AlertCircle,
    Truck, XCircle, Mail, MapPin,
    Map,
    Phone,
    Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/api/api';

// Interface matching your Scalable Schema
interface OrderItem {
    serviceId: {
        _id: string;
        image?: string;
        duration?: string;
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
        phone: string
    };
    items: OrderItem[];
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    totalAmount: number;
    bookingDate: string;
    serviceFee: number;
}

const ManageOrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { getToken } = useAuth();

    const [order, setOrder] = useState<FullOrderData | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const fetchOrderDetails = async () => {
        try {
            const token = await getToken();
            const response = await api.get(`/admin/orders/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrder(response.data);
        } catch (error: any) {
            toast.error("Order not found or access denied");
            navigate('/admin');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrderDetails(); }, [orderId]);

    const handleStatusUpdate = async (newStatus: string) => {
        setUpdating(true);
        const updateAction = async () => {
            const token = await getToken();
            await api.patch(`/admin/orders/${orderId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // State update in UI
            setOrder(prev => prev ? { ...prev, status: newStatus as any } : null);
        };

        toast.promise(updateAction(), {
            loading: `Updating status to ${newStatus}...`,
            success: `Order is now ${newStatus}`,
            error: (err) => err.response?.data?.message || "Failed to update status",
        });

        try {
            await updateAction;
        } catch (e) {
            console.error(e);
        } finally {
            setUpdating(false);
        }
    };

    const handleDeleteOrder = () => {
        // 1. Pehle hum sirf ek confirmation toast dikhayenge
        toast("Delete Order?", {
            description: "This action cannot be undone and will remove the order from the database.",
            action: {
                label: "Yes, Delete",
                onClick: () => executeDelete(), // Agar user click karega tabhi delete hoga
            },
            cancel: {
                label: "No",
                onClick: () => toast.dismiss(),
            },
            // Styling for danger
            className: "bg-white border-red-100",
        });
    };

    const executeDelete = async () => {
        setUpdating(true);
        const deletePromise = async () => {
            const token = await getToken();
            await api.delete(`/admin/orders/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/admin');
        };

        toast.promise(deletePromise(), {
            loading: 'Deleting order...',
            success: 'Order Deleted!',
            error: 'Unable to delete order',
        });
        setUpdating(false);
    };

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center gap-4 bg-slate-50/50">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Syncing Order Data...</p>
        </div>
    );

    if (!order) return null;

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 md:p-12 animate-in fade-in duration-500">
            <div className="max-w-6xl mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div>
                        <span
                            onClick={() => navigate('/admin')}
                            className="flex items-center gap-2 cursor-pointer hover:text-indigo-400 text-indigo-600 font-bold text-xs transition-colors mb-4 uppercase tracking-wider"
                        >
                            <ChevronLeft size={16} /> Back to Dashboard
                        </span>
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                                {order.orderId}
                            </h1>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${order.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
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
                                onClick={() => handleStatusUpdate(s)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${order.status === s
                                    ? 'bg-slate-900 text-white shadow-lg'
                                    : 'hover:bg-slate-50 text-slate-400'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                    <button
                        disabled={updating}
                        onClick={handleDeleteOrder} // Ab ye toast wala function call karega
                        className="h-10 px-4 flex items-center gap-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all border border-rose-100 font-black text-[10px]"
                    >
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
                                            <img
                                                src={item.image || item.serviceId?.image || 'https://via.placeholder.com/150'}
                                                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                alt=""
                                            />
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

                            {/* Calculation Area */}
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
                        {/* Customer Profile */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-200">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Customer</h3>
                                <User size={16} className="text-indigo-400" />
                            </div>

                            <div className="space-y-1 mb-8">
                                <p className="font-black text-2xl tracking-tight">{order.customerDetails.name}</p>
                                <p className="text-sm text-slate-400 flex items-center gap-2">
                                    <Mail size={12} /> {order.customerDetails.email}
                                </p>
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

                        {/* Order Timeline Mini */}
                        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Booking Context</h3>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="h-8 w-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                        <Calendar size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Booked On</p>
                                        <div className='flex gap-1.5'>
                                            <p className="text-sm font-bold text-slate-800">
                                                {/* Date Format: 13 Feb 2026 */}
                                                {new Date(order.bookingDate).toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                            <p className="text-[11px] font-black text-indigo-500 mt-0.5 flex items-center gap-1">
                                                <Clock size={10} />
                                                {/* Time Format: 03:45 PM */}
                                                {new Date(order.bookingDate).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-8 w-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                                        <MapPin size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase">Address</p>
                                        <p className="text-sm font-bold text-slate-800">{order.customerDetails.address || "No address provided"}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-8 w-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                                        <Phone size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase">Phone</p>
                                        <p className="text-sm font-bold text-slate-800">{order.customerDetails.phone || "No address provided"}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-8 w-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                                        <Clock size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase">Time Slot</p>
                                        <p className="text-sm font-bold text-slate-800">Standard Service</p>
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