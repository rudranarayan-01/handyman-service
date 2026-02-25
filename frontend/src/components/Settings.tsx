import React, { useMemo } from 'react';
import {
    ShieldCheck, Bell, CreditCard,
    Trash2, ChevronRight, 
    EyeOff, Smartphone, LogOut, UserCircle
} from 'lucide-react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

// --- Skeleton Loader ---
const SettingsSkeleton = () => (
    <div className="max-w-4xl mx-auto px-6 pt-4 animate-pulse mt-20">
        <div className="h-8 w-48 bg-gray-200 rounded-lg mb-2" />
        <div className="h-4 w-64 bg-gray-100 rounded-lg mb-12" />
        <div className="h-32 w-full bg-gray-200 rounded-full mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-gray-100 rounded-[2rem]" />
            ))}
        </div>
        <div className="h-48 w-full bg-gray-100 rounded-[3rem]" />
    </div>
);

// --- Memoized Setting Item for Performance ---
const SettingItem = React.memo(({ icon: Icon, title, desc, color = "blue", url }: any) => {
    // Tailwind dynamic class fix: map colors to actual classes
    const colorMap: Record<string, string> = {
        blue: "bg-blue-50 text-blue-600",
        purple: "bg-purple-50 text-purple-600",
        orange: "bg-orange-50 text-orange-600",
        emerald: "bg-emerald-50 text-emerald-600",
    };

    return (
        <Link to={url} className="block group">
            <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-[2rem] hover:shadow-xl hover:shadow-gray-200/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-4 md:gap-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorMap[color] || colorMap.blue} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon size={22} />
                    </div>
                    <div>
                        <h3 className="font-black text-gray-900 uppercase text-xs md:text-sm tracking-tight">{title}</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{desc}</p>
                    </div>
                </div>
                <div className="bg-gray-50 p-2 rounded-xl group-hover:bg-gray-900 group-hover:text-white transition-all duration-300">
                    <ChevronRight size={18} />
                </div>
            </div>
        </Link>
    );
});

const Settings = () => {
    const { user, isLoaded } = useUser();
    const { signOut } = useClerk();

    // Prevent re-renders of the sections
    const coreSettings = useMemo(() => [
        { icon: ShieldCheck, title: "Privacy", desc: "Data sharing & visibility", color: "blue", url: "/privacy" },
        { icon: Smartphone, title: "Devices", desc: "Logged in sessions", color: "purple", url: "/active-sessions" },
        { icon: Bell, title: "Alerts", desc: "Order & security updates", color: "orange", url: "/notification" },
        { icon: CreditCard, title: "Payments", desc: "Cards & History", color: "emerald", url: "/payments-options" }
    ], []);

    if (!isLoaded) return <SettingsSkeleton />;

    return (
        <div className="min-h-screen bg-[#FDFDFD] pb-20 mt-10 md:mt-20">
            <main className="max-w-4xl mx-auto px-6 pt-4">
                
                {/* Header Section */}
                <div className="mb-12 space-y-2 animate-in fade-in slide-in-from-left-4 duration-700">
                    <span className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                        Account <span className="text-blue-600">Command</span>
                    </span>
                    <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.3em]">
                        Manage your digital presence & security
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-10">

                    {/* Profile Card - Enhanced with Glassmorphism */}
                    <div className="bg-gray-900 rounded-[2.5rem] md:rounded-full p-4 md:p-3 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-gray-300/50 group overflow-hidden relative">
                        {/* Decorative background element */}
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-600/20 rounded-full blur-3xl group-hover:bg-blue-600/40 transition-all duration-700" />
                        
                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 z-10">
                            <div className="relative">
                                {user?.imageUrl ? (
                                    <img
                                        src={user.imageUrl}
                                        className="w-20 h-20 rounded-full object-cover border-2 border-blue-500 p-1 bg-gray-800"
                                        alt="profile"
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center border-2 border-gray-700">
                                        <UserCircle size={40} className="text-gray-500" />
                                    </div>
                                )}
                                <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 border-4 border-gray-900 rounded-full" />
                            </div>
                            <div className="text-center md:text-left">
                                <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tight leading-none mb-1">
                                    {user?.fullName || "Commander"}
                                </h2>
                                <p className="text-blue-400 font-bold text-[10px] md:text-xs uppercase tracking-[0.15em]">
                                    {user?.primaryEmailAddress?.emailAddress}
                                </p>
                            </div>
                        </div>
                        
                        <button className="z-10 bg-white/10 hover:bg-white text-white hover:text-black backdrop-blur-md px-8 py-3.5 rounded-2xl md:rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 active:scale-95 w-full md:w-auto">
                            Edit Identity
                        </button>
                    </div>

                    {/* General Settings */}
                    <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-6">Core Settings</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {coreSettings.map((item, idx) => (
                                <SettingItem key={idx} {...item} />
                            ))}
                        </div>
                    </section>

                    {/* Advanced Privacy Control */}
                    <section className="space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-6">Privacy Control</h2>
                        <div className="bg-white border border-gray-100 rounded-[2.5rem] md:rounded-[3rem] shadow-sm overflow-hidden">
                            <div className="p-6 md:p-8 space-y-6 md:space-y-8">
                                
                                {/* Incognito Mode Toggle */}
                                <div className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-900 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                            <EyeOff size={18} />
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900 text-xs md:text-sm uppercase leading-none">Incognito Mode</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">Hide my activity from partners</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

                                <div className="h-px border-t border-dashed border-gray-100" />

                                {/* 2FA Badge */}
                                <div className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-900 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                            <ShieldCheck size={18} />
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900 text-xs md:text-sm uppercase leading-none">Two-Factor Auth</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">Secure your account access</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">Enabled</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Danger Zone */}
                    <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-gray-100 animate-in fade-in duration-1000">
                        <button
                            onClick={() => signOut()}
                            className="flex items-center gap-2 text-gray-400 font-black uppercase text-xs tracking-[0.2em] hover:text-blue-600 transition-all active:scale-95 group"
                        >
                            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> Logout Session
                        </button>

                        <button className="w-full md:w-auto flex items-center justify-center gap-3 bg-red-50 text-red-500 px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-100/50 active:scale-95">
                            <Trash2 size={18} /> Delete Account
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Settings;