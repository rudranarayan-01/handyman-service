import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import {
    ChevronLeft, Package, Mail, MapPin, Phone,
    Trash2, X, Calendar, Clock, CreditCard,
    User, Hash, CheckCircle2, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/api/api';

interface OrderItem {
    serviceId: { _id: string; image?: string; duration?: string; category?: string; };
    name: string; price: number; image?: string;
}
interface FullOrderData {
    _id: string; orderId: string; userId: string;
    customerDetails: { name: string; email: string; address: string; city?: string; phone: string; };
    items: OrderItem[];
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    totalAmount: number; bookingDate: string; createdAt?: string;
    serviceFee: number; assignedPartner?: string;
    paymentMethod?: string; paymentStatus?: string;
}
interface Partner { _id: string; name: string; phone: string; }

const STATUS = {
    pending:   { bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
    confirmed: { bg: 'bg-indigo-100',  text: 'text-indigo-700',  dot: 'bg-indigo-500'  },
    completed: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    cancelled: { bg: 'bg-rose-100',    text: 'text-rose-700',    dot: 'bg-rose-500'    },
};

// ── Reusable info row ──
const InfoRow = ({ icon: Icon, color, label, value }: {
    icon: any; color: string; label: string; value: React.ReactNode;
}) => (
    <div className="flex items-center gap-3">
        <div className={`h-8 w-8 rounded-xl ${color} flex items-center justify-center shrink-0`}>
            <Icon size={14} />
        </div>
        <div className="min-w-0">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            <div className="text-sm font-bold text-slate-800 truncate">{value}</div>
        </div>
    </div>
);

// ── Skeleton ──
const Skeleton = ({ className }: { className: string }) => (
    <div className={`bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:600px_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded-xl ${className}`} />
);

const ManageOrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { getToken } = useAuth();

    const [order, setOrder]           = useState<FullOrderData | null>(null);
    const [loading, setLoading]       = useState(true);
    const [updating, setUpdating]     = useState(false);
    const [showModal, setShowModal]   = useState(false);
    const [partners, setPartners]     = useState<Partner[]>([]);
    const [partnerId, setPartnerId]   = useState('');
    const [fetching, setFetching]     = useState(false);
    const [imgLoaded, setImgLoaded]   = useState<Record<number, boolean>>({});

    const authGet  = async () => ({ headers: { Authorization: `Bearer ${await getToken()}` } });

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get(`/admin/orders/${orderId}`, await authGet());
                setOrder(res.data);
            } catch { toast.error("Order not found"); navigate('/admin'); }
            finally { setLoading(false); }
        })();
    }, [orderId]);

    const fetchPartners = async () => {
        if (!order) return;
        setFetching(true);
        const city = order.customerDetails.address.split(',')[1]?.trim() ?? order.customerDetails.address;
        try {
            const res = await api.get('/admin/partners/eligible', {
                params: { city, service: order.items[0]?.name },
                ...(await authGet())
            });
            setPartners(res.data);
        } catch { toast.error("Failed to load partners"); }
        finally { setFetching(false); }
    };

    const handleStatusClick = (s: string) => {
        if (s === 'confirmed') { fetchPartners(); setShowModal(true); }
        else handleUpdate(s);
    };

    const handleUpdate = async (newStatus: string, pid?: string) => {
        setUpdating(true);
        try {
            await api.patch(`/admin/orders/${orderId}`,
                { status: newStatus, partnerId: pid },
                await authGet()
            );
            setOrder(p => p ? { ...p, status: newStatus as any } : null);
            setShowModal(false);
            toast.success(pid ? 'Confirmed & Partner notified!' : `Status → ${newStatus}`);
        } catch (e: any) {
            toast.error(e.response?.data?.message || "Failed");
        } finally { setUpdating(false); }
    };

    const handleDelete = () => toast("Delete Order?", {
        description: "This is permanent and cannot be undone.",
        action: { label: "Delete", onClick: async () => {
            try {
                await api.delete(`/admin/orders/${orderId}`, await authGet());
                toast.success("Deleted"); navigate('/admin');
            } catch { toast.error("Delete failed"); }
        }},
        cancel: { label: "Cancel", onClick: () => toast.dismiss() },
    });

    if (loading) return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12">
            <style>{`@keyframes shimmer { 0%{background-position:-600px 0} 100%{background-position:600px 0} }`}</style>
            <div className="max-w-6xl mx-auto space-y-6">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-72" />
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-3xl p-8 space-y-5">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex gap-4">
                                <Skeleton className="h-20 w-20 rounded-2xl shrink-0" />
                                <div className="flex-1 space-y-2 pt-1">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-4">
                        {[40, 52, 44].map((h, i) => <Skeleton key={i} className={`h-${h} rounded-3xl`} />)}
                    </div>
                </div>
            </div>
        </div>
    );

    if (!order) return null;

    const sc = STATUS[order.status];
    const fmt = (d?: string) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
    const fmtFull = (d?: string) => d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

    return (
        <>
            <style>{`
                @keyframes shimmer { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
                @keyframes modalIn { from{opacity:0;transform:scale(0.96) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
                @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
            `}</style>

            {/* ── Modal ── */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(8px)', animation: 'fadeIn 0.2s ease forwards' }}
                >
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
                        style={{ animation: 'modalIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards' }}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center px-7 py-5 border-b border-slate-50">
                            <div>
                                <h2 className="text-base font-black text-slate-900">Assign Partner</h2>
                                <p className="text-[11px] text-slate-400 mt-0.5">Select a professional for this order</p>
                            </div>
                            <button onClick={() => setShowModal(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
                                <X size={15} className="text-slate-500" />
                            </button>
                        </div>

                        <div className="px-7 py-6 space-y-4">
                            {/* Info */}
                            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-4 py-3 text-[11px] font-bold text-indigo-700">
                                Partners in <span className="font-black">{order.customerDetails.address.split(',').slice(0,2).join(',')}</span> for <span className="font-black">{order.items[0]?.name}</span>
                            </div>

                            {/* Select */}
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">
                                    Select Professional
                                </label>
                                {fetching ? (
                                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                                        <Loader2 size={15} className="animate-spin text-indigo-500" />
                                        <span className="text-sm font-bold text-slate-400">Scanning city...</span>
                                    </div>
                                ) : (
                                    <select value={partnerId} onChange={e => setPartnerId(e.target.value)}
                                        className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold text-sm appearance-none cursor-pointer"
                                    >
                                        <option value="">{partners.length ? "Choose a partner..." : "No partners found"}</option>
                                        {partners.map(p => <option key={p._id} value={p._id}>{p.name} — {p.phone}</option>)}
                                    </select>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-1">
                                <button onClick={() => setShowModal(false)}
                                    className="flex-1 py-3.5 rounded-2xl border-2 border-slate-100 font-black text-[11px] uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-colors">
                                    Cancel
                                </button>
                                <button
                                    disabled={!partnerId || updating}
                                    onClick={() => handleUpdate('confirmed', partnerId)}
                                    className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                                >
                                    {updating
                                        ? <><Loader2 size={13} className="animate-spin" />Sending...</>
                                        : <><CheckCircle2 size={13} />Confirm & Notify</>
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Page ── */}
            <div className="min-h-screen bg-slate-50/60 p-4 md:p-8 lg:p-12">
                <div className="max-w-6xl mx-auto">

                    {/* Top bar */}
                    <div className="mb-8">
                        <button onClick={() => navigate('/admin')}
                            className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-bold text-xs uppercase tracking-widest mb-4 transition-colors group">
                            <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                            Back to Dashboard
                        </button>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{order.orderId}</h1>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${sc.bg} ${sc.text}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                                    {order.status}
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <div className="bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap gap-1">
                                    {(['pending','confirmed','completed','cancelled'] as const).map(s => (
                                        <button key={s} disabled={updating} onClick={() => handleStatusClick(s)}
                                            className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wide transition-all
                                                ${order.status === s ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                                <button onClick={handleDelete}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all border border-rose-100 font-black text-[10px] uppercase">
                                    <Trash2 size={14} />
                                    <span className="hidden sm:inline">Delete</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                        {/* Items */}
                        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Package size={13} className="text-indigo-600" /> Order Items
                            </p>

                            <div className="space-y-5">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 group/item">
                                        <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 shrink-0">
                                            {!imgLoaded[idx] && <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:400px_100%] animate-[shimmer_1.4s_ease-in-out_infinite]" />}
                                            <img
                                                src={item.image || item.serviceId?.image || 'https://via.placeholder.com/150'}
                                                alt={item.name}
                                                onLoad={() => setImgLoaded(p => ({ ...p, [idx]: true }))}
                                                className={`h-full w-full object-cover group-hover/item:scale-110 transition-transform duration-500 ${imgLoaded[idx] ? 'opacity-100' : 'opacity-0'}`}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-black text-slate-800 text-sm md:text-base truncate">{item.name}</h4>
                                            {item.serviceId?.category && <p className="text-[10px] font-bold text-indigo-500 uppercase mt-0.5">{item.serviceId.category}</p>}
                                        </div>
                                        <p className="font-black text-slate-900 text-lg shrink-0">₹{item.price}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="mt-8 pt-5 border-t border-slate-50 space-y-2.5">
                                <div className="flex justify-between text-sm">
                                    <span className="font-bold text-slate-400">Subtotal</span>
                                    <span className="font-black text-slate-700">₹{order.items.reduce((a, i) => a + i.price, 0)}</span>
                                </div>
                                {order.serviceFee > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="font-bold text-slate-400">Service Fee</span>
                                        <span className="font-black text-slate-700">₹{order.serviceFee}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-base pt-2 border-t border-slate-100">
                                    <span className="font-black text-slate-900">Total</span>
                                    <span className="font-black text-slate-900 text-xl">₹{order.totalAmount}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right col */}
                        <div className="space-y-4">

                            {/* Customer */}
                            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Customer</p>
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                                        <User size={17} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-black text-base truncate">{order.customerDetails.name}</p>
                                        <p className="text-[11px] text-slate-400 truncate">{order.customerDetails.email}</p>
                                    </div>
                                </div>
                                <div className="space-y-3 pt-4 border-t border-slate-800 text-slate-300">
                                    {[
                                        { icon: Hash,  label: 'Customer ID', val: <span className="font-mono text-[11px]">{order.userId}</span> },
                                        { icon: Mail,  label: 'Email',       val: order.customerDetails.email },
                                        { icon: Phone, label: 'Phone',       val: order.customerDetails.phone },
                                    ].map(({ icon: I, label, val }) => (
                                        <div key={label} className="flex items-start gap-2.5">
                                            <I size={12} className="text-slate-500 mt-0.5 shrink-0" />
                                            <div className="min-w-0">
                                                <p className="text-[9px] font-black text-slate-500 uppercase">{label}</p>
                                                <p className="text-[11px] font-bold truncate">{val}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Address */}
                            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Service Address</p>
                                <div className="flex gap-3">
                                    <div className="h-8 w-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
                                        <MapPin size={14} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 leading-relaxed">{order.customerDetails.address}</p>
                                        {order.customerDetails.city && (
                                            <span className="inline-block mt-2 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg uppercase">
                                                {order.customerDetails.city}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Order meta */}
                            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order Details</p>
                                <InfoRow icon={Hash}       color="bg-indigo-50 text-indigo-600"  label="Order ID"     value={<span className="font-mono">{order.orderId}</span>} />
                                <InfoRow icon={Calendar}   color="bg-emerald-50 text-emerald-600" label="Booking Date" value={fmt(order.bookingDate)} />
                                <InfoRow icon={Clock}      color="bg-blue-50 text-blue-600"       label="Created At"   value={fmtFull(order.createdAt)} />
                                <InfoRow icon={CreditCard} color="bg-purple-50 text-purple-600"   label="Payment"      value={
                                    <span className="flex items-center gap-2">
                                        {order.paymentMethod || 'Online'}
                                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {order.paymentStatus || 'paid'}
                                        </span>
                                    </span>
                                } />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ManageOrderDetails;