import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { 
  IndianRupee, PackageCheck, Users, TrendingUp, 
  PackageOpen 
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import api from "@/api/api";

// --- SKELETON COMPONENT ---
const StatsSkeleton = () => (
    <div className="space-y-6 md:space-y-10 animate-pulse">
        {/* 2x2 on mobile/tablet, 4x1 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-50 h-32 md:h-44 flex flex-col justify-between">
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl bg-slate-100" />
                    <div className="space-y-2">
                        <div className="h-2 w-12 bg-slate-100 rounded" />
                        <div className="h-6 w-20 bg-slate-100 rounded-lg" />
                    </div>
                </div>
            ))}
        </div>
        <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 border border-slate-50">
            <div className="h-6 w-32 bg-slate-100 rounded-lg mb-8" />
            <div className="space-y-4">
                {[1, 2].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 border-b border-slate-50">
                        <div className="flex items-center gap-3 md:gap-5">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-100" />
                            <div className="space-y-2">
                                <div className="h-4 w-24 md:w-40 bg-slate-100 rounded" />
                                <div className="h-2 w-16 md:w-24 bg-slate-100 rounded" />
                            </div>
                        </div>
                        <div className="h-6 w-12 bg-slate-100 rounded" />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const DashboardStats = () => {
    const { getToken } = useAuth();
    const [stats, setStats] = useState({
        revenue: 0,
        activeOrders: 0,
        totalCustomers: 0,
        growthRate: "18.4%"
    });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const token = await getToken();
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const [statsRes, ordersRes] = await Promise.all([
                    api.get('/admin/dashboard-stats', config),
                    api.get('/admin/orders-recent', config)
                ]);
                setStats({
                    revenue: statsRes.data.revenue || 0,
                    activeOrders: statsRes.data.activeOrders || 0,
                    totalCustomers: statsRes.data.totalCustomers || 0,
                    growthRate: statsRes.data.growthRate || "18.4%"
                });
                setRecentOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
            } catch (err) {
                console.error("Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [getToken]);

    if (loading) return <StatsSkeleton />;

    const cards = [
        { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: <IndianRupee size={20} />, color: 'emerald' },
        { label: 'Pending Orders', value: stats.activeOrders, icon: <PackageCheck size={20} />, color: 'indigo' },
        { label: 'Total Customers', value: stats.totalCustomers, icon: <Users size={20} />, color: 'blue' },
        { label: 'Growth Rate', value: stats.growthRate, icon: <TrendingUp size={20} />, color: 'purple' },
    ];

    return (
        <div className="space-y-6 md:space-y-10">
            {/* Stats Grid: 2 columns for mobile/tablet, 4 for desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                {cards.map((s, i) => (
                    <div key={i} className="bg-white p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border border-slate-50 flex flex-col justify-between hover:shadow-md transition-all">
                        <div className={`w-8 h-8 md:w-12 md:h-12 mb-3 md:mb-6 rounded-xl flex items-center justify-center ${
                            s.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 
                            s.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                            s.color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                        }`}>
                            {s.icon}
                        </div>
                        <div>
                            <p className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1">{s.label}</p>
                            <h3 className="text-lg md:text-3xl font-black text-slate-900">{s.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity: Single line layout with price on the right */}
            <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-sm border border-slate-50 p-6 md:p-10">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg md:text-2xl font-black text-slate-900">Recent Activity</h3>
                    <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">View All</button>
                </div>

                <div className="space-y-2">
                    {recentOrders.length > 0 ? recentOrders.map((order) => (
                        <div key={order._id} className="flex items-center justify-between p-3 md:p-4 hover:bg-slate-50 rounded-2xl md:rounded-[2rem] transition-all group">
                            <div className="flex items-center gap-3 md:gap-5 min-w-0">
                                <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl md:rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all text-xs md:text-base">
                                    {order.userDetails?.fullName?.charAt(0) || "U"}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-bold text-slate-800 text-sm md:text-lg truncate">
                                        {order.items?.[0]?.name || "Service"}
                                    </h4>
                                    <p className="text-[10px] md:text-sm text-slate-400 font-bold truncate">
                                        {order.userDetails?.fullName || 'Guest User'} • {order.createdAt ? formatDistanceToNow(new Date(order.createdAt)) : 'now'}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Price and Status on the same line */}
                            <div className="flex flex-col items-end shrink-0 ml-4">
                                <span className="font-black text-slate-900 text-sm md:text-lg">₹{order.totalAmount}</span>
                                <span className={`text-[8px] md:text-[10px] font-black uppercase px-2 py-0.5 rounded-md mt-1 ${
                                    order.status === 'confirmed' ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'
                                }`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-10">
                            <PackageOpen size={40} className="mx-auto text-slate-200 mb-2" />
                            <p className="text-slate-400 font-bold">No Recent Orders</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;