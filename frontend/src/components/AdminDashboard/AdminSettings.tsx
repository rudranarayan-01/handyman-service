import { useState } from 'react';
import {
    Settings, Save, Bell, Shield,
    Store, CreditCard, Mail, 
    Smartphone
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';

const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            toast.success("Settings updated successfully!");
        }, 1500);
    };

    const tabs = [
        { id: 'general', label: 'General', icon: <Store size={18} /> },
        { id: 'bookings', label: 'Booking Rules', icon: <Smartphone size={18} /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
        { id: 'security', label: 'Security', icon: <Shield size={18} /> }
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 md:p-12 animate-in fade-in duration-500">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <Settings className="text-indigo-600" size={32} /> System Settings
                        </h1>
                        <p className="text-gray-400 font-medium mt-1">Configure your platform's global parameters</p>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
                    >
                        {saving ? "Saving..." : <><Save size={18} /> Save Changes</>}
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Sidebar Tabs */}
                    <div className="space-y-2">
                        {tabs.map((tab) => (
                            <span
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all cursor-pointer ${activeTab === tab.id
                                        ? 'bg-white text-indigo-900 shadow-sm border border-slate-200'
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {tab.icon} {tab.label}
                            </span>
                        ))}
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-10 shadow-sm min-h-125">

                            {activeTab === 'general' && (
                                <div className="space-y-8 animate-in slide-in-from-bottom-2">
                                    <h3 className="text-xl font-black text-slate-900 mb-6">Business Information</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Platform Name</label>
                                            <input type="text" defaultValue="ServicePro Hub" className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Support Email</label>
                                            <input type="email" defaultValue="hello@servicepro.com" className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Tax/GST Number</label>
                                        <input type="text" placeholder="22AAAAA0000A1Z5" className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700" />
                                    </div>

                                    <div className="pt-6 border-t border-slate-50">
                                        <h4 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
                                            <CreditCard size={18} className="text-indigo-600" /> Platform Fees
                                        </h4>
                                        <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 flex items-center justify-between">
                                            <div>
                                                <p className="font-black text-slate-800">Standard Service Fee</p>
                                                <p className="text-xs text-slate-500">Applied to every booking</p>
                                            </div>
                                            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-indigo-100">
                                                <span className="font-black text-indigo-600">₹</span>
                                                <input type="number" defaultValue="19" className="w-12 outline-none font-black text-indigo-600 text-center" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'notifications' && (
                                <div className="space-y-6 animate-in slide-in-from-bottom-2">
                                    <h3 className="text-xl font-black text-slate-900 mb-6">Auto-Notifications</h3>

                                    {[
                                        { label: "Partner SMS on Confirm", desc: "Send automated SMS to partners when order is assigned", icon: <Smartphone className="text-emerald-500" /> },
                                        { label: "Customer Email on Completion", desc: "Send invoice and feedback link to customer", icon: <Mail className="text-indigo-500" /> },
                                        { label: "Admin Low Partner Alert", desc: "Notify when certain areas have no active partners", icon: <Bell className="text-amber-500" /> }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center">
                                                    {item.icon}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm">{item.label}</p>
                                                    <p className="text-xs text-slate-400">{item.desc}</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add other tab contents similarly */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;