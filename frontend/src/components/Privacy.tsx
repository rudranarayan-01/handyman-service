import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import api from '../api/api';
import { ShieldCheck, Eye, Mail, BarChart3, Lock } from 'lucide-react';

const PrivacySettings = () => {
    const [settings, setSettings] = useState({
        profileVisibility: 'public',
        shareUsageStats: true,
        marketingEmails: false,
    });

    // Toggle Update Function
    const handleToggle = async (key: string, value: any) => {
        const updatedSettings = { ...settings, [key]: value };
        setSettings(updatedSettings); // Optimistic UI update

        const updatePromise = api.put('/user/update-privacy', { 
            privacySettings: updatedSettings 
        });

        toast.promise(updatePromise, {
            loading: 'Updating preferences...',
            success: 'Settings updated successfully!',
            error: 'Failed to sync with server.',
        });
    };

    return (
        <div className="max-w-3xl mx-auto p-6 md:p-10 bg-[#F8FAFC] mt-20">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                    <ShieldCheck className="text-indigo-600" size={32} /> Privacy & Visibility
                </h1>
                <p className="text-slate-500 mt-2">Control how your data is shared and who can see your profile.</p>
            </div>

            <div className="space-y-4">
                {/* Visibility Card */}
                <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-6 flex items-center justify-between hover:border-indigo-100 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600"><Eye size={24}/></div>
                        <div>
                            <h3 className="font-bold text-slate-900">Profile Visibility</h3>
                            <p className="text-sm text-slate-500 font-medium">Allow others to see your activity</p>
                        </div>
                    </div>
                    <select 
                        className="bg-slate-50 border-none rounded-xl px-4 py-2 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        value={settings.profileVisibility}
                        onChange={(e) => handleToggle('profileVisibility', e.target.value)}
                    >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                </div>

                {/* Usage Stats Toggle */}
                <PrivacyItem 
                    icon={<BarChart3 />} 
                    title="Usage Analytics" 
                    desc="Help us improve by sharing anonymous usage data"
                    enabled={settings.shareUsageStats}
                    onToggle={(val: any) => handleToggle('shareUsageStats', val)}
                />

                {/* Marketing Emails Toggle */}
                <PrivacyItem 
                    icon={<Mail />} 
                    title="Marketing Communications" 
                    desc="Receive updates about new features and offers"
                    enabled={settings.marketingEmails}
                    onToggle={(val: any) => handleToggle('marketingEmails', val)}
                />
            </div>
        </div>
    );
};

// Reusable Toggle Component
const PrivacyItem = ({ icon, title, desc, enabled, onToggle }: any) => (
    <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-6 flex items-center justify-between group hover:border-indigo-100 transition-all">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-50 group-hover:bg-indigo-50 rounded-2xl text-slate-400 group-hover:text-indigo-600 transition-all">
                {React.cloneElement(icon, { size: 24 })}
            </div>
            <div>
                <h3 className="font-bold text-slate-900">{title}</h3>
                <p className="text-sm text-slate-500 font-medium">{desc}</p>
            </div>
        </div>
        <button 
            onClick={() => onToggle(!enabled)}
            className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${enabled ? 'bg-indigo-600 shadow-lg shadow-indigo-100' : 'bg-slate-200'}`}
        >
            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
    </div>
);

export default PrivacySettings;