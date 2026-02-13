import React, { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Plus, Edit3, Trash2, Clock, X, Star } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/api/api';

interface ServiceData {
    _id: string;
    name: string;
    category: string;
    price: number;
    description: string;
    image: string;
    duration: string;
    rating: number;
}

const ManageServices = () => {
    const [services, setServices] = useState<ServiceData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isNewCategory, setIsNewCategory] = useState(false);

    const [formData, setFormData] = useState({
        name: '', category: '', price: '', description: '', image: '', duration: ''
    });

    const { getToken } = useAuth();
    const { user, isLoaded } = useUser();
    const hasAccess = user?.publicMetadata?.role === 'admin' || user?.publicMetadata?.role === 'manager';

    // Disable Body Scroll when Modal is open
    useEffect(() => {
        document.body.style.overflow = showModal ? 'hidden' : 'unset';
    }, [showModal]);

    const fetchServices = async () => {
        try {
            const token = await getToken();
            const response = await api.get('/admin/services', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setServices(response.data);
        } catch (error) {
            toast.error("Failed to fetch catalog");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (isLoaded && hasAccess) fetchServices(); }, [isLoaded, hasAccess]);

    const dynamicCategories = Array.from(new Set(services.map(s => s.category))).sort();

    const handleOpenModal = (service?: ServiceData) => {
        if (service) {
            setEditingId(service._id);
            setFormData({
                name: service.name, category: service.category, price: service.price.toString(),
                description: service.description || '', image: service.image || '', duration: service.duration || ''
            });
            setIsNewCategory(false);
        } else {
            setEditingId(null);
            setFormData({ name: '', category: '', price: '', description: '', image: '', duration: '' });
            setIsNewCategory(dynamicCategories.length === 0);
        }
        setShowModal(true);
    };

    const handleDelete = async (id: string, name: string) => {
        toast(`Delete ${name}?`, {
            description: "This action cannot be undone.",
            action: {
                label: "Confirm Delete",
                onClick: async () => {
                    const token = await getToken();
                    await api.delete(`/admin/services/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                    setServices(prev => prev.filter(s => s._id !== id));
                    toast.success("Deleted successfully");
                }
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = await getToken();
        const action = async () => {
            if (editingId) {
                const res = await api.patch(`/admin/services/${editingId}`, formData, { headers: { Authorization: `Bearer ${token}` } });
                setServices(prev => prev.map(s => s._id === editingId ? res.data : s));
            } else {
                const res = await api.post('/admin/services', formData, { headers: { Authorization: `Bearer ${token}` } });
                setServices([res.data, ...services]);
            }
            setShowModal(false);
        };
        toast.promise(action(), { loading: 'Updating Database...', success: 'Catalog Updated!', error: 'Sync Error' });
    };

    if (!hasAccess) return <div className="h-screen flex items-center justify-center font-black text-rose-500 uppercase tracking-widest">Unauthorized Access</div>;

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 md:p-12">
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
                <div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-2">Service Hub</h1>
                    <div className="flex items-center gap-2 text-slate-500 font-medium">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Live Inventory: {services.length} active items
                    </div>
                </div>
                <button onClick={() => handleOpenModal()} className="group bg-slate-900 text-white pl-6 pr-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-indigo-600 transition-all duration-300 shadow-xl shadow-slate-200">
                    <Plus className="group-hover:rotate-90 transition-transform duration-300" size={22} />
                    New Entry
                </button>
            </header>

            <div className="max-w-7xl mx-auto space-y-24">
                {dynamicCategories.map(cat => (
                    <section key={cat} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex items-baseline gap-4 mb-8">
                            <h2 className="text-xl font-black text-slate-800 tracking-tighter">{cat}</h2>
                            <div className="h-0.5 grow bg-slate-100 rounded-full" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {services.filter(s => s.category === cat).map(service => (
                                <div key={service._id} className="group relative bg-white rounded-[2rem] p-3 border border-slate-100 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.07)] transition-all duration-500">
                                    {/* Image Container - Smaller & Stylish */}
                                    <div className="relative h-40 w-full rounded-[1.5rem] overflow-hidden bg-slate-50 mb-4">
                                        <img
                                            src={service.image}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            alt={service.name}
                                        />

                                        {/* Floating Price Tag */}
                                        <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl shadow-sm">
                                            <span className="text-indigo-600 font-black text-sm tracking-tight">₹{service.price}</span>
                                        </div>

                                        {/* Hover Overlay with Quick Actions */}
                                        <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                            <button
                                                onClick={() => handleOpenModal(service)}
                                                className="p-2.5 bg-white rounded-xl text-slate-100 hover:bg-indigo-600 hover:text-white transition-all shadow-lg border border-slate-100"
                                            >
                                                <Edit3 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(service._id, service.name)}
                                                className="p-2.5 bg-white rounded-xl text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-lg border border-slate-100"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content Area - Tight & Clean */}
                                    <div className="px-2">
                                        <div className="flex flex-col mb-3">
                                            <h3 className="font-black text-slate-900 text-lg leading-tight truncate">{service.name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="flex items-center gap-1 text-amber-500 font-bold text-[10px]">
                                                    <Star size={10} fill="currentColor" /> {service.rating}
                                                </div>
                                                <span className="text-slate-300">•</span>
                                                <div className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                                                    {service.duration}
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-2">
                                            {service.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            {/* Modal - The Professional Way */}
            {showModal && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-10">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl" onClick={() => setShowModal(false)} />

                    <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="p-8 pb-4 flex justify-between items-center">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                                {editingId ? 'Modify Service' : 'New Creation'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                                <X size={24} className="text-slate-400" />
                            </button>
                        </div>

                        {/* Modal Body - Hidden Scrollbar */}
                        <div className="flex-1 overflow-y-auto no-scrollbar p-8 pt-4">
                            <form onSubmit={handleSubmit} id="service-form" className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Category Control</label>
                                    <div className="flex flex-col gap-4">
                                        {!isNewCategory ? (
                                            <div className="flex gap-3">
                                                <select className="flex-1 p-5 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-100 font-bold outline-none appearance-none" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required>
                                                    <option value="">Select Existing...</option>
                                                    {dynamicCategories.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                                <button type="button" onClick={() => setIsNewCategory(true)} className="p-5 bg-indigo-50 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-100 transition-colors">
                                                    New
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex gap-3 animate-in slide-in-from-right-2">
                                                <input autoFocus placeholder="Category Name..." className="flex-1 p-5 bg-indigo-50/50 text-indigo-700 rounded-2xl border-none ring-2 ring-indigo-100 font-bold" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required />
                                                <button type="button" onClick={() => setIsNewCategory(false)} className="p-5 bg-slate-100 text-slate-600 rounded-2xl font-bold">
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Service Title</label>
                                        <input required placeholder="Ex: Premium Spa Treatment" className="w-full p-5 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-100 mt-2 font-bold focus:ring-2 focus:ring-indigo-500 transition-all outline-none" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Pricing (INR)</label>
                                        <input type="number" required className="w-full p-5 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-100 mt-2 font-bold outline-none" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Time Estimate</label>
                                        <input placeholder="Ex: 45 Mins" className="w-full p-5 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-100 mt-2 font-bold outline-none" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Display Image URL</label>
                                        <input placeholder="https://images.unsplash.com/..." className="w-full p-5 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-100 mt-2 font-bold outline-none" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Service Description</label>
                                        <textarea rows={4} className="w-full p-5 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-100 mt-2 font-medium outline-none" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-8 border-t border-slate-50">
                            <button form="service-form" type="submit" className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-xl hover:bg-indigo-600 active:scale-[0.98] transition-all shadow-2xl shadow-indigo-100">
                                {editingId ? 'Sync Changes' : 'Confirm & Publish'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageServices;