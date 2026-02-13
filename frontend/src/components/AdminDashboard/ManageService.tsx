import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Plus, Edit3, Trash2, IndianRupee, Layers } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/api/api';

interface ServiceData {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
}

const ManageServices = () => {
    const [services, setServices] = useState<ServiceData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentService, setCurrentService] = useState<Partial<ServiceData>>({});
    const { getToken } = useAuth();

    const fetchServices = async () => {
        try {
            const response = await api.get('/admin/services');
            setServices(response.data);
        } catch (error) {
            toast.error("Failed to load services");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchServices(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = await getToken();
        const promise = async () => {
            if (currentService._id) {
                // Edit Mode
                await api.patch(`/admin/services/${currentService._id}`, currentService, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                // Add Mode
                await api.post('/admin/services', currentService, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            fetchServices();
            setIsModalOpen(false);
            setCurrentService({});
        };

        toast.promise(promise(), {
            loading: 'Saving service...',
            success: 'Service updated successfully!',
            error: 'Error saving service',
        });
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this service?")) return;
        const token = await getToken();
        try {
            await api.delete(`/admin/services/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setServices(services.filter(s => s._id !== id));
            toast.success("Service removed");
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    if (loading) return <div className="p-20 text-center font-bold">Loading Services...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-black text-slate-900">Manage Services</h2>
                    <p className="text-slate-500">Add or modify your business offerings</p>
                </div>
                <button
                    onClick={() => { setCurrentService({}); setIsModalOpen(true); }}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                    <Plus size={20} /> Add Service
                </button>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <div key={service._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-indigo-50 p-3 rounded-2xl">
                                <Layers className="text-indigo-600" size={24} />
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => { setCurrentService(service); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                    <Edit3 size={18} />
                                </button>
                                <button onClick={() => handleDelete(service._id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">{service.name}</h3>
                        <p className="text-slate-500 text-sm mb-4 line-clamp-2">{service.description}</p>
                        <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded-lg">
                                {service.category}
                            </span>
                            <p className="text-xl font-black text-indigo-600 flex items-center italic">
                                <IndianRupee size={16} /> {service.price}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Simplified Modal (Bhai, design isme adjust kar lena) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-300">
                        <h3 className="text-2xl font-black mb-6">{currentService._id ? 'Edit Service' : 'New Service'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                placeholder="Service Name"
                                className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                                value={currentService.name || ''}
                                onChange={e => setCurrentService({ ...currentService, name: e.target.value })}
                                required
                            />
                            <textarea
                                placeholder="Description"
                                className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-medium h-32"
                                value={currentService.description || ''}
                                onChange={e => setCurrentService({ ...currentService, description: e.target.value })}
                            />
                            <div className="flex gap-4">
                                <input
                                    type="number" placeholder="Price"
                                    className="w-1/2 p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                                    value={currentService.price || ''}
                                    onChange={e => setCurrentService({ ...currentService, price: Number(e.target.value) })}
                                />
                                <input
                                    placeholder="Category"
                                    className="w-1/2 p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                                    value={currentService.category || ''}
                                    onChange={e => setCurrentService({ ...currentService, category: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-bold text-slate-500">Cancel</button>
                                <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100">Save Service</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageServices;