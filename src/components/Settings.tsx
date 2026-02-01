import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    User,
    Bell,
    ShieldCheck,
    Globe,
    ChevronRight,
    ArrowLeft,
    Smartphone,
    Lock,
    LogOut,
    ChevronLeft
} from 'lucide-react';
import { Button } from './ui/button';

const SettingsPage = () => {
    const { username } = useParams();

    const sections = [
        {
            title: "Account Information",
            items: [
                { id: 'profile', label: 'Personal Details', icon: User, desc: 'Edit name and profile picture', color: 'text-gray-700' },
                { id: 'phone', label: 'Phone Number', icon: Smartphone, desc: '+91 98765 43210', color: 'text-gray-700' },
            ]
        },
        {
            title: "Security & Preferences",
            items: [
                { id: 'security', label: 'Password & Security', icon: Lock, desc: 'Manage your login credentials', color: 'text-gray-700' },
                { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Control alerts and messages', color: 'text-gray-700' },
                { id: 'language', label: 'App Language', icon: Globe, desc: 'English (India)', color: 'text-gray-700' },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#FDFDFD] text-[#1A1A1A] font-sans">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to={`/${username}`} className="flex items-center gap-1 text-gray-500 hover:text-black transition-all">
                        <ChevronLeft className="w-5 h-5" />
                        <span className="font-semibold text-sm">Back</span>
                    </Link>
                    <h1 className="text-sm font-black uppercase tracking-widest text-gray-400">Settings</h1>
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">
                        {username?.charAt(0).toUpperCase()}
                    </div>
                </div>
            </nav>

            <main className="max-w-xl mx-auto px-6 py-10">
                {/* Profile Header */}
                <header className="mb-12">
                    <h2 className="text-4xl font-black tracking-tight mb-2">Settings</h2>
                    <p className="text-gray-500 font-medium">Manage your account preferences for <span className="text-black font-bold">@{username}</span></p>
                </header>

                {/* Dynamic Sections */}
                <div className="space-y-12">
                    {sections.map((section, idx) => (
                        <div key={idx} className="space-y-4">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">
                                {section.title}
                            </h3>

                            <div className="bg-white rounded-[1.5rem] border border-gray-100 gap-1.5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] overflow-hidden">
                                {section.items.map((item, i) => (
                                    <button
                                        key={item.id}
                                        className={`w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors ${i !== section.items.length - 1 ? 'border-b border-gray-50' : ''}`}
                                    >
                                        <div className="flex items-center gap-4 text-left">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600">
                                                <item.icon className="w-5 h-5 stroke-[2px]" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[15px] text-gray-100 leading-none mb-1">{item.label}</h4>
                                                <p className="text-xs text-gray-500 font-medium">{item.desc}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-300" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Premium Badge Card */}
                <div className="mt-12 p-6 rounded-[2rem] bg-linear-to-br from-gray-900 to-gray-500 text-white relative overflow-hidden shadow-xl">
                    <div className="relative z-10">
                        <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Plus Membership</span>
                        <h3 className="text-lg font-bold mt-1">Unlock priority support</h3>
                        <p className="text-gray-400 text-xs mt-1 mb-4">Get 24/7 access to our expert team.</p>
                        <Button className="bg-white text-white px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-wider hover:bg-gray-200 transition-colors">
                            Upgrade Now
                        </Button>
                    </div>
                    <ShieldCheck className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 rotate-12" />
                </div>

                {/* Logout Button */}
                <div className="mt-16">
                    <button className="w-full py-4 rounded-2xl border border-red-100 bg-red-50/30 text-red-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-50 transition-all">
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                    <p className="text-center text-[10px] text-gray-300 font-black uppercase tracking-widest mt-8">
                        Version 1.0.4 (2026)
                    </p>
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;