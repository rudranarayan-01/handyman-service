import { useState } from 'react';
import {
    LayoutDashboard, Settings, Users, Package, Calendar,
    Bell, UserRoundCheck, Menu, X, ExternalLink,
    Ticket, LayoutGrid,
    Logs
} from 'lucide-react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import SidebarItem, { SidebarItemSkeleton } from './SideBar';
import { useUser, UserButton} from '@clerk/clerk-react';
import { Button } from '../ui/button';

const DashboardSkeleton = () => (
    <div className="flex h-screen w-full bg-[#F4F7FE] overflow-hidden">
        <div className="w-72 bg-slate-200 p-6 flex flex-col gap-4 hidden lg:flex">
            <div className="h-12 w-40 bg-slate-300 rounded-xl mb-8 animate-pulse" />
            {[1, 2, 3, 4, 5, 6].map((i) => <SidebarItemSkeleton key={i} />)}
        </div>
        <div className="flex-1 flex flex-col">
            <div className="h-20 bg-white/50 border-b border-slate-100 w-full animate-pulse" />
            <div className="p-6 md:p-10 space-y-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 bg-white rounded-[2rem] shadow-sm animate-pulse" />
                    ))}
                </div>
                <div className="h-[400px] bg-white rounded-[2rem] shadow-sm animate-pulse w-full" />
            </div>
        </div>
    </div>
);

export const AdminDashboard = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, isLoaded } = useUser();
    
    const navigate = useNavigate();
    const location = useLocation();

    // Logic: If URL is /admin/services, activeTab is 'services'
    // If URL is just /admin, activeTab is 'dashboard'
    const pathParts = location.pathname.split('/');
    const activeTab = pathParts[2] || 'dashboard'; 

    if (!isLoaded) return <DashboardSkeleton />;

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <div className="h-screen bg-[#F4F7FE] flex overflow-hidden font-sans antialiased text-slate-900">
            
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/20 backdrop-blur-md z-[55] lg:hidden transition-opacity duration-300" 
                    onClick={toggleMobileMenu}
                />
            )}

            {/* --- Sidebar --- */}
            <aside className={`
                fixed inset-y-0 left-0 w-72 bg-slate-200 flex flex-col p-6 shadow-2xl z-[60] transition-transform duration-500 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
                lg:translate-x-0 lg:static lg:shadow-none h-full
            `}>
                <button onClick={toggleMobileMenu} className="lg:hidden absolute right-4 top-6 text-slate-500 hover:rotate-90 transition-transform">
                    <X size={24} />
                </button>

                <div className="flex items-center gap-4 mb-10 px-2 shrink-0">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
                        <Package className="text-white" size={22} />
                    </div>
                    <span className="font-black text-2xl tracking-tighter text-slate-900 leading-tight">
                        HouseXpertz <br /><span className="text-indigo-600 text-[10px] uppercase tracking-[0.3em] font-bold">Admin Panel</span>
                    </span>
                </div>

                <nav className="flex flex-col gap-1 flex-1 overflow-y-auto no-scrollbar pr-1">
                    <SidebarItem id="dashboard" label="Dashboard" icon={<LayoutDashboard size={18} />} activeTab={activeTab} url="/admin" onItemClick={() => setIsMobileMenuOpen(false)} />
                    <SidebarItem id="categories" label="Categories" icon={<LayoutGrid size={18} />} activeTab={activeTab} url="/admin/categories" onItemClick={() => setIsMobileMenuOpen(false)} />
                    <SidebarItem id="services" label="Services" icon={<Package size={18} />} activeTab={activeTab} url="/admin/services" onItemClick={() => setIsMobileMenuOpen(false)} />
                    <SidebarItem id="orders" label="Orders" icon={<Calendar size={18} />} activeTab={activeTab} url="/admin/orders" onItemClick={() => setIsMobileMenuOpen(false)} />
                    <SidebarItem id="users" label="Users" icon={<Users size={18} />} activeTab={activeTab} url="/admin/users" onItemClick={() => setIsMobileMenuOpen(false)} />
                    <SidebarItem id="partners" label="Partners" icon={<UserRoundCheck size={18} />} activeTab={activeTab} url="/admin/partners" onItemClick={() => setIsMobileMenuOpen(false)} />
                    <SidebarItem id="offers" label="Offers" icon={<Ticket size={18} />} activeTab={activeTab} url="/admin/offers" onItemClick={() => setIsMobileMenuOpen(false)} />
                    <SidebarItem id="logs" label="Logs" icon={<Logs size={18} />} activeTab={activeTab} url="/admin/logs" onItemClick={() => setIsMobileMenuOpen(false)} />
                </nav>

                <div className="pt-6 mt-6 border-t border-slate-300/60 flex flex-col gap-3 shrink-0">
                    <Button className="bg-slate-900 text-white w-full rounded-2xl py-6 font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/20 group" asChild>
                        <a href="/" target="_blank">
                            My Website <ExternalLink size={14} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>
                    </Button>

                    
                </div>
            </aside>

            {/* --- Main Content --- */}
            <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                <header className="px-6 md:px-10 py-5 flex justify-between items-center bg-[#F4F7FE]/80 backdrop-blur-xl sticky top-0 z-40 border-b border-slate-200/50">
                    <div className="flex items-center gap-4">
                        <button onClick={toggleMobileMenu} className="lg:hidden p-2.5 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                            <Menu size={20} />
                        </button>
                        <div>
                            <h1 className="text-lg md:text-xl font-black text-slate-800 tracking-tight leading-none capitalize">
                                {activeTab}
                            </h1>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 hidden xs:block">Manage your operations</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button 
                            variant="outline" 
                            className="p-2.5 bg-white rounded-xl text-slate-500 shadow-sm border-slate-200 hover:bg-slate-50 hover:text-indigo-600 transition-all"
                            onClick={() => navigate('/admin/settings')}
                        >
                            <Settings size={18} />
                        </Button>

                        <Button variant="outline" className="p-2.5 bg-white rounded-xl text-slate-500 shadow-sm relative border-slate-200 hover:bg-slate-50">
                            <Bell size={18} />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white animate-pulse"></span>
                        </Button>

                        <div className="h-8 w-[1px] bg-slate-300/50 mx-1 hidden sm:block"></div>

                        <div className="flex items-center gap-2 bg-white p-1 pr-3 rounded-xl shadow-sm border border-slate-200">
                            <UserButton appearance={{ elements: { avatarBox: "w-8 h-8 rounded-lg" } }} />
                            <div className="flex flex-col hidden sm:flex">
                                <span className="text-[11px] font-black text-slate-800 truncate max-w-[80px]">
                                    {user?.firstName || "Admin"}
                                </span>
                                <span className="text-[9px] font-black text-indigo-500 uppercase tracking-tighter">Super Admin</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-10 scroll-smooth">
                    <div className="max-w-7xl mx-auto pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* THE MAGIC HAPPENS HERE */}
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};