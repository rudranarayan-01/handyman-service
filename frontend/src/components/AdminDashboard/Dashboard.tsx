import React, { useState } from 'react';
import { 
  LayoutDashboard, Settings, Users, Package, Calendar, LogOut, 
  Search, Bell, TrendingUp, PackageCheck, IndianRupee, 
  ArrowUpRight, ArrowDownRight, CheckCircle2 
} from 'lucide-react';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-[#F4F7FE] flex font-sans antialiased text-slate-900">
      {/* --- Sidebar --- */}
      <aside className="w-72 bg-slate-900 flex flex-col p-6 fixed h-full shadow-2xl">
        <div className="flex items-center gap-4 mb-12 px-2">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/40">
            <Package className="text-white" size={24} />
          </div>
          <span className="font-black text-2xl text-white tracking-tight">Handyman Admin</span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem id="dashboard" label="Dashboard" icon={<LayoutDashboard size={20}/>} activeTab={activeTab} setActiveTab={setActiveTab} />
          <SidebarItem id="services" label="Manage Services" icon={<Package size={20}/>} activeTab={activeTab} setActiveTab={setActiveTab} />
          <SidebarItem id="orders" label="All Orders" icon={<Calendar size={20}/>} activeTab={activeTab} setActiveTab={setActiveTab} />
          <SidebarItem id="users" label="User Directory" icon={<Users size={20}/>} activeTab={activeTab} setActiveTab={setActiveTab} />
          <SidebarItem id="settings" label="App Settings" icon={<Settings size={20}/>} activeTab={activeTab} setActiveTab={setActiveTab} />
        </nav>

        <button className="flex items-center gap-4 p-4 text-slate-400 hover:text-rose-400 transition-all font-bold mt-auto group">
          <div className="p-2 rounded-lg group-hover:bg-rose-500/10 transition-all"><LogOut size={20}/></div>
          Sign Out
        </button>
      </aside>

      {/* --- Main Content --- */}
      <main className="ml-72 flex-1 flex flex-col">
        {/* Header */}
        <header className="px-10 py-6 flex justify-between items-center bg-transparent">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
                type="text" 
                placeholder="Search analytics, orders..." 
                className="w-full bg-white/80 backdrop-blur-md pl-12 pr-4 py-3 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium" 
            />
          </div>
          <div className="flex items-center gap-6">
            <button className="p-3 bg-white rounded-2xl text-slate-500 shadow-sm hover:shadow-md transition-all relative">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 bg-white p-1.5 pr-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-indigo-200 shadow-lg">A</div>
                <span className="text-sm font-bold text-slate-700">Admin</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="px-10 pb-10 flex-1">
          {activeTab === 'dashboard' && <DashboardStats />}
          {/* Other tabs follow the same pattern */}
        </div>
      </main>
    </div>
  );
};

// --- Sub-Components ---

const SidebarItem = ({ id, label, icon, activeTab, setActiveTab }: any) => (
    <button 
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 font-bold text-sm ${
            activeTab === id 
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
        }`}
    >
        {icon} {label}
    </button>
);

const DashboardStats = () => {
    const stats = [
        { label: 'Total Revenue', value: '₹2,45,000', growth: '+12.5%', isPos: true, icon: <IndianRupee size={22}/>, color: 'emerald' },
        { label: 'Active Orders', value: '142', growth: '+8.2%', isPos: true, icon: <PackageCheck size={22}/>, color: 'indigo' },
        { label: 'New Customers', value: '1,205', growth: '-2.4%', isPos: false, icon: <Users size={22}/>, color: 'blue' },
        { label: 'Growth Rate', value: '18.4%', growth: '+4.1%', isPos: true, icon: <TrendingUp size={22}/>, color: 'purple' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50 flex flex-col justify-between hover:translate-y-[-5px] transition-all duration-300">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 bg-${s.color}-50 text-${s.color}-600 rounded-2xl`}>{s.icon}</div>
                            <span className={`flex items-center gap-1 text-[11px] font-black ${s.isPos ? 'text-emerald-500' : 'text-rose-500'} bg-slate-50 px-2 py-1 rounded-lg`}>
                                {s.growth} {s.isPos ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
                            </span>
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{s.label}</p>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{s.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Recent Activity Card */}
                <div className="lg:col-span-2 bg-white rounded-[3rem] shadow-sm border border-slate-50 p-10">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-2xl font-black text-slate-900">Recent Service Activity</h3>
                        <button className="text-indigo-600 font-bold text-sm bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-all">View All</button>
                    </div>
                    <div className="space-y-8">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                        {item}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">Kitchen Deep Cleaning</h4>
                                        <p className="text-sm text-slate-400 font-medium">Customer: Rajesh Kumar • 2 mins ago</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block font-black text-slate-900 text-lg">₹2,999</span>
                                    <span className="flex items-center gap-1 text-[10px] font-black text-emerald-500 uppercase tracking-widest"><CheckCircle2 size={12}/> Paid</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pro Insight Card */}
                <div className="bg-indigo-600 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
                    <div className="relative z-10 h-full flex flex-col">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8">
                            <TrendingUp size={28} />
                        </div>
                        <h3 className="text-3xl font-black mb-4 tracking-tighter">Growth Insight</h3>
                        <p className="text-indigo-100 font-medium text-lg leading-relaxed mb-10">
                            Demand for <span className="text-white font-bold underline underline-offset-4 text-xl">AC Servicing</span> has increased by **40%**. 
                        </p>
                        <button className="mt-auto w-full bg-white text-indigo-600 py-5 rounded-[1.5rem] font-black text-lg hover:shadow-xl hover:scale-[1.02] transition-all active:scale-95 shadow-lg">
                            Create Offer
                        </button>
                    </div>
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-indigo-400/20 rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>
    );
};