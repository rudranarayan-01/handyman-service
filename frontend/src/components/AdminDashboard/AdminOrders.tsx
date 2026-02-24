import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Package, Eye, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '@/api/api';
import { Button } from '../ui/button';

const AdminOrders = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    
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
                setFilteredOrders(response.data);
            } catch (error) {
                toast.error("Failed to load orders");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [getToken]);

    // Search and Filter Logic
    useEffect(() => {
        let result = orders;
        if (searchTerm) {
            result = result.filter(o => 
                o.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                o.customerDetails?.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (statusFilter !== "all") {
            result = result.filter(o => o.status === statusFilter);
        }
        setFilteredOrders(result);
    }, [searchTerm, statusFilter, orders]);

    if (loading) return <div className="h-screen flex items-center justify-center font-black text-slate-300 animate-pulse uppercase tracking-widest">Scanning Orders...</div>;

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">System Orders</h2>
                    <p className="text-slate-500 font-medium">Manage and monitor all incoming bookings</p>
                </div>
                <div className="bg-white px-6 py-3 rounded-[1.5rem] border border-slate-100 flex items-center gap-3 shadow-sm">
                    <Package size={22} className="text-indigo-600" />
                    <span className="font-black text-lg">{orders.length} <span className="text-slate-400 text-sm uppercase">Total</span></span>
                </div>
            </div>

            {/* Toolbar: Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text"
                        placeholder="Search by Order ID or Email..."
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-600 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select 
                    className="px-6 py-4 bg-white border border-slate-100 rounded-2xl font-bold text-slate-600 outline-none shadow-sm cursor-pointer"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-xl shadow-slate-100/50">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            <th className="p-6">Identification</th>
                            <th className="p-6">Customer Context</th>
                            <th className="p-6">Revenue</th>
                            <th className="p-6">Status</th>
                            <th className="p-6 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredOrders.map((order) => (
                            <tr
                                key={order._id}
                                className="group hover:bg-slate-50/50 transition-all cursor-pointer"
                                onClick={() => navigate(`/admin/orders/${order.orderId}`)} // Navigate using Custom ID
                            >
                                <td className="p-6">
                                    <span className="font-black text-sm text-indigo-600 tracking-tighter bg-indigo-50 px-3 py-1 rounded-lg">
                                        {order.orderId || `#${order._id.slice(-6).toUpperCase()}`}
                                    </span>
                                    <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase">
                                        {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                    </p>
                                </td>
                                <td className="p-6">
                                    <p className="font-bold text-slate-800 leading-none mb-1">
                                        {order.customerDetails?.name || "Guest User"}
                                    </p>
                                    <p className="text-xs text-slate-400 font-medium">{order.customerDetails?.email}</p>
                                </td>
                                <td className="p-6 font-black text-slate-900 text-lg tracking-tighter">
                                    ₹{order.totalAmount}
                                </td>
                                <td className="p-6">
                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 w-fit border ${
                                        order.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                        order.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                        order.status === 'cancelled' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                        'bg-slate-100 text-slate-600 border-slate-200'
                                    }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${
                                             order.status === 'completed' ? 'bg-emerald-600' :
                                             order.status === 'pending' ? 'bg-amber-600' : 'bg-slate-600'
                                        }`} />
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-6 text-right">
                                    <Button className="p-3 bg-slate-50 text-slate-400 group-hover:text-white group-hover:bg-indigo-600 rounded-2xl transition-all duration-300">
                                        <Eye size={18} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {filteredOrders.length === 0 && (
                    <div className="p-20 text-center">
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No orders found matching criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;