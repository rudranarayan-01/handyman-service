import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Package, Eye, Search, Filter, Calendar, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '@/api/api';
import { Button } from '../ui/button';

// --- SKELETON COMPONENTS ---
const OrderRowSkeleton = () => (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-6 border-b border-slate-50 animate-pulse">
        <div className="h-10 w-24 bg-slate-100 rounded-lg md:flex-1" />
        <div className="space-y-2 md:flex-[2] w-full">
            <div className="h-4 w-3/4 bg-slate-100 rounded" />
            <div className="h-3 w-1/2 bg-slate-100 rounded" />
        </div>
        <div className="h-6 w-16 bg-slate-100 rounded md:flex-1" />
        <div className="h-8 w-24 bg-slate-100 rounded-full md:flex-1" />
        <div className="h-10 w-10 bg-slate-100 rounded-2xl ml-auto hidden md:block" />
    </div>
);

const AdminOrders = () => {
    const [orders, setOrders] = useState<any[]>([]);
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
            } catch (error) {
                toast.error("Failed to load orders");
            } finally {
                // Keep loader for extra 300ms for smooth transition
                setTimeout(() => setLoading(false), 300);
            }
        };
        fetchOrders();
    }, [getToken]);

    // UseMemo for optimized filtering (prevents re-filtering on every render)
    const filteredOrders = useMemo(() => {
        return orders.filter(o => {
            const matchesSearch = searchTerm === "" || 
                o.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                o.customerDetails?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.customerDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = statusFilter === "all" || o.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, statusFilter, orders]);

    return (
        <div className="p-4 md:p-10 max-w-7xl mx-auto min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">System Orders</h2>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-2 flex items-center gap-2">
                        <Calendar size={14} className="text-indigo-500" /> Real-time booking management
                    </p>
                </div>
                {!loading && (
                    <div className="bg-white px-6 py-4 rounded-[2rem] border border-slate-100 flex items-center gap-4 shadow-xl shadow-slate-200/50 animate-in zoom-in duration-500">
                        <div className="h-10 w-10 bg-indigo-50 rounded-2xl flex items-center justify-center">
                            <Package size={20} className="text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Total Volume</p>
                            <p className="font-black text-xl leading-none text-slate-900">{orders.length}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
                <div className="relative flex-[3] group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                    <input 
                        type="text"
                        placeholder="Search Identity, Email, or Name..."
                        className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-600 shadow-sm placeholder:text-slate-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative flex-1">
                    <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <select 
                        className="w-full pl-12 pr-6 py-5 bg-white border border-slate-100 rounded-[1.5rem] font-black text-xs uppercase tracking-widest text-slate-600 outline-none shadow-sm cursor-pointer appearance-none focus:ring-4 focus:ring-indigo-500/10"
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
            </div>

            {/* Table/Card Container */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-2xl shadow-slate-200/40 transition-all">
                {/* Desktop Header */}
                <div className="hidden md:grid grid-cols-5 bg-slate-50/50 border-b border-slate-100 p-6">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identification</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Context</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Status</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</span>
                </div>

                <div className="divide-y divide-slate-50">
                    {loading ? (
                        [...Array(6)].map((_, i) => <OrderRowSkeleton key={i} />)
                    ) : filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                            <div
                                key={order._id}
                                onClick={() => navigate(`/admin/orders/${order.orderId}`)}
                                className="group grid grid-cols-1 md:grid-cols-5 items-center p-6 hover:bg-indigo-50/30 transition-all cursor-pointer relative animate-in fade-in slide-in-from-bottom-2"
                            >
                                {/* Identification */}
                                <div className="mb-4 md:mb-0">
                                    <span className="font-black text-xs text-indigo-600 tracking-tighter bg-indigo-50 px-3 py-1.5 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        {order.orderId || `#${order._id.slice(-6).toUpperCase()}`}
                                    </span>
                                    <p className="text-[9px] text-slate-400 font-black mt-2 uppercase tracking-tighter">
                                        {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>

                                {/* Customer */}
                                <div className="mb-4 md:mb-0">
                                    <p className="font-black text-slate-800 text-sm md:text-base leading-none mb-1">
                                        {order.customerDetails?.name || "Guest User"}
                                    </p>
                                    <p className="text-[11px] text-slate-400 font-bold truncate max-w-[200px]">{order.customerDetails?.email}</p>
                                </div>

                                {/* Revenue */}
                                <div className="mb-4 md:mb-0">
                                    <p className="text-[10px] md:hidden font-black text-slate-400 uppercase mb-1">Revenue</p>
                                    <p className="font-black text-slate-900 text-xl tracking-tighter">₹{order.totalAmount}</p>
                                </div>

                                {/* Status */}
                                <div className="mb-4 md:mb-0">
                                    <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 w-fit border shadow-sm ${
                                        order.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                        order.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                        order.status === 'cancelled' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                        'bg-slate-100 text-slate-600 border-slate-200'
                                    }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                                            order.status === 'completed' ? 'bg-emerald-600' :
                                            order.status === 'pending' ? 'bg-amber-600' : 'bg-slate-600'
                                        }`} />
                                        {order.status}
                                    </span>
                                </div>

                                {/* Action */}
                                <div className="flex md:block justify-end">
                                    <Button className="w-full md:w-fit md:ml-auto flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl md:bg-slate-50 md:text-slate-400 md:group-hover:text-white md:group-hover:bg-indigo-600 transition-all duration-300">
                                        <span className="md:hidden text-xs font-black uppercase tracking-widest">View Details</span>
                                        <Eye size={18} />
                                    </Button>
                                </div>
                                
                                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-200 md:hidden" size={20} />
                            </div>
                        ))
                    ) : (
                        <div className="p-20 text-center flex flex-col items-center justify-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-4">
                                <Search size={32} className="text-slate-200" />
                            </div>
                            <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">No matches found for your criteria</p>
                            <Button variant="ghost" className="mt-4 text-indigo-600 font-bold" onClick={() => {setSearchTerm(""); setStatusFilter("all")}}>
                                Reset Filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;