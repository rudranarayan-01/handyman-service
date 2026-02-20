import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft, MapPin, Calendar, CreditCard,
    ShieldCheck, Package, Hash, Clock, ArrowRight,
    Star
} from 'lucide-react';
import api from '@/api/api';
import { useAuth } from '@clerk/clerk-react';
import BackNavigation from './BackNavigation';
import FeedbackSection from './FeedbackSection';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const fetchOrder = async () => {
        try {
            const token = await getToken();
            const res = await api.get(`/orders/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrder(res.data);
            console.log(res.data);
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {

        fetchOrder();
    }, [id]);

    if (loading) return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4 mt-20">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-black text-xs uppercase tracking-[0.2em] text-gray-400">Loading Details</p>
        </div>
    );

    if (!order) return (
        <div className=" flex flex-col items-center justify-center text-center px-6">
            <h2 className="text-2xl font-black text-gray-900 uppercase">Order Not Found</h2>
            <button onClick={() => navigate('/order-history')} className="mt-4 text-blue-600 font-bold flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" /> Back to History
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFDFD] pb-20 mt-20">
            <BackNavigation />
            <main className="max-w-5xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div className="space-y-2">
                        <span className="text-2xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase">
                            Booking <span className="text-blue-600">Summary</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
                        <Hash className="w-4 h-4 text-gray-400" />
                        <span className="font-black text-gray-900 text-sm">{order._id.toUpperCase()}</span>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="bg-white rounded-[2.5rem]  border border-gray-300 shadow-xl shadow-gray-100/50 flex flex-col md:flex-row items-center mb-5">
                    <div className="flex-1 flex items-center gap-6 p-4">
                        <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${order.status === 'pending' ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-600'}`}>
                            <Package className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Current Status</p>
                            <h2 className="text-xl font-black text-gray-900 uppercase italic leading-none">{order.status}</h2>
                        </div>
                    </div>
                    {/* Partner Details Section */}
                    <div className="w-full md:w-auto p-8 border-t md:border-t-0 md:border-l  flex items-center min-w-75">
                        {order?.assignedPartner ? (
                            // --- If Partner is Assigned: Show Details ---
                            <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="flex flex-col">
                                    <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-0.5">Assigned Partner</p>
                                    <h4 className="font-black text-slate-800 leading-none mb-1">
                                        {order.assignedPartner.name}
                                    </h4>
                                    <a
                                        href={`tel:${order.assignedPartner.phone}`}
                                        className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
                                    >
                                        <span className="bg-slate-100 text-gray-900 p-1 rounded-md group-hover:bg-indigo-50">📞</span>
                                        {order.assignedPartner.phone}
                                    </a>
                                </div>
                            </div>
                        ) : (
                            // --- If No Partner: Show Searching Status ---
                            <div className="flex items-center gap-4">
                                <div className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                </div>
                                <div>
                                    <p className="font-black text-slate-800 text-sm tracking-tight">Our partner is being assigned</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Usually takes 2-5 mins</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Services & Payment */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* New: IMPORTANT - Scheduled Service Date Section */}
                        <div className="bg-[#F3F4F6] rounded-[2.5rem] p-8 border border-gray-200/50 flex flex-col md:flex-row items-center justify-between gap-4 transition-all hover:shadow-md">
                            <div className="flex items-center gap-6">
                                {/* Icon Container with subtle glass effect */}
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                                    <Calendar className="w-8 h-8 text-gray-900" />
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                                            Scheduled Service
                                        </p>
                                    </div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900 italic">
                                        {order.serviceDate ?
                                            new Date(order.serviceDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
                                            : "Date Not Set"}
                                    </h2>
                                </div>
                            </div>

                            {/* Right Side: Time Window with modern badge feel */}
                            <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-1 px-8 py-4 md:py-0 border-t md:border-t-0 md:border-l border-gray-200">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                    Arrival Window
                                </p>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-900" />
                                    <h3 className="text-xl font-black uppercase text-gray-900 tracking-tighter">
                                        {order.serviceTime || "10:00 AM - 12:00 PM"}
                                    </h3>
                                </div>
                            </div>
                        </div>

                        {/* Items Section */}
                        <div className="bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm">
                            <div className="bg-gray-900 px-10 py-6">
                                <h3 className="text-white font-black uppercase text-xs tracking-[0.3em] flex items-center gap-3">
                                    <div className="w-1 h-4 bg-blue-500"></div> Job Breakdown
                                </h3>
                            </div>
                            <div className="p-10 space-y-6">
                                {order.items.map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-2 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <span className="font-bold text-gray-800 text-lg">{item.name}</span>
                                        </div>
                                        <span className="font-black text-gray-900 text-xl tracking-tighter">₹{item.price}</span>
                                    </div>
                                ))}

                                <div className="pt-8 mt-4 border-t border-dashed border-gray-200 space-y-4">
                                    <div className="flex justify-between text-gray-400 font-bold text-sm">
                                        <span>ITEM TOTAL</span>
                                        <span className="text-gray-900">₹{order.totalAmount - (order.serviceFee || 49)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400 font-bold text-sm">
                                        <span>CONVENIENCE FEE</span>
                                        <span className="text-gray-900">₹{order.serviceFee || 49}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4">
                                        <h4 className="font-black text-gray-900 text-2xl uppercase tracking-tighter">Amount Paid</h4>
                                        <div className="text-right">
                                            <p className="text-3xl font-black text-blue-600 tracking-tighter">₹{order.totalAmount}</p>
                                            <p className="text-[10px] font-bold text-emerald-500 uppercase">Paid via Online</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Original Stats & Location */}
                    <div className="space-y-8">

                        <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm space-y-10">
                            {/* Booking Date (Kab order kiya tha) */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-blue-600" />
                                    <h3 className="font-black text-gray-400 uppercase text-[10px] tracking-[0.2em]">Booked On</h3>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-lg font-bold text-gray-900">
                                        {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </p>
                                    <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">
                                        at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-red-500" />
                                    <h3 className="font-black text-gray-400 uppercase text-[10px] tracking-[0.2em]">Location</h3>
                                </div>
                                <p className="text-lg font-bold text-gray-800 leading-snug">
                                    Bengaluru Palace, Vasanth Nagar, Bengaluru, Karnataka 560052
                                </p>
                            </section>

                            <section className="pt-6 border-t border-gray-50">
                                <button className="w-full bg-gray-900 hover:bg-black h-14 rounded-2xl font-black text-xs uppercase tracking-widest text-white transition-all flex items-center justify-center gap-2 group">
                                    Get Invoice <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </section>
                        </div>

                        {/* Support Card */}
                        <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100 text-center space-y-4">
                            <p className="font-bold text-gray-500 text-sm italic">Need help with this booking?</p>
                            <button className="text-gray-100 font-black uppercase text-xs tracking-widest border-b-2 border-gray-900 pb-1">
                                Contact Support
                            </button>
                        </div>
                    </div>

                </div>
                {order?.status === 'completed' && (
                    <FeedbackSection
                        existingFeedback={order.feedback}
                        onSuccess={fetchOrder} 
                    />
                )}
            </main>


        </div>
    );
};

export default OrderDetails;