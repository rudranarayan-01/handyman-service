import React from 'react';
import {
    User, ShieldCheck, Bell, CreditCard,
    Trash2, ChevronRight, Fingerprint,
    EyeOff, Smartphone, LogOut
} from 'lucide-react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

const Settings = () => {
    const { user } = useUser();
    const { signOut } = useClerk();

    const SettingItem = ({ icon: Icon, title, desc, color = "blue", url }: any) => (
        <Link to={url}>

            <div className="group flex items-center justify-between p-4 bg-white border border-gray-100 rounded-[2rem] hover:shadow-xl hover:shadow-gray-200/40 transition-all cursor-pointer">
                <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${color}-50 text-${color}-600 group-hover:scale-110 transition-transform`}>
                        <Icon size={22} />
                    </div>
                    <div>
                        <h3 className="font-black text-gray-900 uppercase text-sm tracking-tight">{title}</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">{desc}</p>
                    </div>
                </div>
                <div className="bg-gray-50 p-2 rounded-xl group-hover:bg-gray-900 group-hover:text-white transition-colors">
                    <ChevronRight size={18} />
                </div>
            </div>
        </Link>
    );

    return (
        <div className="min-h-screen bg-[#FDFDFD] pb-20 mt-20">
            {/* <BackNavigation /> */}

            <main className="max-w-4xl mx-auto px-6 pt-4">
                {/* Header Section */}
                <div className="mb-12 space-y-2">
                    <span className="text-2xl font-black text-gray-900 tracking-tighter uppercase">
                        Account <span className="text-blue-600">Command</span>
                    </span>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">
                        Manage your digital presence & security
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-10">

                    {/* Profile Quick Look */}
                    <div className="bg-gray-900 rounded-full p-3 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-gray-200">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <img
                                    src={user?.imageUrl}
                                    className="w-20 h-20 rounded-full object-cover border-2 border-blue-500 p-1"
                                    alt="profile"
                                />

                            </div>
                            <div>
                                <h2 className="text-xl font-black uppercase italic tracking-tight">{user?.fullName}</h2>
                                <p className="text-blue-400 font-bold text-xs uppercase tracking-widest">{user?.primaryEmailAddress?.emailAddress}</p>
                            </div>
                        </div>
                        <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
                            Edit Identity
                        </button>
                    </div>

                    {/* General Settings */}
                    <section className="space-y-4">
                        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-4">Core Settings</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SettingItem
                                icon={ShieldCheck}
                                title="Privacy"
                                desc="Data sharing & visibility"
                                color="blue"
                                url="/privacy"
                            />
                            <SettingItem
                                icon={Smartphone}
                                title="Devices"
                                desc="Logged in sessions"
                                color="purple"
                                url="/active-sessions"
                            />
                            <SettingItem
                                icon={Bell}
                                title="Alerts"
                                desc="Order & security updates"
                                color="orange"
                                url="/notification"
                            />
                            <SettingItem
                                icon={CreditCard}
                                title="Payments"
                                desc="Cards & Transaction history"
                                color="emerald"
                                url="/payments-options"
                            />
                        </div>
                    </section>

                    {/* Advanced / Privacy */}
                    <section className="space-y-4">
                        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-4">Privacy Control</h2>
                        <div className="bg-white border border-gray-100 rounded-[3rem] overflow-hidden">
                            <div className="p-8 space-y-8">
                                <div className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-900 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                            <EyeOff size={18} />
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900 text-sm uppercase">Incognito Mode</p>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Hide my activity from partners</p>
                                        </div>
                                    </div>
                                    <input type="checkbox" className="toggle-checkbox" />
                                </div>

                                <div className="h-px bg-dashed bg-gray-100" />

                                <div className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-900 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                            <ShieldCheck size={18} />
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900 text-sm uppercase">Two-Factor Auth</p>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Secure your account access</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-600 px-3 py-1 rounded-lg uppercase">Enabled</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Danger Zone */}
                    <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-gray-100">
                        <button
                            onClick={() => signOut()}
                            className="flex items-center gap-2 text-gray-100 font-black uppercase text-xs tracking-[0.2em] hover:text-blue-600 transition-colors"
                        >
                            <LogOut size={18} /> Logout
                        </button>

                        <button className="flex items-center gap-3 bg-red-50 text-red-500 px-8 py-4 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all">
                            <Trash2 size={18} /> Delete Account
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Settings;