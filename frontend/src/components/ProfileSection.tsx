import {
    Package,
    MapPin,
    CreditCard,
    Settings,
    LogOut,
    ChevronRight,
    ShieldCheck
} from 'lucide-react';
// Clerk Hooks
import { useUser, useClerk } from "@clerk/clerk-react";
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const ProfileSection = () => {
    const { user, isLoaded } = useUser(); // Get real Clerk user
    const { signOut } = useClerk(); // Get Clerk sign out method
    const navigate = useNavigate();
    console.log(user?.id)

    // Show loading state while Clerk fetches user data
    if (!isLoaded) return <div className="min-h-screen flex items-center justify-center font-black">LOADING...</div>;

    const menuItems = [
        { icon: Package, label: 'My Bookings', desc: 'View and manage your services', link: '/order-history' },
        { icon: MapPin, label: 'Saved Addresses', desc: 'Manage your service locations', link: '/edit-address' },
        { icon: CreditCard, label: 'UC Plus Membership', desc: 'Active until Dec 2026', link: '#' },
        { icon: Settings, label: 'Settings', desc: 'Privacy and account settings', link: '/settings' },
    ];

    return (
        <section className="bg-gray-50 min-h-screen py-12 px-6 mt-10">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Sidebar: User Summary */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center text-center">
                        <div className="relative mb-4">
                            <img
                                src={user?.imageUrl} // Clerk Dynamic Avatar
                                className="w-24 h-24 rounded-full border-4 border-blue-50 object-cover"
                                alt="Profile"
                            />
                            <div className="absolute bottom-0 right-0 bg-green-500 border-4 border-white w-6 h-6 rounded-full" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">{user?.fullName || "User"}</h2>
                        <p className="text-gray-500 font-medium text-sm mb-6">
                            {user?.primaryEmailAddress?.emailAddress}
                        </p>

                        <div className="w-full pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                            <div className="text-center">
                                {/* Note: Stats will later come from your Node.js backend */}
                                <p className="text-xl font-bold text-gray-900">12</p>
                                <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Bookings</p>
                            </div>
                            <div className="text-center border-l border-gray-100">
                                <p className="text-xl font-bold text-gray-900">4</p>
                                <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Saved Info</p>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => signOut(() => navigate("/"))}
                        className="w-full bg-white text-red-500 font-bold py-4 rounded-2xl shadow-sm border border-red-50 hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                    >
                        <LogOut className="w-5 h-5" /> Logout
                    </button>
                </div>

                {/* Right Section: Navigation Menu */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <ShieldCheck className="text-blue-600 w-5 h-5" /> Account Overview
                            </h3>
                        </div>

                        <div className="divide-y divide-gray-50">
                            {menuItems.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => item.link !== '#' && navigate(item.link)}
                                    className="p-6 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-all group"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="p-3 bg-gray-100 rounded-2xl group-hover:bg-black group-hover:text-white transition-colors">
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{item.label}</h4>
                                            <p className="text-sm text-gray-500 font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Promotional Banner */}
                    <div className="bg-linear-to-br from-gray-900 to-gray-500 p-8 rounded-[2.5rem] text-white flex justify-between items-center relative overflow-hidden">
                        <div className="z-10">
                            <p className="text-xs text-red-400 font-bold uppercase tracking-widest mb-2 opacity-80">Plus Membership</p>
                            <h4 className="text-xl font-bold mb-4">Save 10% on every booking</h4>
                            <Button className="bg-white text-gray-100 hover:bg-gray-100 px-6 py-2 rounded-xl font-bold text-sm">Renew Now</Button>
                        </div>
                        <Package className="w-32 h-32 absolute -right-4 -bottom-4 opacity-20 rotate-12" />
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ProfileSection;