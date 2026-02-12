import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Package, Eye, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '@/api/api';

interface OrderData {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  // manual lookup ke baad data userDetails field mein aayega
  userDetails: {
    firstName: string;
    lastName: string;
    email: string;
    photo: string;
  };
}
const AdminOrders = () => {
    const [orders, setOrders] = useState<OrderData[]>([]);
    const [loading, setLoading] = useState(true);
    const { getToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = await getToken();
                const response = await api.get('/admin/orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(response.data);
            } catch (error) {
                toast.error("Failed to load orders");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [getToken]);

    if (loading) return <div className="p-20 text-center font-bold text-slate-400 animate-pulse">Fetching Orders...</div>;

    return (
        <div className="p-4 max-w-7xl mx-auto animate-in fade-in duration-700">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Orders</h2>
                <div className="bg-white px-5 py-2 rounded-2xl border border-slate-100 flex items-center gap-2 shadow-sm">
                    <Package size={20} className="text-orange-500" />
                    <span className="font-bold">{orders.length} Total Orders</span>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-xl shadow-slate-100">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <th className="p-6">Order ID</th>
                            <th className="p-6">Customer</th>
                            <th className="p-6">Amount</th>
                            <th className="p-6">Status</th>
                            <th className="p-6 text-right">View</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {orders.map((order) => (
                            <tr
                                key={order._id}
                                className="group hover:bg-slate-50/80 transition-all cursor-pointer"
                                onClick={() => navigate(`/admin/orders/${order._id}`)} // Agla step: Details page
                            >
                                <td className="p-6">
                                    <span className="font-mono text-xs font-bold text-indigo-600">#{order._id.slice(-6).toUpperCase()}</span>
                                    <p className="text-[10px] text-slate-400 font-medium">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </td>
                                <td className="p-6">
                                    <p className="font-bold text-slate-800">{order.userDetails?.firstName} {order.userDetails?.lastName}</p>
                                    <p className="text-xs text-slate-400">{order.userDetails?.email}</p>
                                </td>
                                <td className="p-6">
                                    <p className="font-black text-slate-900">₹{order.totalAmount}</p>
                                </td>
                                <td className="p-6">
                                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-1.5 w-fit ${order.status === 'completed' ? 'bg-green-50 text-green-600' :
                                            order.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                                                'bg-slate-100 text-slate-600'
                                        }`}>
                                        {order.status === 'completed' ? <CheckCircle size={12} /> : <Clock size={12} />}
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-6 text-right">
                                    <button className="p-2 text-slate-400 group-hover:text-indigo-600 group-hover:bg-white rounded-xl shadow-none group-hover:shadow-sm transition-all">
                                        <Eye size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrders;