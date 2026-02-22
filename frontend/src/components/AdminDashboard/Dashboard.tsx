import { useState } from 'react';
import {
    LayoutDashboard, Settings, Users, Package, Calendar, LogOut,
    Bell, UserRoundCheck
} from 'lucide-react';
import SidebarItem from './SideBar';
import UserDirectory from './UserDirectory';
import DashboardStats from './DashboardStats';
import AdminOrders from './AdminOrders';
import ManageServices from './ManageService';
import PartnerManagement from './PartnerManagement';
import AdminSettings from './AdminSettings';
import { useUser, UserButton, useClerk } from '@clerk/clerk-react';
import { Button } from '../ui/button';

export const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const { user, isLoaded } = useUser();
    const { signOut } = useClerk(); // Signout function from Clerk

    if (!isLoaded) return null; // Prevent flicker while Clerk loads

    return (
        <div className="min-h-screen bg-[#F4F7FE] flex font-sans antialiased text-slate-900">
            {/* --- Sidebar --- */}
            <aside className="w-72 bg-slate-200 flex flex-col gap-2 p-6 fixed h-full shadow-2xl z-50">
                {/* Logo Section */}
                <div className="flex items-center gap-4 mb-10 px-2">
                    <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/40">
                        <Package className="text-white" size={24} />
                    </div>
                    <span className="font-black text-2xl text-black tracking-tight leading-none cursor-pointer">
                        Handyman <br /><span className="text-indigo-900 text-xs uppercase tracking-[0.2em]">Admin Panel</span>
                    </span>
                </div>

                {/* Navigation Items - Gap added here */}
                <nav className="flex flex-col gap-3 flex-1">
                    <SidebarItem id="dashboard" label="Dashboard" icon={<LayoutDashboard size={20} />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <SidebarItem id="services" label="Manage Services" icon={<Package size={20} />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <SidebarItem id="orders" label="All Orders" icon={<Calendar size={20} />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <SidebarItem id="users" label="User Directory" icon={<Users size={20} />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <SidebarItem id="partners" label="Partners" icon={<UserRoundCheck size={20} />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <SidebarItem id="settings" label="App Settings" icon={<Settings size={20} />} activeTab={activeTab} setActiveTab={setActiveTab} />
                </nav>

                <Button>
                    <a href="/">My website</a>
                </Button>

                {/* Sign Out Button - Integrated with Clerk */}
                <button
                    onClick={() => signOut()}
                    className="flex items-center gap-4 p-2 hover:text-red-700 text-rose-400 transition-all font-bold mt-auto group rounded-2xl hover:bg-rose-500/5"
                >
                    <div className="p-2 rounded-lg group-hover:bg-rose-500/10 transition-all">
                        <LogOut size={20} />
                    </div>
                    Sign Out
                </button>
            </aside>

            {/* --- Main Content --- */}
            <main className="ml-72 flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="px-10 py-6 flex justify-between items-center bg-[#F4F7FE]/80 backdrop-blur-md sticky top-0 z-40">
                    <div className="relative w-full max-w-md">
                        <h1>Welcome Admin</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <button className="p-3 bg-white rounded-2xl text-slate-500 shadow-sm hover:shadow-md transition-all relative border border-slate-100">
                            <Bell size={20} />
                            <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

                        {/* User Profile - Fully Working with Clerk */}
                        <div className="flex items-center gap-3 bg-white p-1.5 pr-4 rounded-2xl shadow-sm border border-slate-100">
                            <UserButton
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        avatarBox: "w-9 h-9 rounded-xl shadow-lg shadow-indigo-100"
                                    }
                                }}
                            />
                            <div className="flex flex-col">
                                <span className="text-xs font-black text-slate-800 leading-none">
                                    {user?.fullName || "Admin User"}
                                </span>
                                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mt-1">
                                    Super Admin
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="px-10 pb-10 flex-1 overflow-y-auto">
                    {/* Render with Animation for smooth transitions */}
                    <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                        {activeTab === 'dashboard' && <DashboardStats />}
                        {activeTab === 'services' && <ManageServices />}
                        {activeTab === 'users' && <UserDirectory />}
                        {activeTab === 'orders' && <AdminOrders />}
                        {activeTab === 'partners' && <PartnerManagement />}
                        {activeTab === 'settings' && <AdminSettings />}
                    </div>
                </div>
            </main>
        </div>
    );
};