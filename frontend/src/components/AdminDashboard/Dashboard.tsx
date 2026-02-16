import React, { useState } from 'react';
import {
    LayoutDashboard, Settings, Users, Package, Calendar, LogOut,
    Search, Bell, TrendingUp, PackageCheck, IndianRupee,
    ArrowUpRight, ArrowDownRight, CheckCircle2,
    UserRoundCheck
} from 'lucide-react';
import SidebarItem from './SideBar';
import UserDirectory from './UserDirectory';
import DashboardStats from './DashboardStats';
import AdminOrders from './AdminOrders';
import ManageServices from './ManageService';
import PartnerManagement from './PartnerManagement';

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

                <div className="flex-col gap-2">
                    <SidebarItem id="dashboard" label="Dashboard" icon={<LayoutDashboard size={20} />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <SidebarItem id="services" label="Manage Services" url="" icon={<Package size={20} />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <SidebarItem id="orders" label="All Orders" url="" icon={<Calendar size={20} />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <SidebarItem id="users" label="User Directory" url="" icon={<Users size={20} />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <SidebarItem id="partners" label="Partners" url="" icon={<UserRoundCheck size={20} />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <SidebarItem id="settings" label="App Settings" url="" icon={<Settings size={20} />} activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>

                <button className="flex items-center gap-4 p-4 text-slate-400 hover:text-rose-400 transition-all font-bold mt-auto group">
                    <div className="p-2 rounded-lg group-hover:bg-rose-500/10 transition-all"><LogOut size={20} /></div>
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
                    {activeTab === 'services' && <ManageServices />}
                    {activeTab === 'users' && <UserDirectory />}
                    {activeTab === 'orders' && <AdminOrders />}
                    {activeTab === 'partners' && <PartnerManagement />}
                </div>
            </main>
        </div>
    );
};

