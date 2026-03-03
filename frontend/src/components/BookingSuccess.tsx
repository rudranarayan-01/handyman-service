import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Calendar, MapPin, Loader2, Phone, Zap, ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import api from '@/api/api';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
interface OrderDetails {
    _id: string;
    scheduledDate: string;
    scheduledTime: string;
    address: string;
    serviceName: string;
    totalAmount: number;
}

const BookingSuccess = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // --- Data Fetching ---
    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderId) {
                setLoading(false);
                setError(true);
                return;
            }
            try {
                console.log("Fetching order details for ID:", orderId);
                const response = await api.get(`/orders/details/${orderId}`);
                setOrder(response.data);
            } catch (err) {
                console.error("Fetch error:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    // --- State Renders ---
    if (loading) return <LoadingScreen />;
    if (error || !order) return <ErrorScreen />;

    return (
        <div className="min-h-screen bg-white md:bg-slate-50 flex items-center justify-center p-0 md:p-6 font-sans">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white md:rounded-[3rem] md:shadow-2xl md:border md:border-slate-100 overflow-hidden relative"
            >
                {/* Header: Status Icon & Title */}
                <div className="pt-16 pb-8 px-8 text-center">
                    <div className="mb-8 relative inline-block">
                        <div className="absolute inset-0 bg-emerald-100 rounded-full scale-150 blur-2xl opacity-50 animate-pulse" />
                        <CheckCircle2 className="w-20 h-20 md:w-24 md:h-24 text-emerald-500 relative z-10 mx-auto stroke-[1.5px]" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-3 leading-none">
                        Booking <span className="text-emerald-500">Confirmed!</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-sm md:text-base px-2 leading-relaxed">
                        Your service for <span className="text-slate-900 font-bold">{order.serviceName}</span> is locked in.
                    </p>
                </div>

                {/* Body: Information Cards */}
                <div className="px-6 md:px-10 pb-10">
                    <div className="bg-slate-50 rounded-[2.5rem] p-6 md:p-8 border border-slate-100 space-y-6">
                        <InfoRow 
                            icon={<Calendar className="text-indigo-600" size={20} />}
                            label="Date & Time"
                            value={<>{order.scheduledDate} <span className="text-indigo-600 block">{order.scheduledTime}</span></>}
                        />
                        
                        <InfoRow 
                            icon={<MapPin className="text-rose-500" size={20} />}
                            label="Service Location"
                            value={order.address}
                        />

                        <div className="pt-4 border-t border-slate-200/60">
                            <InfoRow 
                                icon={<Zap className="text-amber-500" size={20} />}
                                label="Total Amount Paid"
                                value={`₹${order.totalAmount}`}
                                isHighlight
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 space-y-4">
                        <Link to="/">
                            <Button className="w-full bg-slate-900 text-white py-8 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-slate-200 hover:bg-indigo-600 transition-all active:scale-95">
                                Return to Dashboard
                            </Button>
                        </Link>
                        
                        <div className="flex flex-col items-center gap-1">
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                                Order Reference
                            </p>
                            <code className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                                #{order._id.slice(-8).toUpperCase()}
                            </code>
                        </div>
                    </div>
                </div>

                {/* Footer: Support */}
                <div className="bg-slate-900 py-5 px-8 text-center">
                    <p className="text-white/50 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                        Need assistance? <span className="text-emerald-400 flex items-center gap-1"><Phone size={12} /> Support Active</span>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

// --- Helper Components for Cleanliness ---

const InfoRow = ({ icon, label, value, isHighlight = false }: any) => (
    <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
            {icon}
        </div>
        <div className="flex-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <div className={`text-slate-900 leading-tight ${isHighlight ? 'text-xl font-black' : 'text-sm font-bold uppercase'}`}>
                {value}
            </div>
        </div>
    </div>
);

const LoadingScreen = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
            <Loader2 className="w-12 h-12 text-emerald-500" />
        </motion.div>
        <p className="mt-4 text-slate-400 font-black uppercase tracking-widest text-[10px]">Syncing with servers...</p>
    </div>
);

const ErrorScreen = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50">
        <div className="bg-white p-10 rounded-[3rem] shadow-xl max-w-sm w-full border border-slate-100">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap size={30} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Order Not Found</h2>
            <p className="text-slate-500 text-sm mb-8">We couldn't retrieve your booking details. Please check your internet or order ID.</p>
            <Link to="/">
                <Button className="w-full py-6 bg-slate-900 rounded-2xl font-bold uppercase tracking-widest text-[10px] text-white">
                    Go Back Home
                </Button>
            </Link>
        </div>
    </div>
);

export default BookingSuccess;