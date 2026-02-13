import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import api from '../api/api';
import { Trash2, Plus, MapPin, Loader2, Edit3, X, CheckCircle2, Phone, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const AddressPage = () => {
    const { user } = useUser();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Schema based initial state
    const [formData, setFormData] = useState({
        label: 'Home',
        fullName: '',
        phoneNumber: '',
        addressLine: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false
    });

    useEffect(() => {
        if (user) fetchUser();
    }, [user]);

    const fetchUser = async () => {
        try {
            const res = await api.get(`/user/get-user/${user?.id}`);
            setAddresses(res.data.user.addresses || []);
            console.log("User address fetched")
        } catch (err) {
            console.error(err);
            setAddresses([])
        }
        finally { setLoading(false); }
    };

    const openEdit = (addr: any) => {
        setEditingId(addr._id);
        setFormData({ ...addr });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let res;
            if (editingId) {
                res = await api.put(`/address/update/${user?.id}/${editingId}`, { updatedData: formData });
            } else {
                res = await api.post('/address/add', { clerkId: user?.id, addressData: formData });
                toast.success("Address added successfully !")
            }
            if (res.data && res.data.addresses) {
                setAddresses(res.data.addresses);
                closeModal();
            } else {
                fetchUser();
                closeModal();
            }
        } catch (err) {
            console.error("Submission error:", err);
            toast.error("Action failed, check console.");
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
        setFormData({ label: 'Home', fullName: '', phoneNumber: '', addressLine: '', city: '', state: '', pincode: '', isDefault: false });
    };

    const handleDelete = async (id: string) => {
        toast("Delete Address", {
            description: "Are you sure you want to remove this location?",
            action: {
                label: "Delete",
                onClick: async () => {
                    try {
                        const res = await api.delete(`/address/delete/${user?.id}/${id}`);
                        setAddresses(res.data.addresses);
                        toast.success("Address deleted successfully");
                    } catch (err) {
                        toast.error("Failed to delete address");
                    }
                },
            },
            cancel: {
                label: "Cancel",
                onClick: () => console.log("Cancelled"),
            },
        });
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12 mt-20">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Saved Addresses</h1>
                        <p className="text-slate-500 text-lg mt-2 font-medium">Your primary and secondary delivery locations.</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-xl shadow-slate-200 active:scale-95"
                    >
                        <Plus size={20} strokeWidth={3} /> Add New Address
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {addresses.map((addr: any) => (
                        <motion.div
                            layout
                            key={addr._id}
                            className="bg-white border-2 border-slate-100 rounded-3xl p-6 relative group hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-300"
                        >
                            {addr.isDefault && (
                                <div className="absolute -top-3 left-6 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg shadow-indigo-200">
                                    <CheckCircle2 size={12} /> Default
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-6">
                                <span className="px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-bold text-slate-600 uppercase tracking-wider">{addr.label}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => openEdit(addr)} className="p-2.5 bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all"><Edit3 size={18} /></button>
                                    <button onClick={() => handleDelete(addr._id)} className="p-2.5 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl transition-all"><Trash2 size={18} /></button>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-2 truncate">{addr.fullName}</h3>
                            <div className="space-y-1.5">
                                <p className="text-slate-500 font-medium leading-relaxed line-clamp-2">{addr.addressLine}</p>
                                <p className="text-slate-600 font-bold">{addr.city}, {addr.state} - {addr.pincode}</p>
                            </div>

                            <div className="mt-6 flex items-center gap-2 text-slate-400 font-semibold text-sm">
                                <Phone size={14} /> {addr.phoneNumber}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* --- PROFESSIONAL DIALOG / MODAL --- */}
                <AnimatePresence>
                    {showModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-3xl overflow-hidden border border-white/20"
                            >
                                {/* Header */}
                                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                                        {editingId ? 'Edit Address' : 'New Location'}
                                    </h2>
                                    <button
                                        onClick={closeModal}
                                        className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-600"
                                    >
                                        <X size={24} strokeWidth={2.5} />
                                    </button>
                                </div>

                                {/* Form Container with Hidden Scrollbar */}
                                <form
                                    onSubmit={handleSubmit}
                                    className="p-8 space-y-5 max-h-[75vh] overflow-y-auto scrollbar-hide"
                                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Firefox and IE/Edge
                                >
                                    {/* Webkit scrollbar hide inline CSS */}
                                    <style>{`
            form::-webkit-scrollbar { display: none; }
          `}</style>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Full Name</label>
                                            <input type="text" required placeholder="John Doe" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all font-semibold text-slate-800 placeholder:text-slate-300" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Phone Number</label>
                                            <input type="text" required placeholder="+91 00000 00000" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all font-semibold text-slate-800 placeholder:text-slate-300" value={formData.phoneNumber} onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Address Line</label>
                                        <input type="text" required placeholder="Flat No, Wing, Building, Street" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all font-semibold text-slate-800 placeholder:text-slate-300" value={formData.addressLine} onChange={e => setFormData({ ...formData, addressLine: e.target.value })} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">City</label>
                                            <input type="text" required placeholder="Mumbai" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all font-semibold text-slate-800 placeholder:text-slate-300" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">State</label>
                                            <input type="text" required placeholder="Maharashtra" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all font-semibold text-slate-800 placeholder:text-slate-300" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Pincode</label>
                                            <input type="text" required placeholder="400001" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all font-semibold text-slate-800 placeholder:text-slate-300" value={formData.pincode} onChange={e => setFormData({ ...formData, pincode: e.target.value })} />
                                        </div>

                                        {/* Styled Dropdown */}
                                        <div className="space-y-2 relative">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Address Label</label>
                                            <div className="relative">
                                                <select
                                                    className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all font-bold appearance-none cursor-pointer text-slate-700 pr-12"
                                                    value={formData.label}
                                                    onChange={e => setFormData({ ...formData, label: e.target.value })}
                                                >
                                                    <option value="Home">Home</option>
                                                    <option value="Office">Office</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Default Toggle */}
                                    <div
                                        className="flex items-center gap-3 py-2 cursor-pointer group w-fit"
                                        onClick={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
                                    >
                                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${formData.isDefault ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-200' : 'border-slate-200 group-hover:border-slate-300'}`}>
                                            {formData.isDefault && <CheckCircle2 className="text-white" size={14} strokeWidth={3} />}
                                        </div>
                                        <span className={`text-sm font-bold transition-colors ${formData.isDefault ? 'text-slate-900' : 'text-slate-500'}`}>Set as default address</span>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100 hover:shadow-indigo-200 mt-6 active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        {editingId ? 'Update Shipping Address' : 'Confirm & Save Address'}
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AddressPage;