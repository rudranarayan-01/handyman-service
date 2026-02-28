import React, { useEffect, useState, useMemo } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Plus, Edit3, Trash2, X, Star, Search, PackageOpen } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/api/api';
import { Button } from '../ui/button';

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

// --- SKELETON COMPONENT ---
const ServiceSkeleton = () => (
    <div className="space-y-12 animate-pulse">
        {[1, 2].map((section) => (
            <div key={section}>
                <div className="h-6 w-32 bg-slate-200 rounded-full mb-8" />
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-3 border border-slate-100">
                            <div className="h-24 md:h-40 bg-slate-100 rounded-[1rem] md:rounded-[1.5rem] mb-4" />
                            <div className="space-y-2 px-2">
                                <div className="h-4 w-3/4 bg-slate-100 rounded" />
                                <div className="h-3 w-1/2 bg-slate-100 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
);

const ManageServices = () => {
    const [services, setServices] = useState<ServiceData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isNewCategory, setIsNewCategory] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [formData, setFormData] = useState({
        name: '', category: '', price: '', description: '', image: '', duration: ''
    });

    const { getToken } = useAuth();
    const { user, isLoaded } = useUser();
    const hasAccess = user?.publicMetadata?.role === 'admin' || user?.publicMetadata?.role === 'manager';

    useEffect(() => {
        document.body.style.overflow = showModal ? 'hidden' : 'unset';
    }, [showModal]);

    const fetchServices = async () => {
        try {
            setLoading(true);
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

    // --- SEARCH & FILTER LOGIC ---
    const filteredServices = useMemo(() => {
        return services.filter(s => 
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            s.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [services, searchQuery]);

    const dynamicCategories = useMemo(() => {
        return Array.from(new Set(filteredServices.map(s => s.category))).sort();
    }, [filteredServices]);

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
            setIsNewCategory(services.length === 0);
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
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-12">
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 md:mb-16">
                <div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-2">Service Hub</h1>
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-xs md:text-sm">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Live Inventory: {services.length} items
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
                    {/* Search Bar */}
                    <div className="relative flex-1 sm:min-w-[300px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text"
                            placeholder="Search name or category..."
                            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => handleOpenModal()} className="bg-slate-900 text-white px-6 py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-xl">
                        <Plus size={20} />
                        <span>New Entry</span>
                    </Button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto space-y-16 md:space-y-24">
                {loading ? (
                    <ServiceSkeleton />
                ) : filteredServices.length > 0 ? (
                    dynamicCategories.map(cat => (
                        <section key={cat} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-baseline gap-4 mb-6 md:mb-8">
                                <h2 className="text-lg md:text-xl font-black text-slate-800 tracking-tighter uppercase">{cat}</h2>
                                <div className="h-0.5 grow bg-slate-100 rounded-full" />
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
                                {filteredServices.filter(s => s.category === cat).map(service => (
                                    <div key={service._id} className="group relative bg-white rounded-[1.5rem] md:rounded-[2rem] p-2 md:p-3 border border-slate-100 hover:shadow-xl transition-all duration-500">
                                        <div className="relative h-28 md:h-44 w-full rounded-[1.2rem] md:rounded-[1.5rem] overflow-hidden bg-slate-50 mb-3">
                                            <img
                                                src={service.image}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                alt={service.name}
                                            />
                                            <div className="absolute bottom-2 left-2 px-2 md:px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg md:rounded-xl shadow-sm">
                                                <span className="text-indigo-600 font-black text-[10px] md:text-sm">₹{service.price}</span>
                                            </div>

                                            <div className="absolute top-2 right-2 flex flex-col gap-1.5 md:gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all">
                                                <Button onClick={() => handleOpenModal(service)} className="p-2 md:p-2.5 bg-black rounded-lg md:rounded-xl text-white hover:bg-indigo-600 transition-all shadow-lg">
                                                    <Edit3 size={14} />
                                                </Button>
                                                <Button onClick={() => handleDelete(service._id, service.name)} className="p-2 md:p-2.5 bg-white rounded-lg md:rounded-xl text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-lg border border-slate-100">
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="px-1 md:px-2">
                                            <h3 className="font-black text-slate-900 text-xs md:text-lg leading-tight truncate">{service.name}</h3>
                                            <div className="flex items-center gap-2 mt-1 mb-2">
                                                <div className="flex items-center gap-1 text-amber-500 font-bold text-[8px] md:text-[10px]">
                                                    <Star size={8} fill="currentColor" /> {service.rating}
                                                </div>
                                                <span className="text-slate-300 text-[8px]">•</span>
                                                <div className="text-slate-400 font-bold text-[8px] md:text-[10px] uppercase">
                                                    {service.duration}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                        <PackageOpen size={64} strokeWidth={1} className="mb-4" />
                        <p className="text-xl font-bold">No services found matching your search</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-10">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white w-full max-w-2xl rounded-t-[2.5rem] md:rounded-[3rem] shadow-2xl flex flex-col max-h-[95vh] animate-in slide-in-from-bottom md:zoom-in-95 duration-300">
                        <div className="p-6 md:p-8 pb-4 flex justify-between items-center">
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                                {editingId ? 'Edit Service' : 'New Entry'}
                            </h2>
                            <Button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-50 rounded-xl">
                                <X size={24} className="text-slate-400" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-8 pt-0">
                            <form onSubmit={handleSubmit} id="service-form" className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Category Control</label>
                                    {!isNewCategory ? (
                                        <div className="flex gap-2">
                                            <select className="flex-1 p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-100 font-bold outline-none text-sm" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required>
                                                <option value="">Select Existing...</option>
                                                {Array.from(new Set(services.map(s => s.category))).map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                            <Button type="button" onClick={() => setIsNewCategory(true)} className="px-4 bg-indigo-50 text-indigo-600 rounded-2xl font-bold text-xs uppercase">New</Button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2 animate-in slide-in-from-right-2">
                                            <input autoFocus placeholder="Category Name..." className="flex-1 p-4 bg-indigo-50/50 text-indigo-700 rounded-2xl ring-2 ring-indigo-100 font-bold text-sm outline-none" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required />
                                            <Button type="button" onClick={() => setIsNewCategory(false)} className="px-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-xs uppercase">Back</Button>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div className="md:col-span-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Service Title</label>
                                        <input required className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-100 font-bold focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Price (INR)</label>
                                        <input type="number" required className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-100 font-bold outline-none" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Duration</label>
                                        <input placeholder="Ex: 45 Mins" className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-100 font-bold outline-none" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Image URL</label>
                                        <input className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-100 font-bold outline-none text-xs" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Description</label>
                                        <textarea rows={3} className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-100 font-medium outline-none text-sm" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 md:p-8 border-t border-slate-50">
                            <Button form="service-form" type="submit" className="w-full py-4 md:py-6 bg-slate-900 text-white rounded-2xl md:rounded-3xl font-black text-lg md:text-xl hover:bg-indigo-600 transition-all">
                                {editingId ? 'Save Changes' : 'Confirm Entry'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageServices;