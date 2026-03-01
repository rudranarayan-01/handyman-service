import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import api from '../api/api';
import { Trash2, Plus, Loader2, Edit3 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import AddressForm from './AddressForm'; // Import your new component

const defaultForm = {
    label: 'Home', fullName: '', phoneNumber: '', addressLine: '', city: '', state: '', pincode: '', isDefault: false,
};

const AddressPage = () => {
    const { user } = useUser();
    const [addresses, setAddresses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState(defaultForm);

    useEffect(() => { if (user) fetchAddresses(); }, [user]);

    const fetchAddresses = async () => {
        try {
            const res = await api.get(`/user/get-user/${user?.id}`);
            setAddresses(res.data.user.addresses || []);
        } catch { setAddresses([]); } finally { setLoading(false); }
    };

    const handleFormSubmit = async (data: any) => {
        setSubmitting(true);
        try {
            const endpoint = editingId ? `/address/update/${user?.id}/${editingId}` : '/address/add';
            const payload = editingId ? { updatedData: data } : { clerkId: user?.id, addressData: data };
            
            const res = await (editingId ? api.put(endpoint, payload) : api.post(endpoint, payload));
            
            setAddresses(res.data.addresses || []);
            toast.success(editingId ? 'Address updated' : 'Address saved');
            closeModal();
        } catch {
            toast.error('Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const openEdit = (addr: any) => {
        setEditingId(addr._id);
        setFormData({ ...addr });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
        setFormData(defaultForm);
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-12 mt-16 md:mt-20">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl md:text-4xl font-black text-slate-900">Saved addresses</h1>
                    <button onClick={() => setShowModal(true)} className="bg-slate-900 text-white p-3 md:px-8 rounded-2xl font-bold flex items-center gap-2">
                        <Plus size={20} /> <span className="hidden md:inline">Add New</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {addresses.map((addr) => (
                        <div key={addr._id} className="bg-white p-6 rounded-3xl border shadow-sm group">
                            <div className="flex justify-between mb-4">
                                <span className="bg-slate-100 px-2 py-1 rounded text-[10px] font-bold uppercase">{addr.label}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => openEdit(addr)} className="text-slate-400 hover:text-indigo-600"><Edit3 size={16}/></button>
                                    <button className="text-slate-400 hover:text-red-500"><Trash2 size={16}/></button>
                                </div>
                            </div>
                            <h3 className="font-bold">{addr.fullName}</h3>
                            <p className="text-slate-500 text-sm">{addr.addressLine}, {addr.city}</p>
                        </div>
                    ))}
                </div>

                <AnimatePresence>
                    {showModal && (
                        <AddressForm 
                            initialData={formData}
                            isEditing={!!editingId}
                            submitting={submitting}
                            onClose={closeModal}
                            onSubmit={handleFormSubmit}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AddressPage;