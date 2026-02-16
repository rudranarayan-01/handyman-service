import React, { useState, useEffect, useRef } from 'react';
import api from '@/api/api';
import { useAuth } from '@clerk/clerk-react';
import {
    Plus, Search, MapPin, Briefcase, Phone, Mail,
    X, Check, Edit2, Trash2, ChevronDown, Loader2
} from 'lucide-react';
import { toast } from 'sonner';

const PartnerManagement = () => {
    const { getToken } = useAuth();
    const [partners, setPartners] = useState([]);
    const [availableServices, setAvailableServices] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Input Ref for Service Areas
    const areaInputRef = useRef<HTMLInputElement>(null);

    // Dropdown States
    const [serviceSearch, setServiceSearch] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '',
        serviceAreas: [] as string[],
        specializations: [] as string[]
    });

    useEffect(() => { fetchData(); }, [searchQuery]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = await getToken();
            const [pRes, sRes] = await Promise.all([
                api.get(`/admin/partners?search=${searchQuery}`, { headers: { Authorization: `Bearer ${token}` } }),
                api.get('/admin/service-list', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setPartners(pRes.data);
            setAvailableServices(sRes.data);
        } catch (err) {
            toast.error("Sync failed");
        } finally { setLoading(false); }
    };

    const handleEdit = (partner: any) => {
        setEditingId(partner._id);
        setFormData({
            name: partner.name,
            email: partner.email,
            phone: partner.phone,
            serviceAreas: Array.isArray(partner.serviceAreas) ? partner.serviceAreas : [],
            specializations: Array.isArray(partner.specializations) ? partner.specializations : []
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        toast("Delete Partner?", {
            description: "Bhai, ye professional hamesha ke liye fleet se hat jayega.",
            action: {
                label: "Confirm Delete",
                onClick: async () => {
                    try {
                        const token = await getToken();
                        await api.delete(`/admin/partners/${id}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        toast.success("Partner removed successfully");
                        fetchData();
                    } catch (err) {
                        toast.error("Delete failed");
                    }
                },
            },
            cancel: { label: "Cancel", onClick: () => toast.dismiss() },
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // --- FIXED LOGIC START ---
        let finalAreas = [...formData.serviceAreas];
        
        // Agar input field mein kuch likha hua hai aur user ne Enter nahi dabaya
        if (areaInputRef.current && areaInputRef.current.value.trim() !== "") {
            const pendingArea = areaInputRef.current.value.trim();
            if (!finalAreas.includes(pendingArea)) {
                finalAreas.push(pendingArea);
            }
            areaInputRef.current.value = ""; // Clear the input
        }

        if (formData.specializations.length === 0) return toast.error("Select at least one service");
        if (finalAreas.length === 0) return toast.error("Add at least one service area");
        // --- FIXED LOGIC END ---

        try {
            const token = await getToken();
            const payload = { ...formData, serviceAreas: finalAreas };

            if (editingId) {
                await api.patch(`/admin/partners/${editingId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
                toast.success("Partner fleet updated");
            } else {
                await api.post('/admin/partners', payload, { headers: { Authorization: `Bearer ${token}` } });
                toast.success("New partner onboarded");
            }
            resetForm();
            fetchData();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Operation failed");
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({ name: '', email: '', phone: '', serviceAreas: [], specializations: [] });
    };

    const toggleSkill = (skill: string) => {
        setFormData(prev => ({
            ...prev,
            specializations: prev.specializations.includes(skill)
                ? prev.specializations.filter(s => s !== skill)
                : [...prev.specializations, skill]
        }));
    };

    return (
        <div className="p-6 md:p-10 bg-[#F8FAFC] min-h-screen no-scrollbar">
            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Partner Fleet</h1>
                        <p className="text-slate-500 font-medium">Manage and monitor service professionals.</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl w-72 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm font-medium shadow-sm"
                                placeholder="Search name, area, service..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => (showForm ? resetForm() : setShowForm(true))}
                            className={`${showForm ? 'bg-slate-200 text-slate-600' : 'bg-indigo-600 text-white shadow-indigo-200'} px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg text-sm`}
                        >
                            {showForm ? <X size={18} /> : <Plus size={18} />} {showForm ? "Cancel" : "Add Partner"}
                        </button>
                    </div>
                </div>

                {showForm && (
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-2xl mb-12 animate-in fade-in zoom-in-95 duration-300">
                        <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                            {editingId ? <Edit2 className="text-indigo-600" size={20} /> : <Plus className="text-indigo-600" size={20} />}
                            {editingId ? "Edit Partner Profile" : "Register New Partner"}
                        </h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5 text-left">
                                    <label className="text-[11px] font-black uppercase text-slate-400 ml-1">Full Name</label>
                                    <input value={formData.name} className="w-full p-4 bg-slate-50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-indigo-500 transition-all text-sm font-bold" onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                </div>
                                <div className="space-y-1.5 text-left">
                                    <label className="text-[11px] font-black uppercase text-slate-400 ml-1">Email Address</label>
                                    <input value={formData.email} className="w-full p-4 bg-slate-50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-indigo-500 transition-all text-sm font-bold" type="email" onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                                </div>
                                <div className="space-y-1.5 text-left">
                                    <label className="text-[11px] font-black uppercase text-slate-400 ml-1">Phone Number</label>
                                    <input value={formData.phone} className="w-full p-4 bg-slate-50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-indigo-500 transition-all text-sm font-bold" onChange={e => setFormData({ ...formData, phone: e.target.value })} required />
                                </div>
                                <div className="space-y-1.5 text-left">
                                    <label className="text-[11px] font-black uppercase text-slate-400 ml-1">Service Areas (Press Enter to add)</label>
                                    <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-transparent rounded-2xl min-h-[56px] focus-within:bg-white focus-within:border-indigo-500 transition-all">
                                        {formData.serviceAreas.map(area => (
                                            <span key={area} className="bg-slate-900 text-white px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-2 uppercase tracking-wider">
                                                {area} <X size={12} className="cursor-pointer hover:text-rose-400" onClick={() => setFormData({ ...formData, serviceAreas: formData.serviceAreas.filter(a => a !== area) })} />
                                            </span>
                                        ))}
                                        <input
                                            ref={areaInputRef}
                                            className="bg-transparent outline-none text-sm p-1 flex-1 font-bold min-w-[120px]"
                                            placeholder="Type area..."
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const val = e.currentTarget.value.trim();
                                                    if (val && !formData.serviceAreas.includes(val)) {
                                                        setFormData(prev => ({ ...prev, serviceAreas: [...prev.serviceAreas, val] }));
                                                        e.currentTarget.value = "";
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5 relative text-left">
                                <label className="text-[11px] font-black uppercase text-slate-400 ml-1">Services ({formData.specializations.length})</label>
                                <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full p-4 bg-slate-50 rounded-2xl border border-transparent flex justify-between items-center cursor-pointer hover:bg-slate-100 transition-colors">
                                    <span className="text-sm font-bold text-slate-700 truncate">
                                        {formData.specializations.length > 0 ? formData.specializations.join(", ") : "Choose Skills"}
                                    </span>
                                    <ChevronDown size={18} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </div>

                                {isDropdownOpen && (
                                    <div className="absolute z-[100] mt-3 w-full bg-white border border-slate-100 rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                                        <div className="p-4 bg-slate-50/50 border-b">
                                            <input className="w-full p-3 bg-white rounded-xl outline-none text-sm border border-slate-200 font-medium" placeholder="Search thousands of services..." autoFocus value={serviceSearch} onChange={(e) => setServiceSearch(e.target.value)} />
                                        </div>
                                        <div className="max-h-64 overflow-y-auto p-2 no-scrollbar">
                                            {availableServices.filter(s => s.toLowerCase().includes(serviceSearch.toLowerCase())).map(service => (
                                                <div key={service} onClick={() => toggleSkill(service)} className="flex items-center justify-between p-3.5 hover:bg-indigo-50 rounded-xl cursor-pointer transition-all">
                                                    <span className={`text-sm font-bold ${formData.specializations.includes(service) ? 'text-indigo-600' : 'text-slate-600'}`}>{service}</span>
                                                    {formData.specializations.includes(service) && <div className="bg-indigo-600 p-1 rounded-full"><Check size={10} className="text-white" /></div>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button type="submit" className="md:col-span-3 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-indigo-100 active:scale-[0.98]">
                                {editingId ? "Update Professional Profile" : "Confirm Onboarding"}
                            </button>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Partner Profile</th>
                                    <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Contact</th>
                                    <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Areas of Coverage</th>
                                    <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Expertise</th>
                                    <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 font-medium">
                                {partners.map((p: any) => (
                                    <tr key={p._id} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg border border-indigo-100">
                                                    {p.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 leading-none mb-1">{p.name}</p>
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                                        <span className="text-[10px] text-emerald-600 font-black uppercase">Available</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 text-sm text-slate-600 space-y-1">
                                            <div className="flex items-center gap-2 font-bold"><Mail size={12} className="text-slate-300" /> {p.email}</div>
                                            <div className="flex items-center gap-2 font-bold"><Phone size={12} className="text-slate-300" /> {p.phone}</div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-wrap gap-1.5 max-w-[220px]">
                                                {Array.isArray(p.serviceAreas) && p.serviceAreas.length > 0 ? (
                                                    p.serviceAreas.map((area: string) => (
                                                        <span key={area} className="bg-slate-100 text-slate-900 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border border-slate-200/50">
                                                            {area}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-[10px] text-slate-400 font-bold italic uppercase opacity-50 tracking-tighter">No Areas</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-wrap gap-1.5 max-w-[220px]">
                                                {p.specializations?.map((spec: string) => (
                                                    <span key={spec} className="bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border border-indigo-100/50">{spec}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center justify-center gap-3">
                                                <button onClick={() => handleEdit(p)} className="p-2.5 rounded-xl bg-white text-slate-400 hover:text-indigo-600 shadow-sm border border-slate-100 hover:border-indigo-100 transition-all">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(p._id)} className="p-2.5 rounded-xl bg-white text-slate-400 hover:text-rose-600 shadow-sm border border-slate-100 hover:border-rose-100 transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnerManagement;