import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    MapPin, Calendar,
    Package, Hash, Clock, ArrowRight, Phone, MessageSquare
} from 'lucide-react';
import api from '@/api/api';
import { useAuth } from '@clerk/clerk-react';
import BackNavigation from './BackNavigation';
import FeedbackSection from './FeedbackSection';
import { generateInvoice } from '@/lib/generateInvoice';

// --- Skeleton Component for better UX ---
const DetailsSkeleton = () => (
    <div className="max-w-5xl mx-auto px-6 animate-pulse mt-20">
        <div className="h-10 w-64 bg-gray-200 rounded-xl mb-8" />
        <div className="h-24 w-full bg-gray-100 rounded-[2.5rem] mb-5" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
                <div className="h-32 bg-gray-100 rounded-[2.5rem]" />
                <div className="h-64 bg-gray-100 rounded-[3rem]" />
            </div>
            <div className="h-96 bg-gray-100 rounded-[3rem]" />
        </div>
    </div>
);

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // ✅ Performance: Memoized fetch function
    const fetchOrder = useCallback(async () => {
        try {
            const token = await getToken();
            const res = await api.get(`/orders/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrder(res.data);
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    }, [id, getToken]);

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

    // ✅ Performance: Memoized Date Formatting
    const formattedDates = useMemo(() => {
        if (!order) return null;
        return {
            booked: new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            service: order.serviceDate ? new Date(order.serviceDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : null,
            time: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
    }, [order]);

    if (loading) return <DetailsSkeleton />;

    if (!order) return (
        <div className="h-screen flex flex-col items-center justify-center text-center px-6">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Package className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Order Not Found</h2>
            <p className="text-gray-500 font-medium mb-6">We couldn't find the details for this booking.</p>
            <button onClick={() => navigate('/order-history')} className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all">
                Back to History
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFDFD] pb-20 mt-10 md:mt-20">
            <BackNavigation />
            <main className="max-w-5xl mx-auto px-4 md:px-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div className="space-y-1">
                        <span className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                            Booking <span className="text-blue-600">Summary</span>
                        </span>
                    </div>
                    <div className="flex items-center self-start md:self-auto gap-3 bg-white px-5 py-2.5 rounded-2xl border border-gray-200 shadow-sm">
                        <Hash className="w-4 h-4 text-blue-500" />
                        <span className="font-black text-gray-900 text-sm tracking-tight">{order.orderId.toUpperCase()}</span>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-200 shadow-xl shadow-gray-100/40 flex flex-col md:flex-row items-stretch mb-6 overflow-hidden">
                    <div className="flex-1 flex items-center gap-5 p-5 md:p-6">
                        <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-transform hover:scale-105 duration-300 ${order.status === 'pending' ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-600'}`}>
                            <Package className="w-7 h-7 md:w-8 md:h-8" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-0.5">Current Status</p>
                            <h2 className="text-lg md:text-xl font-black text-gray-900 uppercase italic leading-none">{order.status}</h2>
                        </div>
                    </div>

                    <div className="w-full md:w-auto p-5 md:p-8 bg-gray-50/50 border-t md:border-t-0 md:border-l border-gray-100 flex items-center min-w-[300px]">
                        {order?.assignedPartner ? (
                            <div className="flex items-center justify-between w-full md:justify-start gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="flex flex-col">
                                    <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-1">Assigned Partner</p>
                                    <h4 className="font-black text-slate-800 text-base md:text-lg leading-none mb-2">{order.assignedPartner.name}</h4>
                                    <a href={`tel:${order.assignedPartner.phone}`} className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors bg-white px-3 py-1.5 rounded-lg border border-gray-200 w-fit shadow-sm">
                                        <Phone size={12} className="text-blue-500" /> {order.assignedPartner.phone}
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 py-2">
                                <div className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                </div>
                                <div>
                                    <p className="font-black text-slate-800 text-sm tracking-tight">Assigning Partner...</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Usually takes 15-20 mins</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    <div className="lg:col-span-2 space-y-5">
                        {/* Scheduled Section */}
                        {['pending', 'confirmed'].includes(order?.status || '') && (
                            <div className="bg-white rounded-[2.5rem] p-5 md:p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-blue-100 transition-colors">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 md:w-16 md:h-16 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg">
                                        <Calendar className="w-7 h-7 md:w-8 md:h-8 text-white" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Scheduled For</p>
                                        </div>
                                        <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-gray-900 italic">
                                            {formattedDates?.service || "Date Not Set"}
                                        </h2>
                                    </div>
                                </div>
                                <div className="w-full sm:w-auto flex flex-col items-center sm:items-end gap-1 sm:pl-8 sm:border-l border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Arrival Window</p>
                                    <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                                        <Clock className="w-4 h-4 text-blue-600" />
                                        <h3 className="text-lg font-black uppercase text-blue-700 tracking-tighter">
                                            {order.serviceTime || "10-12 PM"}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Job Breakdown */}
                        <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] overflow-hidden border border-gray-200 shadow-sm transition-all hover:shadow-md">
                            <div className="bg-gray-900 px-8 md:px-10 py-5 md:py-6 flex justify-between items-center">
                                <h3 className="text-white font-black uppercase text-[10px] md:text-xs tracking-[0.3em] flex items-center gap-3">
                                    <div className="w-1 h-4 bg-blue-500"></div> Job Breakdown
                                </h3>
                                <span className="text-blue-400 text-[10px] font-black uppercase tracking-widest">Online Payment</span>
                            </div>
                            <div className="p-8 md:p-10 space-y-6">
                                {order.items.map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-2 rounded-full bg-blue-600 scale-0 group-hover:scale-100 transition-transform"></div>
                                            <span className="font-bold text-gray-700 text-base md:text-lg transition-colors group-hover:text-black">{item.name}</span>
                                        </div>
                                        <span className="font-black text-gray-900 text-lg md:text-xl tracking-tighter">₹{item.price}</span>
                                    </div>
                                ))}

                                <div className="pt-8 mt-4 border-t border-dashed border-gray-200 space-y-3">
                                    <div className="flex justify-between text-gray-400 font-bold text-xs uppercase tracking-widest">
                                        <span>Item Total</span>
                                        <span className="text-gray-900">₹{order.totalAmount - (order.serviceFee || 49)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400 font-bold text-xs uppercase tracking-widest">
                                        <span>Convenience Fee</span>
                                        <span className="text-gray-900">₹{order.serviceFee || 49}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-6">
                                        <h4 className="font-black text-gray-900 text-xl md:text-2xl uppercase tracking-tighter">Total Paid</h4>
                                        <div className="text-right">
                                            <p className="text-3xl md:text-4xl font-black text-blue-600 tracking-tighter">₹{order.totalAmount}</p>
                                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Transaction Successful</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column Side Info */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 border border-gray-200 shadow-sm space-y-10">
                            <section className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-blue-600" />
                                    <h3 className="font-black text-gray-400 uppercase text-[10px] tracking-widest">Booked On</h3>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <p className="text-lg font-black text-gray-900 leading-none">{formattedDates?.booked}</p>
                                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">At {formattedDates?.time}</p>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-red-500" />
                                    <h3 className="font-black text-gray-400 uppercase text-[10px] tracking-widest">Service Location</h3>
                                </div>
                                <p className="text-base md:text-lg font-bold text-gray-800 leading-snug tracking-tight">
                                    {order.customerDetails.address}
                                </p>
                            </section>

                            <section className="pt-2">
                                <button
                                    onClick={() => generateInvoice(order)}
                                    className="w-full bg-gray-900 hover:bg-blue-600 h-14 rounded-2xl font-black text-xs uppercase tracking-widest text-white transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2 group active:scale-95"
                                >
                                    Download Invoice <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </section>
                        </div>

                        <div className="bg-blue-50/50 rounded-[2rem] p-6 border border-blue-100/50 text-center">
                            <div className="flex justify-center -space-x-2 mb-4">
                                <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white text-[10px] font-black">?</div>
                            </div>
                            <p className="font-bold text-gray-600 text-xs mb-3">Questions about this booking?</p>
                            <button onClick={() => navigate("/contact")} className="flex items-center gap-2 mx-auto text-gray-900 font-black uppercase text-[10px] tracking-widest border-b-2 border-gray-900 pb-1 hover:text-blue-600 hover:border-blue-600 transition-colors">
                                <MessageSquare size={14} /> Contact Support
                            </button>
                        </div>
                    </div>
                </div>

                {order?.status === 'completed' && (
                    <div className="mt-8 animate-in fade-in zoom-in-95 duration-700">
                        <FeedbackSection
                            existingFeedback={order.feedback}
                            onSuccess={fetchOrder}
                        />
                    </div>
                )}
            </main>
        </div>
    );
};

export default OrderDetails;