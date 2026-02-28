import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '@/api/api';
import { useAuth } from '@clerk/clerk-react';
import { Plus, Search, X, Edit2, Trash2, CheckCircle2, XCircle, UserCheck, Clock, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import PartnerForm from './PartnerForm';

const TableSkeleton = () => (
    <div className="w-full space-y-4 animate-pulse p-6">
        {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-slate-100 rounded-2xl w-full" />)}
    </div>
);

const PartnerManagement = () => {
    const { getToken } = useAuth();
    const [allPartners, setAllPartners] = useState<any[]>([]); // Store all to calculate counts
    const [availableServices, setAvailableServices] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'approved' | 'pending'>('approved');
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingPartner, setEditingPartner] = useState<any | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const token = await getToken();
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Note: We fetch all partners to calculate counts accurately
            const [partnerRes, serviceRes] = await Promise.all([
                api.get(`/admin/partners?search=${searchQuery}`, config),
                api.get('/admin/services', config)
            ]);

            setAllPartners(partnerRes.data);
            setAvailableServices(serviceRes.data);
        } catch (err) {
            toast.error("Sync failed");
        } finally {
            setIsLoading(false);
        }
    }, [getToken, searchQuery]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Derived State for Counts and Filtered List
    const stats = useMemo(() => {
        const approved = allPartners.filter(p => p.isVerified).length;
        const pending = allPartners.filter(p => !p.isVerified).length;
        return { approved, pending, total: allPartners.length };
    }, [allPartners]);

    const displayPartners = useMemo(() => {
        return allPartners.filter((p: any) =>
            activeTab === 'pending' ? !p.isVerified : p.isVerified
        );
    }, [allPartners, activeTab]);

    const handleFormSubmit = async (data: any) => {
        try {
            const token = await getToken();
            const config = { headers: { Authorization: `Bearer ${token}` } };
            if (editingPartner) {
                await api.patch(`/admin/partners/${editingPartner._id}`, data, config);
                toast.success("Partner updated");
            } else {
                await api.post('/admin/partners', data, config);
                toast.success("Partner registered");
            }
            setShowForm(false);
            setEditingPartner(null);
            fetchData();
        } catch (err) { toast.error("Operation failed"); }
    };

    const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
        try {
            const token = await getToken();
            await api.patch(`/partners/verify/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
            toast.success(`Partner ${status}`);
            fetchData();
        } catch (err) { toast.error("Update failed"); }
    };

    return (
        <div className="p-4 md:p-10 bg-[#F8FAFC] min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Partner Fleet</h1>
                        <p className="text-slate-500 font-medium">Manage your verified and pending providers.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input className="pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl w-full sm:w-64 outline-none text-sm font-medium focus:ring-2 focus:ring-indigo-500/10 transition-all" placeholder="Search partners..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                        <Button onClick={() => { setEditingPartner(null); setShowForm(!showForm); }} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200 text-sm">
                            {showForm ? <X size={18} /> : <Plus size={18} />} {showForm ? "Cancel" : "Add Partner"}
                        </Button>
                    </div>
                </div>

                {/* --- STATS COUNTER BAR --- */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <StatCard label="Total Partners" count={stats.total} icon={<Users size={20} />} color="indigo" />
                    <StatCard label="Active Providers" count={stats.approved} icon={<UserCheck size={20} />} color="emerald" />
                    <StatCard label="Awaiting Approval" count={stats.pending} icon={<Clock size={20} />} color="amber" />
                </div>

                {/* Tab Navigation with Badge Counts */}
                <div className="flex gap-2 mb-8 bg-slate-200/50 p-1.5 rounded-[1.2rem] w-full sm:w-fit border border-slate-200">
                    <button onClick={() => setActiveTab('approved')} className={`flex items-center gap-3 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'approved' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                        Active <span className={`px-2 py-0.5 rounded-md text-[9px] ${activeTab === 'approved' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-300 text-slate-600'}`}>{stats.approved}</span>
                    </button>
                    <button onClick={() => setActiveTab('pending')} className={`flex items-center gap-3 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'pending' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                        Pending <span className={`px-2 py-0.5 rounded-md text-[9px] ${activeTab === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-300 text-slate-600'}`}>{stats.pending}</span>
                    </button>
                </div>

                {showForm && (
                    <PartnerForm
                        availableServices={availableServices}
                        initialData={editingPartner}
                        isEditing={!!editingPartner}
                        onCancel={() => { setShowForm(false); setEditingPartner(null); }}
                        onSubmit={handleFormSubmit}
                    />
                )}

                {/* Table Section */}
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/50 border-b">
                                <tr>
                                    <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Partner</th>
                                    <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest hidden md:table-cell">Contact</th>
                                    <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Expertise</th>
                                    <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Location</th>
                                    <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {isLoading ? (
                                    <tr><td colSpan={4}><TableSkeleton /></td></tr>
                                ) : displayPartners.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-20 text-center">
                                            <div className="flex flex-col items-center gap-3 opacity-40">
                                                <Users size={48} />
                                                <p className="font-black uppercase tracking-widest text-xs">No {activeTab} partners found</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : displayPartners.map((p: any) => (
                                    <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black border border-indigo-100 uppercase">{p.name.charAt(0)}</div>
                                                <div>
                                                    <p className="font-black text-slate-900 text-sm">{p.name}</p>
                                                    <div className="flex gap-1">
                                                        {p.serviceAreas?.slice(0, 2).map((area: any, i: number) => (
                                                            <span key={i} className="text-[8px] font-bold text-indigo-400 bg-indigo-50/50 px-1.5 py-0.5 rounded uppercase">{area}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 text-[11px] text-slate-600 hidden md:table-cell">
                                            <div className="font-bold">{p.email}</div>
                                            <div className="font-bold">{p.phone}</div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-wrap gap-1 max-w-50">
                                                {p.specializations?.map((s: string, i: number) => (
                                                    <span key={i} className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[9px] font-black uppercase border border-slate-200">{s}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                                                {p.serviceAreas && p.serviceAreas.length > 0 ? (
                                                    p.serviceAreas.map((area: string, i: number) => (
                                                        <span
                                                            key={i}
                                                            className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border border-indigo-100"
                                                        >
                                                            {area}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-[10px] text-slate-400 italic">No areas set</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center justify-center gap-2">
                                                {activeTab === 'pending' ? (
                                                    <>
                                                        <button onClick={() => handleStatusUpdate(p._id, 'approved')} className="h-9 w-9 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"><CheckCircle2 size={18} /></button>
                                                        <button onClick={() => handleStatusUpdate(p._id, 'rejected')} className="h-9 w-9 flex items-center justify-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm"><XCircle size={18} /></button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={() => { setEditingPartner(p); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="h-9 w-9 flex items-center justify-center rounded-xl bg-white text-slate-400 hover:text-indigo-600 border border-slate-100 transition-all hover:shadow-md"><Edit2 size={16} /></button>
                                                        <button className="h-9 w-9 flex items-center justify-center rounded-xl bg-white text-slate-400 hover:text-rose-600 border border-slate-100 transition-all hover:shadow-md"><Trash2 size={16} /></button>
                                                    </>
                                                )}
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

// --- HELPER COMPONENT FOR STATS ---
const StatCard = ({ label, count, icon, color }: { label: string, count: number, icon: React.ReactNode, color: 'indigo' | 'emerald' | 'amber' }) => {
    const colors = {
        indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
        amber: "text-amber-600 bg-amber-50 border-amber-100"
    };

    return (
        <div className="bg-white p-5 rounded-[1.5rem] border border-slate-200 flex items-center gap-4 shadow-sm">
            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${colors[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</p>
                <p className="text-2xl font-black text-slate-900 leading-none mt-1">{count}</p>
            </div>
        </div>
    );
}

export default PartnerManagement;