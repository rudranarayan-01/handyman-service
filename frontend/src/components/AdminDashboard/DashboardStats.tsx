import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react"; // Token fetch karne ke liye
import { 
  IndianRupee, PackageCheck, Users, TrendingUp, 
  PackageOpen 
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import api from "@/api/api";

const DashboardStats = () => {
    const { getToken } = useAuth(); // Clerk's magic function
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
                
                // 1. Get Fresh Token from Clerk
                const token = await getToken();
                
                // 2. Set Headers for Authorization
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                // 3. Parallel API Calls with Token
                const [statsRes, ordersRes] = await Promise.all([
                    api.get('/admin/dashboard-stats', config),
                    api.get('/admin/orders-recent', config)
                ]);

                // 4. Update States
                setStats({
                    revenue: statsRes.data.revenue || 0,
                    activeOrders: statsRes.data.activeOrders || 0,
                    totalCustomers: statsRes.data.totalCustomers || 0,
                    growthRate: statsRes.data.growthRate || "18.4%"
                });
                setRecentOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);

            } catch (err: any) {
                console.error("Dashboard Fetch Error (401 Check):", err.response || err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [getToken]);

    if (loading) return <div className="p-20 text-center font-black text-slate-400 animate-pulse text-2xl">UPDATING DASHBOARD...</div>;

    const cards = [
        { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: <IndianRupee size={22} />, color: 'emerald' },
        { label: 'Active Orders', value: stats.activeOrders, icon: <PackageCheck size={22} />, color: 'indigo' },
        { label: 'Total Customers', value: stats.totalCustomers, icon: <Users size={22} />, color: 'blue' },
        { label: 'Growth Rate', value: stats.growthRate, icon: <TrendingUp size={22} />, color: 'purple' },
    ];

    return (
        <div className="space-y-10">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {cards.map((s, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50 flex flex-col justify-between hover:scale-[1.02] transition-transform">
                        <div className={`w-12 h-12 mb-6 rounded-2xl flex items-center justify-center ${
                            s.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 
                            s.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                            s.color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                        }`}>
                            {s.icon}
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{s.label}</p>
                            <h3 className="text-3xl font-black text-slate-900">{s.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders List */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-slate-50 p-10">
                <h3 className="text-2xl font-black text-slate-900 mb-10">Recent Activity</h3>
                <div className="space-y-6">
                    {recentOrders.length > 0 ? recentOrders.map((order, idx) => (
                        <div key={order._id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-[2rem] transition-all group border border-transparent hover:border-slate-100">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    {order.userDetails?.fullName?.charAt(0) || (idx + 1)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg">{order.items?.[0]?.name || "Service"}</h4>
                                    <p className="text-sm text-slate-400 font-bold">
                                        {order.userDetails?.fullName || order.customerDetails?.name || 'Guest User'} • 
                                        {order.createdAt ? ` ${formatDistanceToNow(new Date(order.createdAt))} ago` : ' just now'}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block font-black text-slate-900 text-lg">₹{order.totalAmount}</span>
                                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${order.status === 'confirmed' ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'}`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-20 flex flex-col items-center">
                            <PackageOpen size={48} className="text-slate-200 mb-4" />
                            <p className="text-slate-400 font-bold text-xl">No Recent Orders Found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;